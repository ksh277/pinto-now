# Vercel Blob Storage 설정 가이드

## 1. Vercel Blob 설치
```bash
npm install @vercel/blob
```

## 2. Vercel 대시보드에서 설정
- Vercel 프로젝트 → Settings → Storage → Create Database
- Blob 선택 → Create
- Environment Variables 자동 생성됨:
  - `BLOB_READ_WRITE_TOKEN`

## 3. 이미지 업로드 API 수정

### 기존 Google Cloud Storage 대신 Vercel Blob 사용:

```typescript
// src/app/api/banners/route.ts
import { put } from '@vercel/blob';

// 파일 업로드 부분을 다음과 같이 수정:
if (image) {
  const blob = await put(`banners/${Date.now()}-${image.name}`, image, {
    access: 'public',
  });
  
  imageUrl = blob.url; // Vercel Blob URL
}
```

## 4. 장점
✅ **Vercel과 완벽 호환**
✅ **자동 CDN 제공**
✅ **무료 할당량 넉넉함**
✅ **설정 초간단**
✅ **HTTPS 자동 제공**
✅ **Git 푸시 후 바로 작동**

## 5. 현재 상태 예상 결과
- 배너 등록: ✅ 잘 됨
- 탑배너 표시: ✅ 잘 나옴  
- 카테고리 숏컷: ✅ 잘 나옴
- 모든 이미지: ✅ 빠른 로딩

## 6. 대안책
현재 설정 그대로도 Vercel 환경변수만 넣으면 작동할 가능성 높음!