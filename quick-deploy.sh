#!/bin/bash

# 빠른 테스트 배포 스크립트
echo "🚀 빠른 테스트 배포 시작..."

# GitHub Secrets가 설정되어 있다면 GitHub Actions 사용
if gh secret list > /dev/null 2>&1; then
    echo "📋 GitHub Secrets가 설정되어 있습니다."
    echo "🔄 GitHub Actions 워크플로우를 수동으로 실행합니다..."
    gh workflow run deploy.yml
    echo "✅ GitHub Actions에서 배포를 시작했습니다."
    echo "🔗 진행 상황: https://github.com/ksh277/pinto-now/actions"
else
    echo "❌ GitHub Secrets가 설정되지 않았습니다."
    echo "📝 다음 Secrets을 GitHub 리포지토리에 추가하세요:"
    echo ""
    echo "1. GCP_SA_KEY - Google Cloud 서비스 계정 JSON 키"
    echo "2. CLOUD_SQL_CONNECTION_NAME - cellular-client-470408-j4:us-west1:pinto-db" 
    echo "3. DATABASE_URL - MySQL 연결 문자열"
    echo "4. NEXTAUTH_SECRET - NextAuth 비밀 키"
    echo "5. NEXTAUTH_URL - 배포된 앱 URL"
    echo ""
    echo "설정 방법:"
    echo "1. https://github.com/ksh277/pinto-now/settings/secrets/actions"
    echo "2. 또는 GitHub CLI 사용: gh secret set SECRET_NAME"
fi