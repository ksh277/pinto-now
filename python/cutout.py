# cutout.py
import cv2
import numpy as np
import math
from pathlib import Path

# ---- (A) 인물 세그먼트: MediaPipe ----
try:
    import mediapipe as mp
    _HAS_MEDIAPIPE = True
except Exception:
    _HAS_MEDIAPIPE = False

def cm_to_px(cm: float, dpi: int) -> int:
    return int(round((cm / 2.54) * dpi))

def tight_bbox_from_alpha(alpha: np.ndarray, pad_px: int = 0):
    ys, xs = np.where(alpha > 0)
    if len(xs) == 0 or len(ys) == 0:
        return None  # nothing
    x1, x2 = xs.min(), xs.max()
    y1, y2 = ys.min(), ys.max()
    h, w = alpha.shape
    x1 = max(0, x1 - pad_px); y1 = max(0, y1 - pad_px)
    x2 = min(w - 1, x2 + pad_px); y2 = min(h - 1, y2 + pad_px)
    return x1, y1, x2, y2

def add_top_ring(alpha: np.ndarray, center_x: int, top_y: int, radius: int):
    """
    투명 알파 위에 '구멍(고리)'을 뚫는다. (원형 투명 영역)
    """
    h, w = alpha.shape
    y, x = np.ogrid[:h, :w]
    mask_circle = (x - center_x) ** 2 + (y - top_y) ** 2 <= radius ** 2
    # 구멍은 완전 투명
    out = alpha.copy()
    out[mask_circle] = 0
    return out

def feather_alpha(alpha: np.ndarray, radius: int = 3):
    if radius <= 0: 
        return alpha
    k = radius * 2 + 1
    a = cv2.GaussianBlur(alpha, (k, k), 0)
    # normalize 0..255
    a = cv2.normalize(a, None, 0, 255, cv2.NORM_MINMAX)
    return a.astype(np.uint8)

def mediapipe_person_mask(bgr: np.ndarray) -> np.ndarray:
    """
    인물 사진일 때 정교한 전경 마스크(0~255)를 만든다.
    """
    if not _HAS_MEDIAPIPE:
        return None
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    mp_selfie = mp.solutions.selfie_segmentation.SelfieSegmentation(model_selection=1)
    with mp_selfie as seg:
        res = seg.process(rgb)
    m = (res.segmentation_mask * 255).astype(np.uint8)

    # 노이즈 정리 + 경계 부드럽게
    m = cv2.GaussianBlur(m, (5,5), 0)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5,5), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN,  np.ones((3,3), np.uint8))
    return m

def auto_grabcut_mask(bgr: np.ndarray) -> np.ndarray:
    """
    사람 아닌 이미지도 처리하기 위한 GrabCut 자동 씨딩.
    - 에지/살리언시로 전경 후보 박스 생성 → GrabCut → 마스크(0~255)
    """
    h, w = bgr.shape[:2]

    # 살리언시(간단 버전: 라플라시안 기반 에지 밀도로 전경 후보 영역 찾기)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 60, 180)
    # 커널로 팽창해 전경 후보 뭉치 만들기
    edges = cv2.dilate(edges, np.ones((5,5), np.uint8), iterations=1)

    # 가장 큰 컨투어 bbox를 전경 초기 박스로 사용
    cnts, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cnts:
        rect = (w//10, h//10, int(w*0.8), int(h*0.8))
    else:
        cnt = max(cnts, key=cv2.contourArea)
        x,y,ww,hh = cv2.boundingRect(cnt)
        # 여유
        padx, pady = int(ww*0.05), int(hh*0.05)
        rect = (max(0,x-padx), max(0,y-pady), min(ww+2*padx, w), min(hh+2*pady, h))

    # GrabCut
    bgdModel = np.zeros((1,65), np.float64)
    fgdModel = np.zeros((1,65), np.float64)
    mask = np.zeros((h,w), np.uint8)
    cv2.grabCut(bgr, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)

    # 확정 전경/가능 전경 → 255, 나머지 0
    result_mask = np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD), 255, 0).astype('uint8')

    # 마스크 정리
    result_mask = cv2.morphologyEx(result_mask, cv2.MORPH_CLOSE, np.ones((5,5), np.uint8))
    result_mask = cv2.medianBlur(result_mask, 5)
    return result_mask

