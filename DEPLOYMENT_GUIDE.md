# PINTO 애플리케이션 Google Cloud 배포 가이드

## 🚀 배포 준비 완료 상태

✅ **완료된 작업들:**
- UI 개선: 주간 랭킹 통계 숨김 처리
- UI 개선: 상단 배너 컨트롤 우측 정렬
- 데이터베이스 동기화 (54+ 테이블 구조 완료)
- 관리자 계정 생성 (admin/ha1045)
- 샘플 데이터 삽입 완료
- 개발 서버 정상 동작 확인 (localhost:3000)

## 📋 배포 전 요구사항

### 1. Google Cloud 프로젝트 설정
```bash
# Google Cloud CLI 설치 (아직 설치되지 않음)
# Windows용: https://cloud.google.com/sdk/docs/install
# 또는 PowerShell에서:
# (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
# & $env:Temp\GoogleCloudSDKInstaller.exe

# 프로젝트 설정
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Cloud SQL 인스턴스 생성
```bash
# MySQL 8.0 인스턴스 생성
gcloud sql instances create pinto-db \
    --database-version=MYSQL_8_0 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=YOUR_ROOT_PASSWORD

# pinto 데이터베이스 생성
gcloud sql databases create pinto --instance=pinto-db

# 애플리케이션용 사용자 생성
gcloud sql users create pinto-user \
    --instance=pinto-db \
    --password=YOUR_APP_PASSWORD
```

### 3. 환경 변수 설정
`.env.production` 파일의 다음 값들을 실제 정보로 업데이트:

```bash
# 실제 Cloud SQL 연결 정보로 변경
DATABASE_URL="mysql://pinto-user:YOUR_APP_PASSWORD@/pinto?host=/cloudsql/YOUR_PROJECT_ID:us-central1:pinto-db"
NEXTAUTH_URL="https://YOUR_CLOUD_RUN_SERVICE_URL"
NEXTAUTH_SECRET="your-secure-random-string-here"
GOOGLE_CLOUD_PROJECT_ID="YOUR_PROJECT_ID"
```

## 🚀 배포 실행

### 방법 1: GitHub Actions 자동 배포 (권장) ⭐
GitHub에 Push할 때마다 자동으로 Cloud Run에 배포됩니다.

**GitHub Secrets 설정 필요:**
```
GCP_SA_KEY: Google Cloud 서비스 계정 JSON 키
CLOUD_SQL_CONNECTION_NAME: cellular-client-470408-j4:us-west1:pinto-db
DATABASE_URL: mysql://pinto-user:PASSWORD@/pinto?host=/cloudsql/CONNECTION_NAME
NEXTAUTH_SECRET: NextAuth.js 비밀 키
NEXTAUTH_URL: 배포된 앱 URL
```

**서비스 계정 생성:**
```bash
# 서비스 계정 생성
gcloud iam service-accounts create github-actions-sa \
  --description="GitHub Actions service account" \
  --display-name="GitHub Actions SA"

# 필요한 권한 부여
gcloud projects add-iam-policy-binding cellular-client-470408-j4 \
  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding cellular-client-470408-j4 \
  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding cellular-client-470408-j4 \
  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# JSON 키 생성
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com
```

### 방법 2: Cloud Build 수동 배포
```bash
gcloud builds submit --config cloudbuild.yaml .
```

### 방법 3: 수동 Docker 배포
```bash
# Docker 이미지 빌드
docker build -f Dockerfile.production -t gcr.io/YOUR_PROJECT_ID/pinto-app:latest .

# 이미지 푸시
docker push gcr.io/YOUR_PROJECT_ID/pinto-app:latest

# Cloud Run에 배포
gcloud run deploy pinto-app \
    --image gcr.io/YOUR_PROJECT_ID/pinto-app:latest \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production,NEXT_STRICT=false \
    --set-cloudsql-instances YOUR_PROJECT_ID:us-central1:pinto-db
```

## 📊 데이터베이스 초기 설정

배포 후 Cloud SQL에 초기 데이터를 삽입:

```bash
# Cloud SQL Proxy를 통해 연결
./cloud_sql_proxy -instances=YOUR_PROJECT_ID:us-central1:pinto-db=tcp:3306

# 다른 터미널에서:
mysql -h 127.0.0.1 -u root -p

# SQL 스크립트 실행
SOURCE deploy_to_cloud_sql.sql;
SOURCE insert-sample-data.sql;
```

## 🔧 배포 후 확인사항

### 1. 서비스 상태 확인
```bash
# Cloud Run 서비스 상태 확인
gcloud run services list

# 로그 확인
gcloud logs read --service=pinto-app --limit=50
```

### 2. 애플리케이션 테스트
- 메인 페이지 로드 확인
- 관리자 로그인 테스트 (admin/ha1045)
- 주간 랭킹 데이터 표시 확인
- 상품 클릭 및 트래킹 확인

### 3. 데이터베이스 연결 확인
```bash
# Prisma Studio로 확인 (로컬에서)
npx prisma studio --port 5555
```

## ⚡ 성능 최적화

### Cloud CDN 설정 (선택사항)
```bash
# Load Balancer와 CDN 설정으로 전역 성능 향상
gcloud compute backend-services create pinto-backend
gcloud compute url-maps create pinto-map
gcloud compute target-https-proxies create pinto-proxy
```

### Cloud Storage 설정 (이미지 저장용)
```bash
# 이미지 업로드용 스토리지 버킷 생성
gsutil mb gs://YOUR_PROJECT_ID-pinto-images
gsutil cors set cors-config.json gs://YOUR_PROJECT_ID-pinto-images
```

## 🔒 보안 고려사항

1. **Cloud SQL 보안:**
   - Private IP 사용 권장
   - SSL 연결 강제
   - 정기적인 백업 설정

2. **Cloud Run 보안:**
   - IAM 권한 최소화
   - VPC 네트워크 제한
   - 환경 변수로 민감 정보 관리

3. **애플리케이션 보안:**
   - NEXTAUTH_SECRET 강력한 값 설정
   - 정기적인 의존성 업데이트
   - Rate limiting 설정

## 📊 모니터링 설정

```bash
# Cloud Monitoring 대시보드 생성
gcloud monitoring dashboards create --config-from-file=monitoring-dashboard.json
```

## 🚨 문제 해결

### 일반적인 문제들:
1. **데이터베이스 연결 오류:** DATABASE_URL 확인
2. **이미지 로딩 실패:** SVG 이미지 정책 확인 (dangerouslyAllowSVG)
3. **빌드 실패:** Node.js 버전 호환성 확인

### 디버깅 명령어:
```bash
# 상세 로그 보기
gcloud logs read --service=pinto-app --format="table(timestamp, severity, textPayload)" --limit=100

# Cloud SQL 연결 테스트
gcloud sql connect pinto-db --user=root

# Cloud Run 서비스 설정 확인
gcloud run services describe pinto-app --region=us-central1
```

---

**배포 완료 후 서비스 URL을 통해 애플리케이션에 접속하여 모든 기능이 정상 작동하는지 확인하세요!** 🎉