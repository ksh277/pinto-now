# Vercel Blob Storage 환경변수 설정

## 1. .env.local 파일에 추가해야 할 항목:

```bash
# Vercel Blob Storage Token (Vercel 대시보드에서 복사)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx

# 기존 환경변수들은 그대로 유지
NEXT_PUBLIC_APP_URL=http://localhost:3030
DATABASE_URL=your_planetscale_url
# ... 기타 Google Cloud 설정들
```

## 2. Vercel 대시보드에서 토큰 찾는 방법:
1. Vercel 프로젝트 → Settings → Storage → Blob
2. "Environment Variables" 섹션에서 `BLOB_READ_WRITE_TOKEN` 복사
3. .env.local에 추가

## 3. 토큰이 추가되면 다음 명령어로 테스트:
```bash
node test-vercel-blob-upload.js
```

## 4. 성공 시 예상 결과:
✅ Vercel Blob 업로드 성공!
   배너 ID: 38
   이미지 URL: https://xxxxxxxxx.blob.vercel-storage.com/banners/xxxxx.jpg
   🎉 Vercel Blob Storage가 정상 작동합니다!