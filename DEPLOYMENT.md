# Scene Archive Deployment Guide

Scene Archive의 배포 및 운영 관련 문서는 이 파일에서 관리합니다.

## 1. 배포 구조

- 프론트엔드: `.github/workflows/frontend-pages.yml`로 `main` 브랜치 푸시 시 GitHub Pages 자동 배포
- 백엔드: `.github/workflows/backend-ghcr.yml`로 Docker 이미지를 GHCR에 자동 푸시
- 서비스 도메인: `https://scene-archive.com`
- API 도메인: `https://api.scene-archive.com`

---

## 2. GitHub Pages 설정

1. 저장소 `Settings > Pages`에서 `Build and deployment` 소스를 `GitHub Actions`로 설정합니다.
2. 저장소 `Settings > Pages`에서 `Custom domain`을 `scene-archive.com`으로 설정합니다.
3. 저장소 `Settings > Secrets and variables > Actions > Variables`에 `VITE_API_BASE_URL`을 추가합니다.
4. `VITE_API_BASE_URL` 값은 `https://api.scene-archive.com`처럼 실제 백엔드 배포 주소로 설정합니다.
5. 백엔드 실행 환경에는 `BOOKPRINT_API_KEY`, `BOOKPRINT_BASE_URL`, `FRONTEND_ORIGINS`, `SCENE_ARCHIVE_DB_PATH`를 설정합니다.
6. `FRONTEND_ORIGINS`에 실제 Pages 주소와 커스텀 도메인을 포함합니다.

예시:

```txt
VITE_API_BASE_URL=https://api.scene-archive.com
FRONTEND_ORIGINS=http://localhost:5173,https://so0126.github.io,https://scene-archive.com,https://www.scene-archive.com
SCENE_ARCHIVE_DB_PATH=scene_archive.db
```

---

## 3. EC2 백엔드 배포

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
- 운영 중 업데이트할 때는 `cd deploy/ec2 && ./deploy.sh`만 다시 실행하면 됩니다.

---

## 4. Cloudflare 및 HTTPS 연결

현재 도메인은 `scene-archive.com`, 백엔드 도메인은 `api.scene-archive.com` 기준으로 설정합니다.

### Cloudflare DNS

Cloudflare `DNS > Records`에서 아래 레코드를 추가합니다.

```txt
Type: A
Name: api
Content: 15.165.15.78
TTL: Auto
Proxy status: DNS only
```

```txt
Type: CNAME
Name: @
Content: so0126.github.io
TTL: Auto
Proxy status: DNS only
```

```txt
Type: CNAME
Name: www
Content: scene-archive.com
TTL: Auto
Proxy status: DNS only
```

### GitHub Pages

- `Settings > Pages > Custom domain`에 `scene-archive.com`을 입력합니다.
- `Enforce HTTPS`가 활성화되면 체크합니다.
- 프론트 빌드 결과에 `CNAME` 파일이 포함되도록 `frontend/public/CNAME`을 추가했습니다.

### EC2 Nginx 설정

```bash
sudo apt update
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/scene-archive
```

```nginx
server {
    listen 80;
    server_name api.scene-archive.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/scene-archive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### HTTPS 인증서 발급

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.scene-archive.com
```

### EC2 백엔드 환경변수

`deploy/ec2/.env`의 `FRONTEND_ORIGINS`는 아래처럼 설정합니다.

```txt
FRONTEND_ORIGINS=https://scene-archive.com,https://www.scene-archive.com,https://so0126.github.io
```