def apply_alpha_and_crop(bgr: np.ndarray, mask_0_255: np.ndarray, 
                         margin_px: int = 0, feather_px: int = 2,
                         add_ring: bool = False, ring_radius_px: int = 14, ring_gap_px: int = 6):
    """
    - 마스크 → 알파 결합
    - 타이트 크롭(+마진)
    - 선택: 상단 중앙 '고리' 구멍
    """
    h, w = bgr.shape[:2]
    alpha = mask_0_255.copy()

    # 가장자리 부드럽게
    alpha = feather_alpha(alpha, feather_px)

    # 타이트 bbox
    bbox = tight_bbox_from_alpha(alpha, pad_px=margin_px)
    if bbox is None:
        # 전경이 없으면 원본 크기에 알파 0만 반환
        out = np.dstack([bgr, np.zeros((h,w), np.uint8)])
        return out

    x1,y1,x2,y2 = bbox
    cut_bgr  = bgr[y1:y2+1, x1:x2+1].copy()
    cut_alpha= alpha[y1:y2+1, x1:x2+1].copy()

    if add_ring:
        ch, cw = cut_alpha.shape
        cx = cw//2
        top_y = max(0, int(ring_radius_px + max(1, ring_gap_px)))
        cut_alpha = add_top_ring(cut_alpha, cx, top_y, ring_radius_px)

    out = np.dstack([cut_bgr, cut_alpha])
    return out

def save_png_rgba(path: str, rgba: np.ndarray):
    cv2.imwrite(path, rgba, [cv2.IMWRITE_PNG_COMPRESSION, 9])

def cutout(
    input_path: str,
    output_path: str,
    dpi: int = 300,
    margin_cm: float = 0.0,
    force_general: bool = False,
    add_ring: bool = False,
    ring_diameter_mm: float = 6.0,
    ring_gap_mm: float = 3.0,
    feather_px: int = 2
):
    """
    input_path -> 알파 PNG 컷아웃을 output_path로 저장.
    - 사람 이미지면 MediaPipe 우선. (force_general=True 면 건너뜀)
    - 그 외엔 GrabCut 기반 일반 오브젝트 컷아웃.
    - margin_cm: 결과 캔버스 여백(양쪽)
    - add_ring: 상단 중앙 원형 구멍
    """
    bgr = cv2.imread(input_path, cv2.IMREAD_COLOR)
    if bgr is None:
        raise FileNotFoundError(input_path)

    margin_px = cm_to_px(margin_cm, dpi) if margin_cm > 0 else 0
    ring_radius_px = int(round((ring_diameter_mm/2.0) / 25.4 * dpi))
    ring_gap_px    = int(round((ring_gap_mm) / 25.4 * dpi))

    mask = None
    if _HAS_MEDIAPIPE and not force_general:
        try:
            mask = mediapipe_person_mask(bgr)
        except Exception:
            mask = None

    if mask is None or mask.sum() == 0:
        mask = auto_grabcut_mask(bgr)

    out = apply_alpha_and_crop(
        bgr, mask,
        margin_px=margin_px, feather_px=feather_px,
        add_ring=add_ring, ring_radius_px=ring_radius_px, ring_gap_px=ring_gap_px
    )
    save_png_rgba(output_path, out)
    return out

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(description="Alpha cut-out (die-cut) generator")
    p.add_argument("input", help="입력 이미지 경로")
    p.add_argument("output", help="출력 PNG 경로(알파 포함)")
    p.add_argument("--dpi", type=int, default=300)
    p.add_argument("--margin-cm", type=float, default=0.0)
    p.add_argument("--force-general", action="store_true", help="사람 인식 건너뛰고 일반(GrabCut) 파이프라인 강제")
    p.add_argument("--add-ring", action="store_true", help="상단 중앙 원형 고리 구멍 추가")
    p.add_argument("--ring-mm", type=float, default=6.0, help="고리 지름(mm)")
    p.add_argument("--ring-gap-mm", type=float, default=3.0, help="상단에서 고리까지 간격(mm)")
    p.add_argument("--feather", type=int, default=2, help="알파 feather(가우시안 반경 픽셀)")
    args = p.parse_args()

    cutout(
        args.input, args.output,
        dpi=args.dpi,
        margin_cm=args.margin_cm,
        force_general=args.force_general,
        add_ring=args.add_ring,
        ring_diameter_mm=args.ring_mm,
        ring_gap_mm=args.ring_gap_mm,
        feather_px=args.feather
    )
    print("Saved:", args.output)