# Task Manager

Simple full-stack CRUD application:

- Next.js frontend
- Spring Boot REST API
- MySQL database

## Backend

1. Create MySQL database credentials or use an existing local MySQL server.
2. Start the API:

```powershell
cd backend
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
& "<path-to-maven>\bin\mvn.cmd" spring-boot:run
```

The API runs at `http://localhost:8080/api/tasks`.
Database settings are in `backend/src/main/resources/application.properties`.

## Frontend

```powershell
cd frontend
pnpm install
pnpm run dev
```

Open `http://localhost:3000`.

## GitHub Actions se EC2 deployment

EC2 par Ubuntu, Docker aur Docker Compose installed hone chahiye.

GitHub repository mein **Settings > Secrets and variables > Actions** par ye secrets add karo:

- `EC2_HOST`: EC2 public IP ya domain
- `EC2_USER`: normally `ubuntu`
- `EC2_SSH_KEY`: EC2 instance ka private PEM key
- `DB_PASSWORD`: strong MySQL root password
- `NEXT_PUBLIC_API_URL`: `http://EC2-IP-OR-DOMAIN:8080/api/tasks`
- `CORS_ALLOWED_ORIGINS`: `http://EC2-IP-OR-DOMAIN:3000`

EC2 Security Group mein ports `3000` aur `8080` allow karo. `main` branch mein push karte hi GitHub Actions automatically Docker containers deploy karega.
