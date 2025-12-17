# Viveka Quick Reference Guide

## 🚀 Quick Start Commands

### Start Everything (Docker)
```bash
docker-compose up -d
```

### Access Applications
```
Frontend:     http://localhost:5173/chat
API Docs:     http://localhost:8000/docs
API Health:   curl http://localhost:8000/health
Analytics:    http://localhost:8000/api/analytics/summary
```

### Run Tests
```bash
cd backend && pytest test_suite.py -v
```

### Stop Services
```bash
docker-compose down
```

---

## 🧠 Core Concepts

### Intent Types (Priority Order)
1. `EMI_QUERY` - "What's my EMI?"
2. `ELIGIBILITY_CHECK` - "Am I eligible?"
3. `DOCUMENT_QUERY` - "What docs do I need?"
4. `PERSONAL_LOAN` - "I want a personal loan"
5. `CAR_LOAN` - "I need a car loan"
6. `EDUCATION_LOAN` - "Education loan please"
7. `GENERAL_INQUIRY` - Default

### Conversation Stages
```
INITIAL → TRUST_BUILDING → NEED_DISCOVERY → EDUCATION 
→ PERSONALIZATION → ELIGIBILITY → OUTCOME
```

### Entity Types
- **Amount**: ₹5,00,000 | Rs 500000 | 5 lakh
- **Tenure**: 60 months | 5 years
- **Salary**: ₹1 lakh | 100000

---

## 📊 API Quick Reference

### Create Session
```bash
curl -X POST http://localhost:8000/api/session \
  -H "Content-Type: application/json"
```

### Send Message
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "...",
    "message": "I need ₹5 lakh for 5 years",
    "user_id": "optional"
  }'
```

### Get Analytics
```bash
curl http://localhost:8000/api/analytics/summary | jq
```

### Record Consent
```bash
curl -X POST http://localhost:8000/api/consent/SESSION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "action": "data_access",
    "confirmed": true
  }'
```

---

## 🗄️ Database Quick Commands

### Connect to Database
```bash
docker-compose exec postgres psql -U viveka_user -d viveka_db
```

### View Active Sessions
```sql
SELECT session_id, user_id, current_stage, message_count 
FROM sessions 
WHERE status = 'active'
ORDER BY created_at DESC;
```

### View Loan Applications
```sql
SELECT loan_id, user_id, loan_type, status, eligibility_score 
FROM loan_applications 
ORDER BY created_at DESC;
```

### View Conversation History
```sql
SELECT turn_number, role, message, current_stage 
FROM conversation_logs 
WHERE session_id = 'SESSION_ID'
ORDER BY turn_number;
```

### View Consent Audit Trail
```sql
SELECT action, confirmed, confirmed_at 
FROM consent_audits 
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC;
```

---

## 🧪 Common Test Commands

### Run All Tests
```bash
pytest backend/test_suite.py -v
```

### Run Specific Test Class
```bash
pytest backend/test_suite.py::TestEntityExtraction -v
```

### Run With Coverage
```bash
pytest backend/test_suite.py --cov=backend --cov-report=html
```

### Run Performance Tests Only
```bash
pytest backend/test_suite.py::TestPerformance -v
```

---

## 📊 Metrics To Monitor

### Key Metrics
- `conversation_duration_avg` - How long are sessions?
- `eligibility_pass_rate` - What % of users are approved?
- `foir_avg_ratio` - Average loan burden
- `response_time_avg_ms` - Bot response speed
- `soft_landing_rate` - Alternatives offered

### View in Browser
```
http://localhost:8000/api/analytics/summary
```

### View Specific Report
```
http://localhost:8000/api/analytics/report/eligibility
http://localhost:8000/api/analytics/report/funnel
http://localhost:8000/api/analytics/report/performance
```

---

## 🐛 Troubleshooting

### Services Not Starting
```bash
# Check what's running
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs postgres

# Restart specific service
docker-compose restart backend
```

### Database Connection Error
```bash
# Test connection
docker-compose exec postgres psql -U viveka_user -c "SELECT 1;"

# Check database URL
echo $DATABASE_URL

# Verify database exists
docker-compose exec postgres psql -U viveka_user -l
```

### RAG Not Working
```bash
# Check documents ingested
curl http://localhost:8000/api/analytics/summary | grep rag_documents

# Ingest documents manually
docker-compose exec backend python -c "
from backend.rag_engine import RAGEngine
from backend.ingest_documents import ingest_from_knowledge_base
rag = RAGEngine()
count = ingest_from_knowledge_base(rag)
print(f'Ingested {count} documents')
"
```

### Bot Not Responding
```bash
# Check backend health
curl http://localhost:8000/health

# View API logs
docker-compose logs -f backend | grep -i error
```

---

## 💡 Common Scenarios

### Test EMI Calculation
```
User Input:   "₹5 lakh for 5 years"
Expected:     EMI: ₹9,949.54
              Total Interest: ₹96,971.95
