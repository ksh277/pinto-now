# PINTO Google Cloud 배포 가이드

PINTO 맞춤 굿즈 인쇄 애플리케이션을 Google Cloud Run + Cloud SQL로 배포하는 가이드입니다.

## 📋 사전 요구사항

1. **Google Cloud Platform 계정** 및 프로젝트 생성
2. **Google Cloud CLI (gcloud) 설치** 및 인증
3. **충분한 권한**: Cloud SQL Admin, Cloud Run Admin, Cloud Build Editor
4. **로컬 환경**: Node.js, Docker (선택적)

## 🚀 배포 단계

### 1단계: Google Cloud 프로젝트 설정

```bash
# Google Cloud에 로그인
gcloud auth login

# 새 프로젝트 생성 (선택적)
gcloud projects create your-project-id

# 프로젝트 설정
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# 결제 계정 연결 (Google Cloud Console에서 수행)
```

### 2단계: Cloud SQL 데이터베이스 설정

```bash
cd deploy-scripts

# 환경변수 설정
export PROJECT_ID=your-project-id
export INSTANCE_NAME=pinto-db
export REGION=us-central1
export DB_PASSWORD=your-secure-password

# Cloud SQL 인스턴스 및 데이터베이스 생성
chmod +x setup-cloud-sql.sh
./setup-cloud-sql.sh
```

### 3단계: 데이터베이스 스키마 설정

```bash
# 생성된 Cloud SQL 인스턴스에 연결하여 스키마 설정
gcloud sql connect pinto-db --user=pinto_user

# 또는 SQL 파일을 직접 실행
gcloud sql import sql pinto-db gs://your-bucket/deploy_to_cloud_sql.sql --database=pinto
```

### 4단계: 애플리케이션 배포

```bash
# 같은 환경변수 유지
export PROJECT_ID=your-project-id
export SERVICE_NAME=pinto-app
export REGION=us-central1

# Cloud Run에 배포
chmod +x deploy-to-cloud-run.sh
./deploy-to-cloud-run.sh
```

## 📁 파일 구조

```
pinto/
├── deploy-scripts/
│   ├── setup-cloud-sql.sh          # Cloud SQL 설정 스크립트
│   ├── deploy-to-cloud-run.sh      # Cloud Run 배포 스크립트
│   └── README.md                   # 이 파일
├── cloudbuild.yaml                 # Cloud Build 설정
├── Dockerfile.production           # 프로덕션 Docker 파일
├── deploy_to_cloud_sql.sql         # 데이터베이스 스키마
├── .env.production                 # 프로덕션 환경변수 템플릿
└── .env.cloud                      # 생성된 Cloud 환경변수
```

## ⚙️ 주요 설정

### 환경변수

- `PROJECT_ID`: Google Cloud 프로젝트 ID
- `INSTANCE_NAME`: Cloud SQL 인스턴스 이름 (기본값: pinto-db)
- `SERVICE_NAME`: Cloud Run 서비스 이름 (기본값: pinto-app)
- `REGION`: 배포 리전 (기본값: us-central1)
- `DB_PASSWORD`: 데이터베이스 비밀번호

### Cloud SQL 설정

- **인스턴스 타입**: db-f1-micro (개발용)
- **MySQL 버전**: 8.0
- **스토리지**: 10GB SSD
- **백업**: 매일 03:00 UTC

### Cloud Run 설정

- **메모리**: 2Gi
- **CPU**: 2 vCPU
- **최대 인스턴스**: 10개
- **포트**: 3000
- **동시성**: 80개 요청

## 🔧 배포 후 설정

### 1. 커스텀 도메인 연결 (선택적)

```bash
# 도메인 매핑
gcloud run domain-mappings create --service=pinto-app --domain=your-domain.com --region=us-central1
```

### 2. SSL 인증서 자동 관리

Google Cloud Run은 커스텀 도메인에 대해 자동으로 SSL 인증서를 관리합니다.

### 3. 환경변수 업데이트

```bash
# 환경변수 업데이트
gcloud run services update pinto-app \
    --region=us-central1 \
    --set-env-vars="NEW_ENV_VAR=value"
```

## 📊 모니터링 및 로그

### 애플리케이션 로그 확인

```bash
# 실시간 로그 스트림
gcloud run services logs tail pinto-app --region=us-central1

# 최근 로그 조회
gcloud run services logs read pinto-app --region=us-central1 --limit=50
```

### Cloud SQL 모니터링

```bash
# Cloud SQL 인스턴스 상태
gcloud sql instances describe pinto-db

# 연결 확인
gcloud sql connect pinto-db --user=pinto_user
```

### 서비스 메트릭

Google Cloud Console에서 다음을 모니터링할 수 있습니다:
- 요청 수 및 지연 시간
- 오류율
- 인스턴스 사용률
- 데이터베이스 연결 수

## 🔍 트러블슈팅

### 일반적인 문제

1. **빌드 실패**
   ```bash
   # 빌드 로그 확인
   gcloud builds log [BUILD_ID]
   ```

2. **데이터베이스 연결 오류**
   ```bash
   # Cloud SQL 인스턴스 상태 확인
   gcloud sql instances describe pinto-db
   
   # 연결 테스트
   gcloud sql connect pinto-db --user=pinto_user
   ```

3. **서비스 응답 없음**
   ```bash
   # 서비스 로그 확인
   gcloud run services logs read pinto-app --region=us-central1
   
   # 서비스 상태 확인
   gcloud run services describe pinto-app --region=us-central1
   ```

### 로그 레벨 설정

```bash
# 디버그 로그 활성화
gcloud run services update pinto-app \
    --region=us-central1 \
    --set-env-vars="LOG_LEVEL=debug"
```

## 💰 비용 최적화

1. **Cloud Run**
   - 요청이 없을 때 0으로 스케일링
   - 실제 사용 시간만 과금

2. **Cloud SQL**
   - 개발 환경에서는 db-f1-micro 사용
   - 프로덕션에서는 db-n1-standard-1 이상 권장

3. **스토리지**
   - 이미지는 Cloud Storage 사용
   - CDN 설정으로 전송 비용 절약

## 🔄 업데이트 및 롤백

### 새 버전 배포

```bash
# 코드 변경 후 재배포
./deploy-to-cloud-run.sh
```

### 이전 버전으로 롤백

```bash
# 이전 리비전으로 트래픽 이동
gcloud run services update-traffic pinto-app --region=us-central1 --to-revisions=REVISION_NAME=100
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. [Google Cloud Run 문서](https://cloud.google.com/run/docs)
2. [Cloud SQL 문서](https://cloud.google.com/sql/docs)
3. 프로젝트 로그 및 모니터링 콘솔

---

🎉 **축하합니다!** PINTO 애플리케이션이 Google Cloud에 성공적으로 배포되었습니다.