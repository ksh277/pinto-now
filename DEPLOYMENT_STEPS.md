# 🚀 Pinto 애플리케이션 배포 단계별 가이드

## 1단계: Google Cloud 로그인 및 서비스 계정 생성

먼저 Google Cloud Console에서 다음 작업을 수행하세요:

### 1.1 Google Cloud CLI 로그인
```bash
# Google Cloud CLI 로그인
gcloud auth login

# 프로젝트 설정
gcloud config set project cellular-client-470408-j4
```

### 1.2 서비스 계정 생성
```bash
# GitHub Actions용 서비스 계정 생성
gcloud iam service-accounts create github-actions-sa \
  --description="GitHub Actions service account for Pinto deployment" \
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

gcloud projects add-iam-policy-binding cellular-client-470408-j4 \
  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# 서비스 계정 키 생성
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com
```

## 2단계: Cloud SQL 데이터베이스 설정

### 2.1 Cloud SQL 인스턴스 확인/생성
```bash
# 기존 인스턴스 확인
gcloud sql instances list

# 인스턴스가 없다면 생성
gcloud sql instances create pinto-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-west1 \
  --root-password=YOUR_SECURE_ROOT_PASSWORD \
  --storage-auto-increase \
  --backup \
  --enable-bin-log
```

### 2.2 데이터베이스 및 사용자 생성
```bash
# pinto 데이터베이스 생성
gcloud sql databases create pinto --instance=pinto-db

# 애플리케이션용 사용자 생성
gcloud sql users create pinto-user \
  --instance=pinto-db \
  --password=pinto123!
```

### 2.3 데이터베이스 스키마 배포
```bash
# Cloud SQL Proxy 다운로드 (이미 있음)
chmod +x cloud_sql_proxy

# Cloud SQL에 연결
./cloud_sql_proxy -instances=cellular-client-470408-j4:us-west1:pinto-db=tcp:3306 &

# 새 터미널에서 데이터베이스 스키마 적용
mysql -h 127.0.0.1 -u root -p

# MySQL에서 다음 실행:
SOURCE deploy_to_cloud_sql.sql;
SOURCE insert-sample-data.sql;
exit
```

## 3단계: GitHub Secrets 설정

GitHub 리포지토리 → Settings → Secrets and variables → Actions에서 다음 시크릿을 추가:

### 필수 시크릿 목록:

1. **GCP_SA_KEY**
   ```
   github-actions-key.json 파일의 전체 내용을 복사해서 붙여넣기
   ```

2. **CLOUD_SQL_CONNECTION_NAME**
   ```
   cellular-client-470408-j4:us-west1:pinto-db
   ```

3. **DATABASE_URL**
   ```
   mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/cellular-client-470408-j4:us-west1:pinto-db
   ```

4. **NEXTAUTH_SECRET**
   ```
   pinto-super-secret-key-2024-production-cellular-client
   ```

5. **NEXTAUTH_URL**
   ```
   https://pinto-app-123456789-uc.a.run.app
   (실제 배포 후 URL로 업데이트 필요)
   ```

## 4단계: 배포 실행

### 4.1 코드 푸시로 자동 배포
```bash
# 변경사항 커밋 및 푸시
git add .
git commit -m "Setup deployment configuration"
git push origin main
```

### 4.2 배포 상태 확인
- GitHub Actions 탭에서 워크플로우 실행 상태 확인
- 배포 완료 후 서비스 URL 확인

### 4.3 수동 배포 (필요시)
```bash
# 워크플로우 수동 실행
gh workflow run deploy.yml
```

## 5단계: 배포 후 확인

### 5.1 서비스 상태 확인
```bash
# Cloud Run 서비스 목록 확인
gcloud run services list --region=us-central1

# 서비스 상세 정보 확인
gcloud run services describe pinto-app --region=us-central1
```

### 5.2 로그 확인
```bash
# 애플리케이션 로그 확인
gcloud logs read --service=pinto-app --limit=50
```

### 5.3 애플리케이션 테스트
1. 배포된 URL로 접속
2. 메인 페이지 로딩 확인
3. 관리자 로그인 테스트 (admin/ha1045)
4. 데이터베이스 연결 확인

## 6단계: 도메인 설정 (선택사항)

### 6.1 커스텀 도메인 매핑
```bash
# 도메인 매핑 생성
gcloud run domain-mappings create \
  --service pinto-app \
  --domain your-domain.com \
  --region us-central1
```

## 7단계: 모니터링 및 알림 설정

### 7.1 Cloud Monitoring 설정
```bash
# 알림 정책 생성 (선택사항)
gcloud alpha monitoring policies create --policy-from-file=monitoring-policy.yaml
```

## 🔧 문제 해결

### 일반적인 오류들:

1. **인증 오류**: 서비스 계정 키 확인
2. **데이터베이스 연결 오류**: DATABASE_URL 확인
3. **빌드 실패**: package.json 의존성 확인
4. **메모리 부족**: Cloud Run 메모리 제한 증가

### 디버깅 명령어:
```bash
# 상세 로그 확인
gcloud logs read --service=pinto-app \
  --format="table(timestamp, severity, textPayload)" \
  --limit=100

# 환경 변수 확인
gcloud run services describe pinto-app \
  --region=us-central1 \
  --format="export"
```

---

**배포 완료 후 실제 서비스 URL로 NEXTAUTH_URL을 업데이트하는 것을 잊지 마세요!** 🎉