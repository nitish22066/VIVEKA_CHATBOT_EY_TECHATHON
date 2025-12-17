# Viveka Deployment Guide

Complete guide for deploying Viveka to production environments.

## 🏠 Local Development

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 15 with pgvector
- Mistral API key

### Setup
```bash
# Clone repository
git clone <repo-url>
cd viveka

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install

# Start services
# Terminal 1: PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=viveka_db \
  -e POSTGRES_USER=viveka_user \
  -e POSTGRES_PASSWORD=viveka_pass \
  -p 5432:5432 \
  pgvector/pgvector:pg15-latest

# Terminal 2: Backend
cd backend
python -c "from database import init_db; init_db()"
uvicorn api_v2:app --reload --port 8000

# Terminal 3: Frontend
cd frontend
npm run dev
```

Access: http://localhost:5173

---

## 🐳 Docker Compose (Recommended)

### Quick Start
```bash
docker-compose up -d
```

### Monitor Services
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Connect to database
docker-compose exec postgres psql -U viveka_user -d viveka_db
```

### Cleanup
```bash
# Stop all services
docker-compose down

# Remove all data
docker-compose down -v
```

---

## ☁️ Cloud Deployments

### AWS ECS

#### 1. Build Docker Image
```bash
aws ecr create-repository --repository-name viveka-backend
docker build -t viveka-backend .
docker tag viveka-backend:latest <aws-account>.dkr.ecr.<region>.amazonaws.com/viveka-backend:latest
aws ecr get-login-password | docker login --username AWS --password-stdin <aws-account>.dkr.ecr.<region>.amazonaws.com
docker push <aws-account>.dkr.ecr.<region>.amazonaws.com/viveka-backend:latest
```

#### 2. Create ECS Task Definition
```json
{
  "family": "viveka-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [{
    "name": "viveka-backend",
    "image": "<aws-account>.dkr.ecr.<region>.amazonaws.com/viveka-backend:latest",
    "portMappings": [{
      "containerPort": 8000,
      "protocol": "tcp"
    }],
    "environment": [
      {
        "name": "DATABASE_URL",
        "value": "postgresql://viveka_user:viveka_pass@viveka-db.c9akciq32.us-east-1.rds.amazonaws.com/viveka_db"
      },
      {
        "name": "MISTRAL_API_KEY",
        "value": "${MISTRAL_API_KEY}"
      }
    ]
  }]
}
```

#### 3. Create ECS Service
```bash
aws ecs create-service \
  --cluster viveka-prod \
  --service-name viveka-api \
  --task-definition viveka-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}"
```

---

### Google Cloud Run

#### 1. Build and Push Image
```bash
gcloud auth configure-docker
docker build -t gcr.io/<project-id>/viveka-backend .
docker push gcr.io/<project-id>/viveka-backend
```

#### 2. Deploy to Cloud Run
```bash
gcloud run deploy viveka-backend \
  --image gcr.io/<project-id>/viveka-backend \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --timeout 3600 \
  --set-env-vars DATABASE_URL=<database-url>,MISTRAL_API_KEY=<api-key>
```

#### 3. Setup Database (Cloud SQL)
```bash
# Create PostgreSQL instance
gcloud sql instances create viveka-db \
  --database-version POSTGRES_15 \
  --tier db-f1-micro \
  --region us-central1

# Enable pgvector extension
gcloud sql connect viveka-db --user=postgres
CREATE EXTENSION vector;
```

---

### Heroku

#### 1. Setup Heroku App
```bash
heroku create viveka-prod
heroku addons:create heroku-postgresql:standard-0 -a viveka-prod
heroku addons:create heroku-redis:premium-0 -a viveka-prod
```

#### 2. Deploy
```bash
git push heroku main
```

#### 3. Enable pgvector
```bash
heroku pg:psql -a viveka-prod
CREATE EXTENSION vector;
```

---

### Docker Swarm

#### 1. Initialize Swarm
```bash
docker swarm init
```

#### 2. Deploy Stack
```bash
docker stack deploy -c docker-compose.yml viveka
```

#### 3. Monitor
```bash
docker service ls
docker service ps viveka_backend
```

---

### Kubernetes (Production-Grade)

#### 1. Build & Push Image
```bash
docker build -t <registry>/viveka-backend:latest .
docker push <registry>/viveka-backend:latest
```

#### 2. Create Kubernetes Deployment
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: viveka-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: viveka-backend
  template:
    metadata:
      labels:
        app: viveka-backend
    spec:
      containers:
      - name: viveka-backend
        image: <registry>/viveka-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: viveka-secrets
              key: database-url
        - name: MISTRAL_API_KEY
          valueFrom:
            secretKeyRef:
              name: viveka-secrets
              key: mistral-api-key
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
```

#### 3. Deploy
```bash
kubectl apply -f deployment.yaml
kubectl expose deployment viveka-backend --type=LoadBalancer --port=80 --target-port=8000
```

---

## 🔒 Security Best Practices

