#!/bin/bash

# Pinto 애플리케이션 배포 스크립트
# Usage: ./deploy.sh

set -e

echo "🚀 Pinto 애플리케이션 배포 시작..."

# 환경 변수 설정
PROJECT_ID="cellular-client-470408-j4"
REGION="us-central1"
SQL_REGION="us-west1"
SERVICE_NAME="pinto-app"
SQL_INSTANCE="pinto-db"

# Google Cloud CLI 경로 설정
export PATH="$HOME/google-cloud-sdk/bin:$PATH"

echo "📋 1단계: Google Cloud 프로젝트 설정 확인..."
gcloud config set project $PROJECT_ID

echo "🔐 2단계: 서비스 계정 생성..."
# 서비스 계정이 이미 있는지 확인
if ! gcloud iam service-accounts describe github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com >/dev/null 2>&1; then
    echo "서비스 계정 생성 중..."
    gcloud iam service-accounts create github-actions-sa \
      --description="GitHub Actions service account for Pinto deployment" \
      --display-name="GitHub Actions SA"
    
    # 권한 부여
    echo "권한 부여 중..."
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
      --role="roles/run.admin"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
      --role="roles/storage.admin"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
      --role="roles/cloudsql.client"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
      --role="roles/iam.serviceAccountUser"
    
    # 서비스 계정 키 생성
    echo "서비스 계정 키 생성 중..."
    gcloud iam service-accounts keys create github-actions-key.json \
      --iam-account=github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com
else
    echo "서비스 계정이 이미 존재합니다."
fi

echo "🗄️ 3단계: Cloud SQL 인스턴스 설정..."
# Cloud SQL 인스턴스 확인/생성
if ! gcloud sql instances describe $SQL_INSTANCE >/dev/null 2>&1; then
    echo "Cloud SQL 인스턴스 생성 중..."
    gcloud sql instances create $SQL_INSTANCE \
      --database-version=MYSQL_8_0 \
      --tier=db-f1-micro \
      --region=$SQL_REGION \
      --root-password="SecureRootPass2024!" \
      --storage-auto-increase \
      --backup \
      --enable-bin-log
    
    # 데이터베이스 생성
    echo "pinto 데이터베이스 생성 중..."
    gcloud sql databases create pinto --instance=$SQL_INSTANCE
    
    # 사용자 생성
    echo "애플리케이션 사용자 생성 중..."
    gcloud sql users create pinto-user \
      --instance=$SQL_INSTANCE \
      --password="pinto123!"
else
    echo "Cloud SQL 인스턴스가 이미 존재합니다."
fi

echo "🐳 4단계: Docker 이미지 빌드 및 푸시..."
# Docker 인증 설정
gcloud auth configure-docker

# 이미지 빌드
echo "Docker 이미지 빌드 중..."
docker build -f Dockerfile.production -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .

# 이미지 푸시
echo "Docker 이미지 푸시 중..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

echo "☁️ 5단계: Cloud Run 서비스 배포..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --set-cloudsql-instances $PROJECT_ID:$SQL_REGION:$SQL_INSTANCE \
  --set-env-vars "NODE_ENV=production,NEXT_STRICT=false" \
  --set-env-vars "DATABASE_URL=mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/$PROJECT_ID:$SQL_REGION:$SQL_INSTANCE" \
  --set-env-vars "NEXTAUTH_SECRET=pinto-super-secret-key-2024-production-cellular-client" \
  --quiet

echo "🎉 배포 완료!"

# 서비스 URL 출력
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')
echo "🌐 서비스 URL: $SERVICE_URL"

echo ""
echo "📝 다음 단계:"
echo "1. GitHub Secrets에 다음 정보를 추가하세요:"
echo "   - GCP_SA_KEY: github-actions-key.json 파일 내용"
echo "   - DATABASE_URL: mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/$PROJECT_ID:$SQL_REGION:$SQL_INSTANCE"
echo "   - NEXTAUTH_URL: $SERVICE_URL"
echo "   - NEXTAUTH_SECRET: pinto-super-secret-key-2024-production-cellular-client"
echo "   - CLOUD_SQL_CONNECTION_NAME: $PROJECT_ID:$SQL_REGION:$SQL_INSTANCE"
echo ""
echo "2. 데이터베이스 스키마를 배포하세요:"
echo "   ./cloud_sql_proxy -instances=$PROJECT_ID:$SQL_REGION:$SQL_INSTANCE=tcp:3306 &"
echo "   mysql -h 127.0.0.1 -u root -p < deploy_to_cloud_sql.sql"
echo "   mysql -h 127.0.0.1 -u root -p < insert-sample-data.sql"
echo ""
echo "3. $SERVICE_URL로 접속해서 애플리케이션을 확인하세요!"