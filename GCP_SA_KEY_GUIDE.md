# 🔑 GCP_SA_KEY 생성 완벽 가이드

## 🤔 GCP_SA_KEY가 뭔가요?

**GCP_SA_KEY = Google Cloud Platform Service Account Key**
- 쉽게 말해서: **Google Cloud 자동 로그인 열쇠** 🗝️
- 왜 필요한가요: GitHub에서 자동으로 Google Cloud에 앱을 배포하기 위해
- 어떤 모습인가요: JSON 형태의 긴 텍스트 파일

## 📋 만들어야 하는 이유

```
GitHub Actions (자동 배포) 
    ↓
"Google Cloud에 로그인해주세요!"
    ↓  
GCP_SA_KEY 사용해서 자동 로그인 ✅
    ↓
앱 배포 성공! 🎉
```

## 🛠️ 방법 1: Google Cloud Console에서 만들기 (추천)

### Step 1: Google Cloud Console 접속
1. 브라우저에서 https://console.cloud.google.com/ 접속
2. Google 계정으로 로그인
3. 프로젝트 `cellular-client-470408-j4` 선택

### Step 2: IAM & Admin → 서비스 계정으로 이동
1. 왼쪽 메뉴에서 **"IAM & Admin"** 클릭
2. **"서비스 계정"** 클릭

### Step 3: 서비스 계정 만들기
1. **"서비스 계정 만들기"** 버튼 클릭
2. 정보 입력:
   ```
   서비스 계정 이름: github-actions-sa
   서비스 계정 ID: github-actions-sa (자동 생성됨)
   설명: GitHub Actions를 위한 서비스 계정
   ```
3. **"만들고 계속하기"** 클릭

### Step 4: 역할(권한) 부여
다음 역할들을 **하나씩** 추가해주세요:
1. **"역할 선택"** 드롭다운 클릭
2. 검색해서 다음 역할들을 차례대로 추가:
   ```
   - Cloud Run 관리자 (Cloud Run Admin)
   - Storage 관리자 (Storage Admin)  
   - Cloud SQL 클라이언트 (Cloud SQL Client)
   - 서비스 계정 사용자 (Service Account User)
   ```
3. **"계속"** → **"완료"** 클릭

### Step 5: JSON 키 파일 다운로드 ⭐
1. 방금 만든 서비스 계정 클릭
2. **"키"** 탭 클릭
3. **"키 추가"** → **"새 키 만들기"** 클릭
4. **"JSON"** 선택 → **"만들기"** 클릭
5. 파일이 자동으로 다운로드됨! 📥

## 🛠️ 방법 2: 명령어로 만들기 (고급자용)

```bash
# 1. Google Cloud CLI 로그인
gcloud auth login

# 2. 프로젝트 설정
gcloud config set project cellular-client-470408-j4

# 3. 서비스 계정 생성
gcloud iam service-accounts create github-actions-sa \
  --description="GitHub Actions를 위한 서비스 계정" \
  --display-name="GitHub Actions SA"

# 4. 권한 부여 (하나씩 실행)
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

# 5. JSON 키 파일 생성
gcloud iam service-accounts keys create github-key.json \
  --iam-account=github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com

# 6. 파일 내용 확인
cat github-key.json
```

## 📄 JSON 키 파일이 어떻게 생겼나요?

다운로드한 파일을 열어보면 이런 모습입니다:

```json
{
  "type": "service_account",
  "project_id": "cellular-client-470408-j4",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}
```

## 🔐 GitHub Secrets에 어떻게 넣나요?

### Step 1: JSON 파일 내용 복사
1. 다운로드한 JSON 파일을 메모장으로 열기
2. **전체 내용을 복사** (Ctrl+A → Ctrl+C)

### Step 2: GitHub Secrets에 붙여넣기
1. https://github.com/ksh277/pinto-now/settings/secrets/actions 접속
2. **"New repository secret"** 클릭
3. 정보 입력:
   ```
   Name: GCP_SA_KEY
   Secret: (복사한 JSON 내용 전체를 붙여넣기)
   ```
4. **"Add secret"** 클릭

## ⚠️ 중요한 주의사항

### ✅ 해야 할 것:
- JSON 파일 **전체 내용**을 복사해서 붙여넣기
- 파일을 안전한 곳에 보관 (나중에 필요할 수 있음)

### ❌ 하지 말아야 할 것:
- JSON 키를 공개적으로 공유
- 키 파일을 Git에 커밋
- 일부분만 복사해서 붙여넣기

## 🎯 확인 방법

JSON 키가 제대로 설정되었는지 확인:

1. **GitHub Secrets 페이지에서 확인**:
   - `GCP_SA_KEY`가 목록에 나타나야 함
   - 값은 보이지 않음 (보안상)

2. **GitHub Actions 실행해서 테스트**:
   ```bash
   git add .
   git commit -m "Test GCP authentication"
   git push origin main
   ```

3. **Actions 탭에서 로그 확인**:
   - "Authenticate to Google Cloud" 단계가 성공해야 함

## 🚨 문제 해결

### "Authentication failed" 오류가 나면:
1. JSON 키 내용이 완전히 복사되었는지 확인
2. 서비스 계정에 충분한 권한이 있는지 확인
3. 프로젝트 ID가 정확한지 확인

### "Permission denied" 오류가 나면:
1. 서비스 계정에 필요한 모든 역할이 부여되었는지 확인
2. API가 활성화되었는지 확인 (Cloud Run API, Cloud Build API 등)

---

**🎉 성공하면**: GitHub에서 자동으로 Google Cloud에 앱을 배포할 수 있게 됩니다!