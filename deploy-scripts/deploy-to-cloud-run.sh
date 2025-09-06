#!/bin/bash

# Google Cloud Run에 PINTO 애플리케이션 배포 스크립트
# Cloud Build를 사용하여 자동으로 빌드하고 배포합니다.

set -e  # 오류 발생 시 스크립트 중단

# 색깔 출력 함수
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 필수 환경변수 확인
if [ -z "$PROJECT_ID" ]; then
    error "PROJECT_ID 환경변수를 설정해주세요."
    echo "예: export PROJECT_ID=your-project-id"
    exit 1
fi

# 기본값 설정
SERVICE_NAME=${SERVICE_NAME:-"pinto-app"}
REGION=${REGION:-"us-central1"}
INSTANCE_NAME=${INSTANCE_NAME:-"pinto-db"}

info "=== PINTO 애플리케이션을 Google Cloud Run에 배포합니다 ==="
info "프로젝트 ID: $PROJECT_ID"
info "서비스 이름: $SERVICE_NAME"
info "리전: $REGION"
info "DB 인스턴스: $INSTANCE_NAME"

# 현재 디렉터리 확인
if [ ! -f "../package.json" ]; then
    error "PINTO 프로젝트 루트에서 스크립트를 실행해주세요."
    exit 1
fi

# gcloud 인증 및 프로젝트 설정 확인
step "1. Google Cloud 인증 상태 확인"
if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | head -1 > /dev/null; then
    error "Google Cloud에 로그인되어 있지 않습니다."
    echo "다음 명령어로 로그인하세요: gcloud auth login"
    exit 1
fi

info "프로젝트를 설정합니다: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# 필요한 API 활성화
step "2. 필요한 Google Cloud API 활성화"
info "필요한 API들을 활성화합니다..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Cloud SQL 인스턴스 존재 확인
step "3. Cloud SQL 인스턴스 확인"
if ! gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID >/dev/null 2>&1; then
    error "Cloud SQL 인스턴스 '$INSTANCE_NAME'를 찾을 수 없습니다."
    echo "먼저 setup-cloud-sql.sh 스크립트를 실행하여 데이터베이스를 설정하세요."
    exit 1
fi
info "Cloud SQL 인스턴스 '$INSTANCE_NAME' 확인됨"

# 환경변수 파일 확인
step "4. 환경변수 설정 확인"
if [ -f "../.env.cloud" ]; then
    info "환경변수 파일을 로드합니다: .env.cloud"
    source ../.env.cloud
else
    warning ".env.cloud 파일을 찾을 수 없습니다."
    info "기본값을 사용합니다."
fi

# 프로젝트 루트로 이동
cd ..

# Cloud Build를 사용하여 빌드 및 배포
step "5. Cloud Build를 사용하여 애플리케이션 빌드"
info "cloudbuild.yaml을 사용하여 빌드를 시작합니다..."

# Cloud Build 실행
BUILD_ID=$(gcloud builds submit \
    --config=cloudbuild.yaml \
    --substitutions=_SERVICE_NAME=$SERVICE_NAME,_REGION=$REGION,_INSTANCE_NAME=$INSTANCE_NAME \
    --format="value(id)")

if [ $? -eq 0 ]; then
    info "빌드가 성공적으로 완료되었습니다. Build ID: $BUILD_ID"
else
    error "빌드가 실패했습니다."
    exit 1
fi

# 빌드 로그 출력 (선택적)
info "빌드 로그를 확인하려면 다음 명령어를 사용하세요:"
echo "gcloud builds log $BUILD_ID"

step "6. Cloud Run 서비스 환경변수 설정"

# Cloud SQL 연결 정보 설정
CONNECTION_NAME="$PROJECT_ID:$REGION:$INSTANCE_NAME"

info "Cloud Run 서비스에 환경변수를 설정합니다..."
gcloud run services update $SERVICE_NAME \
    --region=$REGION \
    --set-env-vars="NODE_ENV=production" \
    --set-env-vars="NEXT_STRICT=false" \
    --set-env-vars="DATABASE_URL=mysql://$DB_USER:$DB_PASSWORD@/$DB_NAME?host=/cloudsql/$CONNECTION_NAME" \
    --set-env-vars="PORT=3000" \
    --set-env-vars="HOSTNAME=0.0.0.0" \
    --add-cloudsql-instances=$CONNECTION_NAME

# 서비스 URL 가져오기
step "7. 배포 완료 확인"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

if [ -n "$SERVICE_URL" ]; then
    info "=== 배포가 완료되었습니다! ==="
    echo ""
    echo "🎉 애플리케이션이 성공적으로 배포되었습니다!"
    echo ""
    echo "서비스 URL: $SERVICE_URL"
    echo "서비스 이름: $SERVICE_NAME"
    echo "리전: $REGION"
    echo "프로젝트 ID: $PROJECT_ID"
    echo ""
    echo "📊 서비스 상태 확인:"
    echo "gcloud run services describe $SERVICE_NAME --region=$REGION"
    echo ""
    echo "📝 로그 확인:"
    echo "gcloud run services logs read $SERVICE_NAME --region=$REGION"
    echo ""
    echo "🔧 서비스 설정 업데이트:"
    echo "gcloud run services update $SERVICE_NAME --region=$REGION [옵션]"
    echo ""
    
    # 헬스 체크 (선택적)
    info "헬스 체크를 수행합니다..."
    if curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL" | grep -q "200"; then
        info "✅ 애플리케이션이 정상적으로 응답합니다!"
    else
        warning "⚠️ 애플리케이션 응답에 문제가 있을 수 있습니다. 로그를 확인하세요."
    fi
    
else
    error "서비스 URL을 가져올 수 없습니다. 배포에 문제가 있을 수 있습니다."
    exit 1
fi

info "배포 스크립트가 완료되었습니다!"