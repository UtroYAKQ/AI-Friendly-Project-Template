# Deployment

## Environments

- Local: developer machine, fast feedback, in-memory or local database.
- Dev: shared environment for integration testing.
- Prod: production environment with managed secrets, backups, monitoring, and alerts.

## Environment Variables

| Name | Required | Example | Notes |
| --- | --- | --- | --- |
| `NODE_ENV` | yes | `production` | Runtime mode |
| `PORT` | yes | `3000` | Backend HTTP port |
| `DATABASE_URL` | prod | `postgres://...` | Required for real persistence |
| `JWT_SECRET` | prod | `change-me` | Use secret manager in production |
| `VITE_API_BASE_URL` | frontend | `http://localhost:3000/api/v1` | Frontend API base URL |

## Local Run

```bash
docker compose -f docker/docker-local/docker-compose.yml up --build
```

## Dev Run

```bash
docker compose -f docker/docker-dev/docker-compose.yml up --build
```

## Production Checklist

- Use managed secrets instead of committed `.env` files.
- Run migrations before deploying app containers.
- Enable HTTPS and secure headers at the edge.
- Configure health checks and structured logs.
- Back up the production database and test restore procedures.
