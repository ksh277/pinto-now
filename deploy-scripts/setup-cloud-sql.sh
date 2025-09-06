#!/bin/bash

# Cloud SQL MySQL 인스턴스 설정 스크립트
# Google Cloud Platform에서 PINTO 애플리케이션용 데이터베이스 설정

set -e  # 오류 발생 시 스크립트 중단

# 색깔 출력 함수
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 필수 환경변수 확인
if [ -z "$PROJECT_ID" ]; then
    error "PROJECT_ID 환경변수를 설정해주세요."
    echo "예: export PROJECT_ID=your-project-id"
    exit 1
fi

# 기본값 설정
INSTANCE_NAME=${INSTANCE_NAME:-"pinto-db"}
REGION=${REGION:-"us-central1"}
DB_VERSION=${DB_VERSION:-"MYSQL_8_0"}
TIER=${TIER:-"db-f1-micro"}
DB_NAME=${DB_NAME:-"pinto"}
DB_USER=${DB_USER:-"pinto_user"}

info "=== PINTO Cloud SQL 설정을 시작합니다 ==="
info "프로젝트 ID: $PROJECT_ID"
info "인스턴스 이름: $INSTANCE_NAME"
info "리전: $REGION"
info "데이터베이스 버전: $DB_VERSION"
info "티어: $TIER"

# gcloud 인증 및 프로젝트 설정 확인
info "Google Cloud 인증 상태를 확인합니다..."
if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | head -1 > /dev/null; then
    error "Google Cloud에 로그인되어 있지 않습니다."
    echo "다음 명령어로 로그인하세요: gcloud auth login"
    exit 1
fi

info "프로젝트를 설정합니다: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# 필요한 API 활성화
info "필요한 Google Cloud API들을 활성화합니다..."
gcloud services enable sqladmin.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Cloud SQL 인스턴스 생성 (이미 존재하는 경우 스킵)
info "Cloud SQL 인스턴스를 생성합니다..."
if gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID >/dev/null 2>&1; then
    warning "인스턴스 '$INSTANCE_NAME'가 이미 존재합니다. 생성을 건너뜁니다."
else
    info "새 Cloud SQL 인스턴스를 생성 중입니다..."
    gcloud sql instances create $INSTANCE_NAME \
        --database-version=$DB_VERSION \
        --tier=$TIER \
        --region=$REGION \
        --root-password=temp_root_password_change_me \
        --storage-type=SSD \
        --storage-size=10GB \
        --availability-type=zonal \
        --backup-start-time=03:00
    
    info "인스턴스 생성이 완료되었습니다."
fi

# 데이터베이스 생성
info "데이터베이스 '$DB_NAME'를 생성합니다..."
if gcloud sql databases describe $DB_NAME --instance=$INSTANCE_NAME --project=$PROJECT_ID >/dev/null 2>&1; then
    warning "데이터베이스 '$DB_NAME'가 이미 존재합니다."
else
    gcloud sql databases create $DB_NAME --instance=$INSTANCE_NAME
    info "데이터베이스가 생성되었습니다."
fi

# 사용자 생성
info "데이터베이스 사용자 '$DB_USER'를 생성합니다..."
if [ -z "$DB_PASSWORD" ]; then
    # 랜덤 비밀번호 생성
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    warning "비밀번호가 설정되지 않았습니다. 랜덤 비밀번호를 생성했습니다."
fi

# 사용자가 이미 존재하는지 확인하고 생성
if gcloud sql users describe $DB_USER --instance=$INSTANCE_NAME --project=$PROJECT_ID >/dev/null 2>&1; then
    warning "사용자 '$DB_USER'가 이미 존재합니다."
    info "비밀번호를 업데이트합니다..."
    gcloud sql users set-password $DB_USER --instance=$INSTANCE_NAME --password=$DB_PASSWORD
else
    gcloud sql users create $DB_USER --instance=$INSTANCE_NAME --password=$DB_PASSWORD
    info "데이터베이스 사용자가 생성되었습니다."
fi

# 연결 정보 출력
info "=== 데이터베이스 설정이 완료되었습니다! ==="
echo ""
echo "연결 정보:"
echo "프로젝트 ID: $PROJECT_ID"
echo "인스턴스 이름: $INSTANCE_NAME"
echo "리전: $REGION"
echo "데이터베이스: $DB_NAME"
echo "사용자: $DB_USER"
echo "비밀번호: $DB_PASSWORD"
echo ""

# 연결 문자열 생성
CONNECTION_NAME="$PROJECT_ID:$REGION:$INSTANCE_NAME"
DATABASE_URL="mysql://$DB_USER:$DB_PASSWORD@/$DB_NAME?host=/cloudsql/$CONNECTION_NAME"

info "데이터베이스 연결 문자열:"
echo "DATABASE_URL=\"$DATABASE_URL\""
echo ""

# 환경변수 파일 생성
ENV_FILE="../.env.cloud"
info "환경변수 파일을 생성합니다: $ENV_FILE"
cat > $ENV_FILE << EOF
# Cloud SQL 연결 정보 - $(date)
PROJECT_ID=$PROJECT_ID
INSTANCE_CONNECTION_NAME=$CONNECTION_NAME
DATABASE_URL="$DATABASE_URL"

# 직접 연결 정보
DB_HOST="/cloudsql/$CONNECTION_NAME"
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# Cloud Run 환경변수로 설정할 값들
NODE_ENV=production
NEXT_STRICT=false
PORT=3000
HOSTNAME="0.0.0.0"
EOF

info "환경변수 파일이 생성되었습니다: $ENV_FILE"
echo ""

warning "다음 단계:"
echo "1. 생성된 비밀번호를 안전한 곳에 저장하세요"
echo "2. deploy_to_cloud_sql.sql 스크립트를 실행하여 테이블을 생성하세요:"
echo "   gcloud sql connect $INSTANCE_NAME --user=$DB_USER < ../deploy_to_cloud_sql.sql"
echo "3. Cloud Run 서비스에 환경변수를 설정하세요"
echo ""

info "Cloud SQL 설정이 완료되었습니다!"