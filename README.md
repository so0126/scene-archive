## 1. 서비스 소개
# 🎞️ Scene Archive

**AI로 되살리는 인생 명장면, 프리미엄 포토에세이 제작 서비스**

Scene Archive는 좋아하는 드라마, 영화, 아이돌의 장면을 포토북으로 제작하는 웹 서비스입니다.  
사용자는 이미지를 업로드하고, 장면에 대한 키워드와 정보를 입력한 뒤, 포토북 생성 및 주문까지 한 번에 진행할 수 있습니다.

현재 프로젝트는 **Sweetbook API 연동을 통한 기본적인 책 생성 및 주문 생성 기능 구현**에 중점을 두고 있으며,  
기획 단계에서 포함했던 일부 AI 기능은 아직 완성되지 않은 상태입니다.

---

## ✅ 현재 구현된 기능

### 1. 포토북 생성 API 연동
- Sweetbook SDK/API를 이용해 책 생성 흐름을 연결했습니다.
- 표지 및 내지 구성에 필요한 데이터를 조합하여 실제 포토북 생성 요청이 가능하도록 구현했습니다.

### 2. 주문 생성 API 연동
- 생성된 책 정보를 바탕으로 주문 생성 API까지 연결했습니다.
- 배송 정보 입력 후 주문 요청이 가능한 기본 흐름을 구성했습니다.

### 3. 주문 조회 API 연동
- 주문번호와 연락처를 기준으로 주문 정보를 조회할 수 있도록 API를 연결했습니다.
- 생성된 주문 내역과 장면 정보를 다시 확인할 수 있는 흐름을 구성했습니다.

### 4. 데모 시연용 기본 서비스 구조
- 프론트엔드에서 사용자 흐름에 맞춰 페이지를 구성했습니다.
- 업로드 → 검토 → 주문 → 주문조회 흐름까지 구현했습니다.

---

## ⚠️ 현재 미완성 기능

### 1. AI 이미지 업스케일링 / 복원
- 원래 목표는 저해상도 캡처 이미지를 고해상도로 보정하는 기능이었으나,
- 현재 버전에서는 해당 AI 업스케일링 로직까지 완성하지 못했습니다.

### 2. 키워드 기반 장면 내용 추출 / 감성 에세이 생성
- 사용자가 입력한 키워드를 바탕으로 장면의 맥락을 해석하고 문장을 생성하는 기능을 기획했으나,
- 현재는 해당 기능이 구현되지 않았습니다.

즉, 이 프로젝트는 **AI 기능을 완성한 서비스라기보다, 포토북 제작/주문 API 연동을 중심으로 구현한 프로토타입**에 가깝습니다.

---

## 🛠 기술 스택

### Frontend
- React 19 (Vite)
- TypeScript
- Zustand
- Tailwind CSS
- Lucide React
- React Router

### Backend
- Python
- FastAPI
- SQLite

### External Integration
- Sweetbook API SDK

---

## 🚀 2. 실행 방법

### Backend

```bash
cd backend
pip install -r requirements.txt
# .env 파일에 SWEETBOOK_API_KEY 설정 필요
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 폴더 구조

```plaintext
scene-archive/
├── backend/                # FastAPI 서버
│   ├── database.py         # SQLite 및 데이터 처리
│   ├── main.py             # API 엔드포인트 및 Sweetbook 연동
│   └── static/samples/     # 샘플 이미지
└── frontend/               # React 클라이언트
    ├── src/app/hooks/      # 커스텀 훅
    ├── src/app/store/      # Zustand 상태 관리
    └── src/app/pages/      # 주요 페이지