### Environment Variables
```bash
# .env (never commit)
DATABASE_URL=postgresql://user:pass@host/db
MISTRAL_API_KEY=sk-...
REDIS_URL=redis://host:6379/0
ENVIRONMENT=production
DEBUG=false
```

### Database Backups
```bash
# Daily backup
0 2 * * * docker-compose exec -T postgres pg_dump -U viveka_user viveka_db > /backup/viveka_$(date +%Y%m%d).sql

# Restore from backup
psql -U viveka_user -d viveka_db < /backup/viveka_20240101.sql
```

### SSL/TLS
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Use with nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/cert.pem;
    ssl_certificate_key /etc/nginx/key.pem;
    proxy_pass http://backend:8000;
}
```

### Rate Limiting
```python
# In api_v2.py
from slowapi import Limiter

limiter = Limiter(key_func=lambda: request.remote_addr)

@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat(request: ChatRequest):
    ...
```

---

## 📊 Monitoring & Logging

### Prometheus Metrics
```python
# Add to backend
from prometheus_client import Counter, Histogram
import time

chat_requests = Counter('chat_requests_total', 'Total chat requests')
chat_latency = Histogram('chat_latency_seconds', 'Chat response latency')

@app.post("/api/chat")
async def chat(request: ChatRequest):
    chat_requests.inc()
    start = time.time()
    # ... process chat
    chat_latency.observe(time.time() - start)
```

### ELK Stack (Elasticsearch, Logstash, Kibana)
```yaml
# docker-compose addition
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
  environment:
    - discovery.type=single-node
  ports:
    - "9200:9200"

logstash:
  image: docker.elastic.co/logstash/logstash:7.14.0
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
  ports:
    - "5000:5000"

kibana:
  image: docker.elastic.co/kibana/kibana:7.14.0
  ports:
    - "5601:5601"
```

### Datadog Integration
```python
from datadog import initialize, api

initialize(api_key="<api-key>", app_key="<app-key>")

# Track custom metrics
api.Metric.send(
    metric="viveka.chat.requests",
    points=1,
    tags=["environment:production"]
)
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run tests
        run: |
          cd backend
          pip install -r requirements.txt
          pytest test_suite.py -v
      
      - name: Build Docker image
        run: docker build -t viveka-backend .
      
      - name: Push to registry
        run: |
          docker tag viveka-backend:latest ${{ secrets.REGISTRY }}/viveka-backend:latest
          docker push ${{ secrets.REGISTRY }}/viveka-backend:latest
      
      - name: Deploy to production
        run: |
          # SSH to server and pull latest image
          ssh deploy@prod-server 'cd /app/viveka && docker-compose pull && docker-compose up -d'
```

---

## 📈 Scaling

### Horizontal Scaling
```bash
# Add more backend replicas
docker-compose up -d --scale backend=3

# Or with Kubernetes
kubectl scale deployment viveka-backend --replicas=5
```

### Database Connection Pooling
```python
# database.py
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,          # connections in pool
    max_overflow=40,       # overflow connections
    pool_pre_ping=True,    # test before using
    echo=False
)
```

### Redis Caching
```python
# Add to api_v2.py
import redis
from functools import wraps

redis_client = redis.Redis(host='redis', port=6379, db=0)

def cache_response(ttl=300):
    def decorator(f):
        @wraps(f)
        async def wrapper(*args, **kwargs):
            cache_key = f"{f.__name__}:{args}:{kwargs}"
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            result = await f(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator

@app.get("/api/analytics/summary")
@cache_response(ttl=3600)
async def get_summary():
    ...
```

---

## 🚨 Disaster Recovery

### Backup Strategy
```bash
#!/bin/bash
# Daily backup script

BACKUP_DIR="/backups/viveka"
DATE=$(date +%Y%m%d_%H%M%S)

# PostgreSQL backup
docker-compose exec -T postgres pg_dump -U viveka_user viveka_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz backend/ frontend/

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://viveka-backups/
aws s3 cp $BACKUP_DIR/app_$DATE.tar.gz s3://viveka-backups/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

### Recovery Procedure
```bash
# 1. Restore database
gunzip < db_backup.sql.gz | psql -U viveka_user -d viveka_db

# 2. Restore application files
tar -xzf app_backup.tar.gz

# 3. Restart services
docker-compose restart

# 4. Verify
curl http://localhost:8000/health
```

---

## ✅ Pre-Launch Checklist

- [ ] All tests passing (`pytest test_suite.py -v`)
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting configured
- [ ] Logging/monitoring setup
- [ ] Secrets not in code repository
- [ ] Database migrations run
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Incident response plan created
- [ ] Runbooks prepared

---

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs backend`
2. Review database: `psql -U viveka_user -d viveka_db`
3. Test health: `curl http://localhost:8000/health`
4. Check connectivity: `docker network inspect viveka_viveka_network`

---

**Last Updated**: December 2024
**Deployment Version**: 2.0.0
