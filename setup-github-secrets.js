#!/usr/bin/env node

/**
 * GitHub Secrets 설정 도우미 스크립트
 * 
 * 사용법:
 * 1. GitHub CLI 설치: npm install -g @github/cli
 * 2. GitHub 로그인: gh auth login
 * 3. 스크립트 실행: node setup-github-secrets.js
 */

const { execSync } = require('child_process');
const fs = require('fs');

const PROJECT_ID = 'cellular-client-470408-j4';
const SQL_REGION = 'us-west1';
const SQL_INSTANCE = 'pinto-db';
const REPO_NAME = 'pinto'; // 실제 리포지토리 이름으로 변경

console.log('🔐 GitHub Secrets 설정 시작...');

try {
  // 1. 서비스 계정 키 파일 읽기
  let gcpServiceAccountKey = '';
  if (fs.existsSync('github-actions-key.json')) {
    gcpServiceAccountKey = fs.readFileSync('github-actions-key.json', 'utf8');
    console.log('✅ 서비스 계정 키 파일을 찾았습니다.');
  } else {
    console.log('❌ github-actions-key.json 파일을 찾을 수 없습니다.');
    console.log('   배포 스크립트를 먼저 실행하세요: ./deploy.sh');
    process.exit(1);
  }

  // 2. GitHub Secrets 설정
  const secrets = {
    'GCP_SA_KEY': gcpServiceAccountKey,
    'CLOUD_SQL_CONNECTION_NAME': `${PROJECT_ID}:${SQL_REGION}:${SQL_INSTANCE}`,
    'DATABASE_URL': `mysql://pinto-user:pinto123!@/pinto?host=/cloudsql/${PROJECT_ID}:${SQL_REGION}:${SQL_INSTANCE}`,
    'NEXTAUTH_SECRET': 'pinto-super-secret-key-2024-production-cellular-client',
    'NEXTAUTH_URL': 'https://pinto-app-123456789-uc.a.run.app' // 배포 후 업데이트 필요
  };

  console.log('📝 GitHub Secrets 설정 중...');
  
  Object.entries(secrets).forEach(([key, value]) => {
    try {
      // GitHub CLI를 사용해서 Secret 설정
      execSync(`echo "${value.replace(/"/g, '\\"')}" | gh secret set ${key}`, { 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      console.log(`✅ ${key} 설정 완료`);
    } catch (error) {
      console.log(`❌ ${key} 설정 실패:`, error.message);
    }
  });

  console.log('');
  console.log('🎉 GitHub Secrets 설정 완료!');
  console.log('');
  console.log('📋 다음 단계:');
  console.log('1. 코드를 main 브랜치에 푸시하면 자동 배포됩니다:');
  console.log('   git add .');
  console.log('   git commit -m "Deploy to Cloud Run"');
  console.log('   git push origin main');
  console.log('');
  console.log('2. 배포 상태는 GitHub Actions 탭에서 확인하세요.');
  console.log('');
  console.log('3. 배포 완료 후 NEXTAUTH_URL을 실제 서비스 URL로 업데이트하세요:');
  console.log('   gh secret set NEXTAUTH_URL --body "https://your-actual-service-url"');

} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  console.log('');
  console.log('💡 문제 해결:');
  console.log('1. GitHub CLI가 설치되어 있는지 확인: gh --version');
  console.log('2. GitHub에 로그인되어 있는지 확인: gh auth status');
  console.log('3. 올바른 리포지토리에서 실행하고 있는지 확인');
}