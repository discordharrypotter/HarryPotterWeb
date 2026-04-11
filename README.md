# 디스코드 해리포터 봇 웹사이트

디스코드 해리포터 봇의 공식 웹사이트입니다. 봇 소개, 가이드, 커뮤니티 소식 등을 제공합니다.

## 기능

- **가이드** - 마법, 전투, 퀘스트 등 봇 사용법을 마크다운 기반으로 제공
- **소식** - 네이버 카페 공지사항 및 패치노트를 자동으로 불러와 표시
- **이용약관 / 개인정보 처리 방침 / 제재 규정** - 서비스 정책 안내
- **문의하기** - 디스코드 서포트 서버 연결

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | [SvelteKit](https://svelte.dev/) (Svelte 5) |
| 호스팅 | [Cloudflare Pages](https://pages.cloudflare.com/) |
| 패키지 매니저 | Yarn |
| 포맷터 | Prettier |
| CI | GitHub Actions |

## 시작하기

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 타입 체크
yarn check

# 포맷 검사
yarn format:check

# 프로덕션 빌드
yarn build
```

> Node.js 22 이상이 필요합니다.

## 프로젝트 구조

```
src/
├── lib/
│   ├── components/   # 공통 컴포넌트
│   ├── data/         # 사이트 데이터 및 가이드 로더
│   ├── server/       # 서버 전용 코드 (API 등)
│   └── types/        # TypeScript 타입 정의
├── routes/
│   ├── api/news/     # 네이버 카페 소식 API
│   ├── guide/        # 가이드 페이지
│   ├── contact/      # 문의하기
│   ├── privacy/      # 개인정보 처리 방침
│   ├── punishment/   # 제재 규정
│   └── terms/        # 이용약관
content/
└── guide/            # 가이드 마크다운 파일
static/
├── icons/            # 인라인 아이콘 이미지
└── images/           # 일반 이미지
```

## 기여하기

기여를 환영합니다! 자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고해 주세요.

## 링크

- [디스코드 서포트 서버](https://discord.gg/UzB7Kn58ZA)
- [네이버 카페](https://cafe.naver.com/discordharrypotter)
- [GitHub](https://github.com/discordharrypotter)

## 라이선스

이 프로젝트는 [Apache License 2.0](LICENSE) 하에 배포됩니다.