```


---

## 3. 사용한 API 목록

본 프로젝트에서는 Sweetbook SDK / API를 활용해 **책 생성**과 **주문 생성**을 연결했고, 주문 조회는 별도 백엔드 API로 구현했습니다.

### Sweetbook SDK / External API

| API | 용도 |
|---|---|
| POST /books | 새 포토북 생성 |
| POST /covers | 포토북 표지 생성 |
| POST /contents | 포토북 내지 생성 |
| POST /photos | 포토북에 사진 업로드 |
| POST /orders | 생성된 포토북 주문 생성 |
| GET /orders/{orderUid} | 주문 상세 조회 |

### Internal Backend API

| API | 용도 |
|---|---|
| POST /api/order/lookup | 주문번호와 연락처 기준 주문 조회 |

※ 현재 `POST /api/order/lookup`는 Sweetbook SDK 조회 API를 직접 호출하는 구조가 아니라, 서버에 저장한 주문 정보와 연락처를 기준으로 조회하는 내부 API입니다.  
※ 초기 기획에 포함되었던 이미지 업스케일링, 키워드 기반 내용 추출 관련 API는 현재 구현되지 않았습니다.

---

## 4. AI 도구 사용 내역

개발 과정에서 사용한 AI 도구와 활용 내용은 다음과 같습니다.

| AI 도구 | 활용 내용 |
|---|---|
| ChatGPT | 서비스 아이디어 정리, README 문서 작성 보조, 기능 설명 문장 다듬기 |
| Google Gemini | React 코드 리팩토링, FastAPI를 이용한 기능 개발 |
| Codex | GitHub Actions 배포 워크플로 구성, 프론트엔드 빌드 설정 보완, README 및 배포 문서 정리 |
| Figma make | 화면 UI/UX 생성 및 코드 작성 |

※ AI를 활용해 문서화와 구조 정리를 보조받았지만, 실제 프로젝트 구현 범위는 포토북 생성 및 주문 생성 API 연동까지로 제한됩니다.

---

## 5. 설계 의도

이 서비스를 선택한 이유는 단순 CRUD를 넘어서, **실제 외부 제작 API를 웹 서비스 흐름에 연결하는 경험**을 해보고 싶었기 때문입니다.

사용자가 입력한 데이터를 바탕으로 결과물을 만들고, 그 결과가 실제 주문 단계까지 이어지는 구조를 구현하면서 프론트엔드와 백엔드 간의 역할 분리, 외부 API 연동, 사용자 흐름 설계 경험을 쌓는 데 집중했습니다.

또한 좋아하는 장면을 기록하고 소장하고 싶어 하는 사용자 니즈를 서비스 형태로 풀어보는 과정에서, 단순 기능 구현이 아니라 **주제와 사용자 경험이 연결된 프로젝트**를 만들고자 했습니다.

비록 초기 기획에 포함했던 AI 이미지 복원이나 에세이 생성 기능까지는 완성하지 못했지만, 현재 버전에서는 **포토북 생성과 주문 생성이라는 핵심 흐름을 실제로 동작하게 만드는 것**을 우선 목표로 두고 구현했습니다.
---

## 6. GitHub Pages 배포

GitHub Actions 기준 배포 구성을 추가했습니다.

## 배포 방식

- 프론트엔드: `.github/workflows/frontend-pages.yml` 로 `main` 브랜치 푸시 시 GitHub Pages 자동 배포
- 백엔드: `.github/workflows/backend-ghcr.yml` 로 Docker 이미지를 GHCR에 자동 푸시

## GitHub 설정

1. 저장소 `Settings > Pages`에서 `Build and deployment` 소스를 `GitHub Actions`로 설정합니다.
2. 저장소 `Settings > Secrets and variables > Actions > Variables`에 `VITE_API_BASE_URL`을 추가합니다.
3. 백엔드 실행 환경에는 `BOOKPRINT_API_KEY`, `BOOKPRINT_BASE_URL`, `FRONTEND_ORIGINS`, `SCENE_ARCHIVE_DB_PATH` 를 설정합니다.
4. `FRONTEND_ORIGINS` 에 실제 Pages 주소를 포함합니다.

예시:

```txt
VITE_API_BASE_URL=https://your-backend.example.com
FRONTEND_ORIGINS=http://localhost:5173,https://<github-username>.github.io
SCENE_ARCHIVE_DB_PATH=scene_archive.db
```

---

## 7. EC2 백엔드 배포

빠르게 배포하려면 EC2에서 Docker Compose로 백엔드를 실행하는 구성이 가장 단순합니다.

### 배포 파일

- `deploy/ec2/docker-compose.yml`: GHCR에 올라간 백엔드 이미지를 실행하는 Compose 파일
- `deploy/ec2/.env.example`: EC2에서 사용할 환경변수 예시
- `deploy/ec2/deploy.sh`: GHCR 로그인부터 배포까지 한 번에 실행하는 스크립트
- `deploy/ec2/install-docker-ubuntu.sh`: Ubuntu EC2용 Docker 설치 스크립트

### 사전 준비

1. EC2에 Docker와 Docker Compose를 설치합니다.
2. 보안 그룹에서 `8000` 포트를 열거나, 이후 Nginx를 붙일 경우 `80`/`443`만 엽니다.
3. GitHub Actions로 GHCR 이미지가 한 번 이상 푸시되어 있어야 합니다.

Ubuntu EC2라면 아래 스크립트로 설치할 수 있습니다.

```bash
cd deploy/ec2
chmod +x install-docker-ubuntu.sh
./install-docker-ubuntu.sh
```

### EC2 실행 절차

```bash
mkdir -p ~/scene-archive/deploy/ec2
cd ~/scene-archive
```

저장소를 클론하거나 배포 파일만 서버로 옮긴 뒤:

```bash
cd deploy/ec2
cp .env.example .env
mkdir -p data
```

`.env` 값을 실제 환경에 맞게 수정합니다.

```txt
GHCR_OWNER=<github-username>
GHCR_USERNAME=<github-username>
GHCR_TOKEN=<github-personal-access-token>
APP_PORT=8000
BOOKPRINT_API_KEY=<your-api-key>
BOOKPRINT_BASE_URL=https://api-sandbox.sweetbook.com/v1
FRONTEND_ORIGINS=https://<github-username>.github.io
SCENE_ARCHIVE_DB_PATH=/data/scene_archive.db
```

배포 스크립트를 실행합니다.

```bash
chmod +x deploy.sh
./deploy.sh
```

### 확인 방법

```bash
docker compose ps
docker compose logs -f backend
curl http://127.0.0.1:8000/
```

### 운영 시 주의사항

- SQLite 파일은 `deploy/ec2/data/scene_archive.db`에 저장됩니다.
- 컨테이너를 다시 띄워도 `data` 디렉터리를 유지하면 주문 데이터가 보존됩니다.
- 퍼블릭 오픈 전에는 Nginx와 HTTPS를 붙이는 편이 안전합니다.
- 운영 중 업데이트할 때는 `cd deploy/ec2 && ./deploy.sh` 만 다시 실행하면 됩니다.

---

## 8. 커밋 메시지 규칙

커밋 메시지는 아래 형식을 따릅니다.

```txt
<scope>/<type>: <한국어 커밋 메시지>
```

### scope

- `front`: 프론트엔드 관련 변경
- `back`: 백엔드 관련 변경
- `common`: 공통 설정, 문서, 프로젝트 전반 변경

### type

| type | 의미 |
|---|---|
| feat | 기능 개발 |
| fix | 버그 수정 |
| design | UI/UX 변경 (frontend 전용) |
| refactor | 코드 구조 개선 |
| docs | 문서 |
| test | 테스트 코드 |
| build | 빌드 파일 수정 |
| ci | CI 설정 파일 수정 |
| chore | 자잘한 수정이나 빌드 업데이트 |
| rename | 파일 혹은 폴더명 수정 |
| remove | 파일 삭제 |
| perf | 성능 개선 |

### 예시

- `front/feat: 주문 조회 페이지 추가`
- `back/fix: 주문 생성 응답 예외 처리 수정`
- `common/docs: 배포 가이드 문서화`
