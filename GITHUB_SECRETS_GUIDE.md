# 🔐 GitHub Secrets 완벽 가이드

## 1. GitHub Secrets란?

GitHub Secrets는 **민감한 정보를 안전하게 저장**하는 GitHub의 기능입니다.

### 🤔 왜 필요한가요?
```bash
# ❌ 이렇게 하면 안 됩니다 (코드에 노출)
DATABASE_URL="mysql://user:password123@database.com/mydb"

# ✅ 이렇게 해야 합니다 (Secret 사용)
DATABASE_URL="${{ secrets.DATABASE_URL }}"
```

### 📊 우리 프로젝트 현황
- **목표**: Pinto 앱을 Google Cloud Run에 자동 배포
- **필요한 것**: Google Cloud 인증 정보, 데이터베이스 연결 정보 등
- **문제**: 이런 정보들을 코드에 직접 쓸 수 없음 (보안상 위험)
- **해결**: GitHub Secrets에 저장해서 안전하게 사용

## 2. 📝 우리가 설정해야 할 5개 Secrets

### 🔑 1. GCP_SA_KEY (Google Cloud 인증 키)
```
설명: Google Cloud에 접근하기 위한 서비스 계정 JSON 키
형태: JSON 파일 전체 내용
예시: {"type": "service_account", "project_id": "...", ...}
```

### 🔗 2. CLOUD_SQL_CONNECTION_NAME (데이터베이스 연결 이름)
```
설명: Cloud SQL 인스턴스 연결 이름
값: cellular-client-470408-j4:us-west1:pinto-db
```

### 🗄️ 3. DATABASE_URL (데이터베이스 연결 문자열)
```
설명: MySQL 데이터베이스에 연결하기 위한 URL
형태: mysql://사용자:비밀번호@호스트/데이터베이스명
예시: mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/...
```

### 🔐 4. NEXTAUTH_SECRET (NextAuth 암호화 키)
```
설명: 사용자 인증을 위한 암호화 키
형태: 긴 랜덤 문자열
예시: pinto-super-secret-key-2024-production-cellular-client
```

### 🌐 5. NEXTAUTH_URL (배포된 앱 URL)
```
설명: 배포 완료 후 실제 앱이 실행되는 URL
형태: https://서비스이름-해시.a.run.app
예시: https://pinto-app-123456789-uc.a.run.app
```

## 3. 🛠️ GitHub Secrets 설정 방법

### 방법 1: 웹 브라우저 사용 (가장 쉬움) ⭐

#### Step 1: GitHub 리포지토리로 이동
1. 브라우저에서 `https://github.com/ksh277/pinto-now` 접속
2. 로그인 확인

#### Step 2: Settings 메뉴로 이동
1. 리포지토리 상단 탭에서 **Settings** 클릭
2. 왼쪽 사이드바에서 **Secrets and variables** 클릭
3. **Actions** 클릭

#### Step 3: Secrets 추가
1. **New repository secret** 버튼 클릭
2. **Name** 필드에 Secret 이름 입력 (예: `GCP_SA_KEY`)
3. **Secret** 필드에 실제 값 입력
4. **Add secret** 버튼 클릭
5. 5개 모든 Secret에 대해 반복

### 방법 2: GitHub CLI 사용

```bash
# GitHub CLI 설치 (Windows)
winget install GitHub.cli

# 로그인
gh auth login

# Secrets 설정
gh secret set GCP_SA_KEY --body "JSON키내용"
gh secret set CLOUD_SQL_CONNECTION_NAME --body "cellular-client-470408-j4:us-west1:pinto-db"
gh secret set DATABASE_URL --body "mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/..."
gh secret set NEXTAUTH_SECRET --body "pinto-super-secret-key-2024-production"
gh secret set NEXTAUTH_URL --body "https://your-app-url.run.app"
```

## 4. 📋 각 Secret의 정확한 값

### 🔑 GCP_SA_KEY 값 얻는 방법

```bash
# 1. Google Cloud에 로그인
gcloud auth login

# 2. 서비스 계정 생성
gcloud iam service-accounts create github-actions-sa \
  --description="GitHub Actions deployment" \
  --display-name="GitHub Actions SA"

# 3. 권한 부여
gcloud projects add-iam-policy-binding cellular-client-470408-j4 \
  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding cellular-client-470408-j4 \
  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding cellular-client-470408-j4 \
  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# 4. JSON 키 생성
gcloud iam service-accounts keys create github-key.json \
  --iam-account=github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com

# 5. 파일 내용을 복사해서 GCP_SA_KEY에 붙여넣기
cat github-key.json
```

### 🗄️ DATABASE_URL 값
```
mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/cellular-client-470408-j4:us-west1:pinto-db
```

### 🔐 NEXTAUTH_SECRET 값 (임시)
```
pinto-super-secret-key-2024-production-cellular-client
```

### 🌐 NEXTAUTH_URL 값
```
# 첫 배포 시 임시 값
https://pinto-app-temp-url.run.app

# 배포 완료 후 실제 URL로 업데이트 필요
```

## 5. ✅ 설정 확인 방법

### Secrets이 제대로 설정되었는지 확인:
1. GitHub 리포지토리 → Settings → Secrets and variables → Actions
2. 다음 5개가 모두 보여야 함:
   - ✅ GCP_SA_KEY
   - ✅ CLOUD_SQL_CONNECTION_NAME  
   - ✅ DATABASE_URL
   - ✅ NEXTAUTH_SECRET
   - ✅ NEXTAUTH_URL

### GitHub Actions 실행 테스트:
```bash
# 코드 변경 후 푸시하면 자동 배포
git add .
git commit -m "Test deployment"
git push origin main

# 또는 수동 실행
gh workflow run deploy.yml
```

## 6. 🚨 주의사항

### ❌ 하지 말아야 할 것들:
- Secret 값을 코드에 직접 쓰기
- Secret을 공개 채널에 공유
- 실제 비밀번호를 간단하게 설정

### ✅ 해야 할 것들:
- 강력한 비밀번호 사용
- 주기적으로 키 교체
- 배포 완료 후 NEXTAUTH_URL 업데이트

## 7. 🔄 자동 배포 흐름

```mermaid
graph LR
    A[코드 수정] --> B[Git Push]
    B --> C[GitHub Actions 실행]
    C --> D[Secrets 사용해서 인증]
    D --> E[앱 빌드]
    E --> F[Cloud Run 배포]
    F --> G[배포 완료!]
```

## 8. 📞 도움이 필요하면

1. **GitHub Actions 로그 확인**: 리포지토리 → Actions → 최신 실행
2. **에러 메시지 분석**: 빌드 실패 시 로그에서 원인 파악
3. **Secret 재설정**: 값이 틀렸다면 새로 설정

---

**🎯 목표**: 이 가이드를 따라하면 GitHub에서 Google Cloud Run으로 완전 자동 배포가 가능합니다!