# Netlify 배포 가이드

이 문서는 n8n 웹훅 고정기를 Netlify에 배포하는 방법을 설명합니다.

## 🚀 빠른 배포 (권장)

### 1. GitHub에 코드 푸시

```bash
# Git 저장소 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit: n8n webhook fixer"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/yourusername/n8n-webhook-fixer.git
git branch -M main
git push -u origin main
```

### 2. Netlify에서 사이트 생성

1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" 클릭
3. GitHub 선택
4. 저장소 선택: `n8n-webhook-fixer`
5. 빌드 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### 3. 환경 변수 설정 (선택사항)

Netlify 대시보드에서:
1. Site settings > Environment variables
2. 다음 변수들 추가:

```
N8N_BASE_URL=http://localhost:5678
LOG_LEVEL=info
WEBHOOK_TIMEOUT=30000
```

### 4. 배포 확인

- 사이트 URL: `https://your-site-name.netlify.app`
- Functions URL: `https://your-site-name.netlify.app/.netlify/functions/`

## 🔧 수동 배포

### 1. 로컬 빌드

```bash
npm install
npm run build
```

### 2. Netlify CLI 사용

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod --dir=dist
```

## 📋 배포 체크리스트

- [ ] GitHub 저장소에 코드 푸시 완료
- [ ] Netlify에서 사이트 생성 완료
- [ ] 빌드 설정 확인 (Build command, Publish directory, Functions directory)
- [ ] 환경 변수 설정 (필요시)
- [ ] 배포 성공 확인
- [ ] 웹훅 API 테스트
- [ ] 프론트엔드 접속 확인

## 🐛 배포 문제 해결

### 빌드 실패

1. **Node.js 버전 확인**
   ```bash
   node --version  # 18.x 권장
   ```

2. **의존성 설치 확인**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **빌드 로그 확인**
   - Netlify 대시보드 > Deploys > Build log

### Functions 오류

1. **Functions 로그 확인**
   - Netlify 대시보드 > Functions > Logs

2. **CORS 오류 해결**
   - `netlify/functions/_headers` 파일 확인
   - CORS 헤더 설정 확인

3. **타임아웃 오류**
   - 환경 변수 `WEBHOOK_TIMEOUT` 증가
   - 로컬 n8n 서버 응답 시간 확인

### 프론트엔드 오류

1. **라우팅 문제**
   - `netlify/functions/_redirects` 파일 확인
   - SPA 라우팅 설정 확인

2. **API 연결 문제**
   - 브라우저 개발자 도구 > Network 탭 확인
   - API 엔드포인트 URL 확인

## 🔄 업데이트 배포

코드 변경 후:

```bash
git add .
git commit -m "Update: 설명"
git push origin main
```

Netlify가 자동으로 재배포합니다.

## 📊 모니터링

### Netlify 대시보드에서 확인 가능한 정보:

- **Analytics**: 사이트 방문 통계
- **Functions**: Functions 실행 통계
- **Deploys**: 배포 히스토리
- **Logs**: 실시간 로그

### 중요한 메트릭:

- Functions 실행 시간
- 오류율
- 응답 시간
- 트래픽

## 🔒 보안 설정

### 1. 환경 변수 보안

- 민감한 정보는 환경 변수로 설정
- `.env` 파일을 Git에 커밋하지 않음

### 2. CORS 설정

현재 설정: 모든 도메인 허용
```javascript
'Access-Control-Allow-Origin': '*'
```

제한이 필요한 경우:
```javascript
'Access-Control-Allow-Origin': 'https://yourdomain.com'
```

### 3. Functions 보안

- 입력 데이터 검증
- 타임아웃 설정
- 오류 메시지 필터링

## 📞 지원

배포 관련 문제가 있으시면:

1. Netlify 문서: https://docs.netlify.com/
2. GitHub Issues: 프로젝트 저장소의 Issues 탭
3. Netlify 커뮤니티: https://community.netlify.com/
