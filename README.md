# n8n 웹훅 고정기

로컬 n8n 웹훅을 안정적인 URL로 변환하여 외부 서비스에서 사용할 수 있도록 도와주는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **웹훅 URL 고정**: 로컬 n8n 웹훅을 공개 URL로 변환
- **실시간 프록시**: 모든 요청을 로컬 n8n으로 자동 전달
- **웹훅 관리**: 웹훅 추가, 삭제, 테스트 기능
- **현대적인 UI**: React 기반의 직관적인 사용자 인터페이스
- **Netlify 배포**: 무료 호스팅으로 간편한 배포

## 🛠️ 기술 스택

- **프론트엔드**: React 18, Parcel, Sass
- **백엔드**: Netlify Functions (Node.js)
- **배포**: Netlify
- **스타일링**: SCSS, 반응형 디자인

## 📦 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd n8n-netlify
npm install
```

### 2. 로컬 개발 서버 실행

```bash
npm run dev
```

- 프론트엔드: http://localhost:3000
- API 서버: http://localhost:9000

### 3. 프로덕션 빌드

```bash
npm run build
```

## 🚀 Netlify 배포

### 1. GitHub에 코드 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Netlify에서 사이트 생성

1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" 클릭
3. GitHub 저장소 연결
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### 3. 환경 변수 설정 (선택사항)

Netlify 대시보드에서 Site settings > Environment variables에서 설정:

```
N8N_BASE_URL=http://localhost:5678
```

## 📖 사용법

### 1. 웹훅 추가

1. 웹 애플리케이션에 접속
2. "새 웹훅 추가" 폼에서 정보 입력:
   - **웹훅 이름**: 식별하기 쉬운 이름
   - **로컬 URL**: n8n에서 생성된 웹훅 URL (예: `http://localhost:5678/webhook/abc123`)
   - **설명**: 웹훅의 용도 설명 (선택사항)

### 2. 고정된 URL 사용

웹훅 추가 후 생성되는 고정된 URL을 외부 서비스에서 사용:

```
https://your-site.netlify.app/api/webhook/1
```

### 3. 웹훅 테스트

웹 애플리케이션에서 "테스트" 버튼을 클릭하여 웹훅이 정상 작동하는지 확인할 수 있습니다.

## 🔧 API 엔드포인트

### 웹훅 관리 API

- `GET /api/webhooks` - 모든 웹훅 조회
- `POST /api/webhooks` - 새 웹훅 생성
- `GET /api/webhooks/:id` - 특정 웹훅 조회
- `DELETE /api/webhooks/:id` - 웹훅 삭제
- `POST /api/webhooks/:id/test` - 웹훅 테스트

### 웹훅 프록시 API

- `POST /api/webhook/:id` - 웹훅 요청 프록시
- `GET /api/webhook/:id` - 웹훅 요청 프록시
- `PUT /api/webhook/:id` - 웹훅 요청 프록시
- `DELETE /api/webhook/:id` - 웹훅 요청 프록시

## 🏗️ 프로젝트 구조

```
n8n-netlify/
├── src/                    # React 애플리케이션
│   ├── components/        # React 컴포넌트
│   ├── styles.scss        # 전역 스타일
│   ├── App.jsx           # 메인 앱 컴포넌트
│   └── index.jsx         # 앱 진입점
├── netlify/
│   └── functions/        # Netlify Functions
│       ├── webhooks.js   # 웹훅 관리 API
│       └── webhook.js    # 웹훅 프록시 API
├── netlify.toml          # Netlify 설정
├── package.json          # 프로젝트 설정
└── README.md            # 프로젝트 문서
```

## 🔒 보안 고려사항

- 현재 버전은 메모리 기반 저장소를 사용합니다
- 프로덕션 환경에서는 데이터베이스 사용을 권장합니다
- CORS 설정이 모든 도메인을 허용하므로 필요에 따라 제한하세요
- 민감한 헤더는 자동으로 필터링됩니다

## 🐛 문제 해결

### 로컬 n8n에 연결할 수 없는 경우

1. n8n 서버가 실행 중인지 확인
2. 방화벽 설정 확인
3. 로컬 URL이 올바른지 확인

### Netlify Functions 오류

1. Netlify 대시보드에서 Functions 로그 확인
2. 환경 변수 설정 확인
3. 빌드 로그에서 오류 메시지 확인

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 있거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.