```

### Test Eligibility Check
```
User Income:  ₹75,000
Loan Amount:  ₹5,00,000
Tenure:       60 months
Expected:     ELIGIBLE (FOIR = 13.3%)
```

### Test Soft Landing
```
User Income:  ₹30,000
Loan Amount:  ₹5,00,000
Expected:     INELIGIBLE (FOIR = 33%)
              Alternative: ₹1,50,000 for same EMI
```

### Test Intent Priority
```
Message: "What's the EMI for my personal loan?"
Expected: EMI_QUERY (not PERSONAL_LOAN)
Reason:   EMI_QUERY has higher priority
```

---

## 📝 Environment Variables

```
MISTRAL_API_KEY=sk-...                    # Mistral LLM API key
DATABASE_URL=postgresql://...             # PostgreSQL connection
REDIS_URL=redis://redis:6379              # Redis cache (optional)
LOG_LEVEL=INFO                            # Logging level
ENVIRONMENT=production                    # Environment type
DEBUG=false                               # Debug mode
```

---

## 🔐 Security Checklist

Before Production:
- [ ] Change default database password
- [ ] Set strong API keys
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Setup database backups
- [ ] Enable rate limiting
- [ ] Review CORS settings
- [ ] Test encryption
- [ ] Verify audit logging
- [ ] Run security tests

---

## 🚢 Deployment Quick Start

### Docker Compose (Dev)
```bash
docker-compose -f docker-compose.yml up -d
```

### Docker Compose (Prod)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

### AWS ECS
```bash
aws ecs create-service \
  --cluster viveka-prod \
  --service-name viveka-api \
  --task-definition viveka-backend
```

### Google Cloud Run
```bash
gcloud run deploy viveka-backend \
  --image gcr.io/project/viveka-backend \
  --platform managed \
  --region us-central1
```

---

## 📞 Support Resources

### Documentation Files
- `README.md` - Overview & quick start
- `DEPLOYMENT.md` - Deployment guides
- `SYSTEM_SUMMARY.md` - Complete system summary
- `METRICS_GUIDE.md` - Metrics documentation

### Code Files
- `backend/api_v2.py` - API endpoints (with docstrings)
- `backend/viveka_bot_v2.py` - Bot logic (with docstrings)
- `backend/database.py` - Database models (with docstrings)

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🎯 Development Workflow

### Add New Feature
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Add tests to `test_suite.py`
4. Run tests: `pytest test_suite.py -v`
5. Verify no regressions
6. Commit: `git commit -m "Add feature"`
7. Push: `git push origin feature/your-feature`
8. Create pull request

### Debug Issue
1. Check logs: `docker-compose logs -f backend`
2. Test endpoint: `curl http://localhost:8000/api/...`
3. Check database: `SELECT * FROM ...`
4. Run specific test: `pytest test_suite.py::TestName -v`
5. Add debug logging if needed

### Deploy Changes
1. Run tests: `pytest test_suite.py -v`
2. Build image: `docker build -t viveka-backend:latest .`
3. Push to registry
4. Update deployment
5. Monitor metrics: `http://localhost:8000/api/analytics/summary`

---

## ⚡ Performance Tips

### Optimize Database
```bash
# Connect to database
docker-compose exec postgres psql -U viveka_user -d viveka_db

# Check indexes
\d conversation_logs

# Vacuum database
VACUUM ANALYZE;
```

### Enable Caching
```python
# Add to api_v2.py
from functools import lru_cache

@lru_cache(maxsize=128)
def get_cached_documents():
    ...
```

### Monitor Performance
```
http://localhost:8000/api/analytics/performance
```

---

## 📱 Mobile Access

### Setup CORS
```python
# Already configured in api_v2.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Connect From Mobile
```javascript
const API_URL = "https://api.example.com:8000"  // Use HTTPS in production
const WS_URL = "wss://api.example.com:8000/ws"   // Use WSS in production

// Create session
const sessionResponse = await fetch(`${API_URL}/api/session`, {
  method: 'POST'
})
const { session_id } = await sessionResponse.json()

// Send message
const chatResponse = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  body: JSON.stringify({
    session_id,
    message: "I need a loan"
  })
})
```

---

## 🎓 Learning Resources

### Understand the Flow
1. Read `SYSTEM_SUMMARY.md` - High-level overview
2. Check `README.md` - Architecture & features
3. Study `backend/viveka_bot_v2.py` - Core logic
4. Review `backend/rag_engine.py` - RAG implementation
5. Test with API - `http://localhost:8000/docs`

### Understand the Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind
- **Backend**: FastAPI + Python 3.12 + LangChain
- **Database**: PostgreSQL 15 + pgvector extension
- **Search**: HuggingFace Embeddings + IVFFlat index
- **LLM**: Mistral AI (via LangChain)

---

**Last Updated**: December 2024
**Version**: 2.0.0
**Quick Ref**: For detailed info, see full documentation files
