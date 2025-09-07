#!/bin/bash

echo "🚀 직접 배포 시작! (역할 설정 없이)"
echo "================================="

# 환경변수 설정
PROJECT_ID="cellular-client-470408-j4"
SERVICE_NAME="pinto-app"
REGION="us-central1"

echo "📦 1단계: 앱 빌드"
echo "pnpm 설치 및 빌드 중..."
npm install -g pnpm
pnpm install --no-frozen-lockfile
pnpm prisma:generate  
pnpm build

echo "🐳 2단계: Docker 이미지 빌드"
echo "간단한 Dockerfile로 이미지 빌드 중..."
docker build -f Dockerfile.simple -t pinto-local .

echo "☁️ 3단계: Google Cloud 설정 확인"
# Google Cloud CLI 경로 설정
export PATH="$HOME/google-cloud-sdk/bin:$PATH"

# 현재 계정으로 배포 시도
gcloud config set project $PROJECT_ID

echo "🚢 4단계: Cloud Run에 배포 시도"
echo "현재 계정으로 배포 중..."

# 이미지에 태그 추가
docker tag pinto-local gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

# 도커 인증
gcloud auth configure-docker

# 이미지 푸시
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

# Cloud Run 배포
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,NEXT_STRICT=false" \
  --set-env-vars "DATABASE_URL=mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/$PROJECT_ID:us-west1:pinto-db" \
  --set-env-vars "NEXTAUTH_SECRET=pinto-super-secret-key-2024-production" \
  --set-cloudsql-instances "$PROJECT_ID:us-west1:pinto-db" \
  --quiet

echo "🎉 배포 완료!"
echo "서비스 URL:"
gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)'