#!/usr/bin/env node

/**
 * GitHub Secrets 값 확인 도우미
 * 현재 필요한 모든 Secret 값들을 보여줍니다
 */

console.log('🔐 GitHub Secrets 설정 가이드');
console.log('================================\n');

console.log('📋 설정해야 할 5개 Secrets:\n');

console.log('1️⃣  GCP_SA_KEY');
console.log('   설명: Google Cloud 서비스 계정 JSON 키');
console.log('   얻는 방법:');
console.log('   - Google Cloud Console → IAM → 서비스 계정');
console.log('   - 또는 gcloud 명령어 사용 (아래 참조)');
console.log('   형태: {"type": "service_account", "project_id": "cellular-client-470408-j4", ...}');
console.log('');

console.log('2️⃣  CLOUD_SQL_CONNECTION_NAME');
console.log('   값: cellular-client-470408-j4:us-west1:pinto-db');
console.log('   (이 값은 변경 없이 그대로 사용하세요)');
console.log('');

console.log('3️⃣  DATABASE_URL');
console.log('   값: mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/cellular-client-470408-j4:us-west1:pinto-db');
console.log('   (이 값도 변경 없이 그대로 사용하세요)');
console.log('');

console.log('4️⃣  NEXTAUTH_SECRET');
console.log('   값: pinto-super-secret-key-2024-production-cellular-client');
console.log('   (임시 값, 나중에 더 강력한 키로 변경 권장)');
console.log('');

console.log('5️⃣  NEXTAUTH_URL');
console.log('   임시값: https://pinto-app-temp.run.app');
console.log('   ⚠️  첫 배포 완료 후 실제 URL로 업데이트 필요!');
console.log('');

console.log('🛠️  설정 방법:');
console.log('1. 웹 브라우저 사용 (추천):');
console.log('   https://github.com/ksh277/pinto-now/settings/secrets/actions');
console.log('');
console.log('2. GitHub CLI 사용:');
console.log('   gh secret set SECRET_NAME --body "값"');
console.log('');

console.log('🔑 GCP_SA_KEY 생성 명령어:');
console.log('gcloud iam service-accounts create github-actions-sa \\');
console.log('  --description="GitHub Actions" --display-name="GitHub Actions SA"');
console.log('');
console.log('gcloud projects add-iam-policy-binding cellular-client-470408-j4 \\');
console.log('  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \\');
console.log('  --role="roles/run.admin"');
console.log('');
console.log('gcloud projects add-iam-policy-binding cellular-client-470408-j4 \\');
console.log('  --member="serviceAccount:github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com" \\');
console.log('  --role="roles/storage.admin"');
console.log('');
console.log('gcloud iam service-accounts keys create github-key.json \\');
console.log('  --iam-account=github-actions-sa@cellular-client-470408-j4.iam.gserviceaccount.com');
console.log('');
console.log('그 다음 github-key.json 파일 내용을 복사해서 GCP_SA_KEY에 붙여넣으세요!');
console.log('');

console.log('✅ 모든 설정이 완료되면:');
console.log('git push origin main  # 자동 배포 시작!');
console.log('');

// GitHub CLI가 설치되어 있는지 확인
const { execSync } = require('child_process');

try {
  execSync('gh --version', { stdio: 'pipe' });
  console.log('💡 GitHub CLI가 설치되어 있습니다. 빠른 설정을 원하시면:');
  console.log('   node setup-github-secrets.js');
} catch (error) {
  console.log('💡 GitHub CLI 설치하면 더 쉽게 설정 가능:');
  console.log('   winget install GitHub.cli');
}

console.log('\n🎯 질문이나 도움이 필요하면 언제든 물어보세요!');