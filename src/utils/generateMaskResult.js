/**
 * 마스크 결과 생성 헬퍼 함수
 */
export function generateMaskResult(contour, marginCm, originalWidth, originalHeight) {
  // Import helper functions
  const { expandContour, contourToSvgPath, calculateBoundingBox } = require('./imageUtils');
  
  // 여백 추가한 윤곽선 생성
  const marginPixels = marginCm * 37.8; // 1cm ≈ 37.8px
  const expandedContour = expandContour(contour, marginPixels);
  
  // SVG 패스 생성
  const pathString = contourToSvgPath(expandedContour);
  
  // 바운딩 박스 계산
  const boundingBox = calculateBoundingBox(expandedContour);
  
  // 캔버스 크기 계산 (mm 단위)
  const pixelsPerMm = 37.8 / 10; // 1mm ≈ 3.78px
  const canvasWidthMm = boundingBox.width / pixelsPerMm;
  const canvasHeightMm = boundingBox.height / pixelsPerMm;
  
  // 픽셀 단위로 변환 (MM_TO_PX_RATIO = 10 사용)
  const MM_TO_PX_RATIO = 10;
  const canvasWidthPx = Math.round(canvasWidthMm * MM_TO_PX_RATIO);
  const canvasHeightPx = Math.round(canvasHeightMm * MM_TO_PX_RATIO);
  
  // 좌표를 캔버스 중앙에 맞추기 위한 조정된 윤곽선 생성
  const adjustedContour = expandedContour.map(point => ({
    x: (point.x - boundingBox.x) * (canvasWidthPx / boundingBox.width),
    y: (point.y - boundingBox.y) * (canvasHeightPx / boundingBox.height)
  }));
  
  // 조정된 SVG 패스 생성
  const adjustedPathString = contourToSvgPath(adjustedContour);
  
  return {
    // 캔버스 크기 정보
    width: canvasWidthPx,
    height: canvasHeightPx,
    widthMM: Math.round(canvasWidthMm * 10) / 10,
    heightMM: Math.round(canvasHeightMm * 10) / 10,
    
    // 마스크 정보 (캔버스 크기에 맞게 조정됨)
    maskPath: adjustedPathString,
    contour: adjustedContour,
    boundingBox: {
      x: 0,
      y: 0,
      width: canvasWidthPx,
      height: canvasHeightPx
    },
    marginCm: marginCm,
    
    // 원본 정보 (디버깅용)
    originalContour: expandedContour,
    originalBoundingBox: boundingBox
  };
}