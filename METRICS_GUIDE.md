"""
VIVEKA BOT - PERFORMANCE METRICS & ANALYTICS GUIDE
Comprehensive documentation of all measurable metrics and KPIs
"""

# ============================================================================
# METRICS CATEGORIES & DEFINITIONS
# ============================================================================

## 1. CONVERSATION METRICS
Measures the interaction patterns and engagement

### Metrics:
- **Total Conversations**: Count of unique chat sessions initiated
- **Completed Conversations**: % of conversations that reached outcome stage
- **Avg Duration**: Average time per conversation (seconds)
- **Avg Messages**: Average user+bot messages per conversation
- **Avg Turns**: Average user turns (distinct user inputs)
- **Completion Rate**: % of conversations that completed full flow

### Why It Matters:
- Low duration = quick decisions (good for simple queries)
- High messages = engaged users exploring deeply
- Drop-off = identify where users abandon flow

### Calculation:
```
completion_rate = (conversations reaching outcome / total conversations) × 100
avg_duration = sum(session_end - session_start) / total_conversations
```


## 2. ELIGIBILITY & FINANCIAL METRICS
Measures loan qualification and financial parameters

### Metrics:
- **Pass Rate**: % of users who qualify for loans
- **Avg Loan Amount (Requested)**: Average amount users ask for
- **Avg Loan Amount (Safe)**: Average recommended amount (FOIR adjusted)
- **Amount Difference**: Gap between requested vs safe amounts
- **Avg FOIR Ratio**: Average Fixed Obligation to Income Ratio
- **Avg Credit Score**: Average CIBIL score of applicants
- **Avg Salary**: Average monthly income
- **Avg EMI**: Average monthly EMI calculated

### Why It Matters:
- Pass rate indicates product-market fit
- Amount gap shows over-requesting patterns
- High FOIR = risk of defaults
- Credit score distribution = customer segment quality

### Calculation:
```
pass_rate = (eligible_users / total_checks) × 100
FOIR = (total_existing_EMI + new_EMI) / monthly_salary
safe_amount = (max_safe_EMI × tenure_months) / (1 + monthly_rate)
```


## 3. STAGE FUNNEL METRICS
Measures user progression through conversation stages

### 7 Stages:
1. INITIAL - First greeting
2. TRUST_BUILDING - Establish rapport
3. NEED_DISCOVERY - Identify loan type
4. EDUCATION - Explain products
5. PERSONALIZATION - Collect details
6. ELIGIBILITY - Check qualification
7. OUTCOME - Final documents/next steps

### Metrics:
- **Stage Distribution**: Where conversations end
- **Stage Funnel**: Number of users reaching each stage
- **Stage Drop-Off**: % of users who don't progress from each stage
- **Avg Messages per Stage**: Time spent in each stage

### Why It Matters:
- Identifies bottlenecks where users abandon
- Shows if education phase is effective
- Reveals flow design issues

### Example Analysis:
```
Stage          Users    Drop-off %
INITIAL        1000     -
TRUST_BUILDING 980      2%
NEED_DISCOVERY 950      3%
EDUCATION      900      5%
PERSONALIZATION 800     11%  ← Drop-off spike = problem here
ELIGIBILITY    700      12%
OUTCOME        600      14%
```


## 4. INTENT METRICS
Measures what users are looking for

### Intents (7 types):
- CAR_LOAN - Vehicle financing
- PERSONAL_LOAN - General loans
- EDUCATION_LOAN - Study financing
- EMI_QUERY - Calculation requests
- ELIGIBILITY_CHECK - Qualification checks
- DOCUMENT_QUERY - Document requirements
- GENERAL_INQUIRY - Other questions

### Metrics:
- **Intent Distribution**: % of users by intent type
- **Intent by Final Stage**: Where each intent ends up
- **Action Intent Rate**: % asking for EMI/eligibility directly

### Why It Matters:
- Product mix planning (which products matter most)
- Intent accuracy = quality of NLP
- Action intents = direct path seekers (optimize for them)

### Example:
```
CAR_LOAN: 45% of users
PERSONAL_LOAN: 30%
EDUCATION_LOAN: 15%
OTHER: 10%
```


## 5. ENTITY EXTRACTION METRICS
Measures how well we collect required information

### Entities:
- **Amount**: Loan amount requested (₹)
- **Duration**: Tenure requested (months)

### Metrics:
- **Extraction Rate**: % of conversations where entity was captured
- **Amount Distribution**: Min/Max/Avg amounts requested
- **Duration Distribution**: Tenure preferences
- **Extraction Accuracy**: Valid values vs malformed

### Why It Matters:
- High extraction = less back-and-forth
- Patterns reveal user preferences
- Low rate = NLP improvement needed

### Calculation:
```
extraction_rate = (conversations_with_entity / total_conversations) × 100
```


## 6. PERFORMANCE METRICS
Measures system health and responsiveness

### Metrics:
- **Avg Response Time**: Average API response (ms)
- **P95 Response Time**: 95th percentile (indicates tail latency)
- **P99 Response Time**: 99th percentile (worst case)
- **Error Rate**: % of interactions with errors
- **Uptime**: System availability %

### Why It Matters:
- Slow responses → poor UX → abandonment
- P95/P99 reveal outliers (debugging hints)
- Error rate indicates code quality

### Targets:
- Avg < 200ms
- P95 < 500ms
- P99 < 1000ms
- Error rate < 1%


## 7. ENGAGEMENT METRICS
Measures user interaction quality

### Metrics:
- **Messages per Turn**: Verbosity of user input
- **Stage Jump Rate**: % of users skipping stages
- **Direct Query Rate**: % asking for EMI/eligibility directly
- **Return Rate**: % of users with multiple sessions
- **Bounce Rate**: Users who leave after greeting

### Why It Matters:
- High engagement = good content
- Stage jumpers = power users
- Bounce rate = greeting effectiveness
- Return rate = product value


## 8. FINANCIAL IMPACT METRICS
Measures business value

### Metrics:
- **Avg Loan Amount**: Total potential AUM
- **Pass Rate × Avg Loan × Conversion**: Projected disbursals
- **FOIR Distribution**: Risk assessment
- **Safe Amount Variance**: How much users were requesting vs safe
- **Interest Rate Distribution**: By credit tier

### Calculation:
```
Estimated_Monthly_Revenue = Pass_Rate × Avg_EMI × Interest_Rate / 100
Expected_AUM = Pass_Rate × Avg_Loan_Amount × Unique_Users
Risk_Score = Avg_FOIR / 50  (where 50% is max safe)
```


# ============================================================================
# METRIC TRACKING CHECKLIST
# ============================================================================

## Automatic Tracking (Built-in):
✅ Conversation start/end times
✅ Message counts
✅ Stage transitions
✅ Intent detection
✅ Entity extraction
✅ Eligibility check results
✅ Response times
✅ Error logs
✅ FOIR calculations
✅ EMI calculations

## Optional Advanced Tracking:
- User satisfaction (feedback)
- Document upload success rate
- Actual loan disbursals (backend integration)
- Customer lifetime value
- Cross-sell opportunities
- Churn prediction


# ============================================================================
# VISUALIZATION RECOMMENDATIONS
# ============================================================================

### For Dashboards:

1. **Funnel Chart** (Stage Distribution)
   - Shows drop-off visually
   - X-axis: Stages | Y-axis: User count
   
2. **Pie Chart** (Intent Distribution)
   - Product mix clarity
   - Can drill down by stage

3. **Histogram** (Duration Distribution)
   - How long sessions take
   - Identify outliers

4. **Line Chart** (Eligibility Rate Over Time)
   - Track product-market fit trend
   - Weekly/daily granularity

5. **Scatter Plot** (Amount vs FOIR)
   - Spot high-risk applicants
   - Identify patterns

6. **Heat Map** (Stage × Intent Matrix)
   - Which intents reach which stages
   - Conversion by segment

7. **Box Plot** (Response Time Distribution)
   - Performance health
   - SLA compliance

8. **Bar Chart** (Metrics Comparison)
   - Week-over-week trends
   - Benchmark against targets


# ============================================================================
# API ENDPOINTS FOR METRICS
# ============================================================================

## Summary
GET /api/analytics/summary
→ Returns all metrics in one call

## Conversations
GET /api/analytics/conversations → Conversation metrics
GET /api/analytics/conversations/timeline → Timeline data for visualization

## Funnel
GET /api/analytics/funnel → Stage funnel + drop-off
GET /api/analytics/funnel/json → Formatted for charting

## Eligibility
GET /api/analytics/eligibility → Eligibility metrics
GET /api/analytics/eligibility/distribution → Distribution data

## Intents
GET /api/analytics/intents → Intent distribution
GET /api/analytics/intents/chart → Pie chart ready data

## Entities
GET /api/analytics/entities → Entity extraction rates

## Performance
GET /api/analytics/performance → Response times, errors
GET /api/analytics/performance/response-times → Raw response times

## Custom Reports
GET /api/analytics/report/stage-analysis → Stage deep-dive
GET /api/analytics/report/user-journey → User behavior patterns
GET /api/analytics/report/eligibility-analysis → Eligibility segments

## Exports
GET /api/analytics/export/all → JSON export
GET /api/analytics/export/csv/conversations → CSV conversations
GET /api/analytics/export/csv/eligibility → CSV eligibility checks


# ============================================================================
# SAMPLE METRICS OUTPUT
# ============================================================================

```json
{
  "conversation_metrics": {
    "total_conversations": 1250,
    "completed_conversations": 750,
    "avg_duration_seconds": 142.5,
    "avg_messages": 8.3,
    "avg_turns": 4.2,
    "completion_rate_pct": 60.0
  },
  "eligibility_metrics": {
    "total_checks": 450,
    "pass_rate_pct": 72.5,
    "avg_loan_amount_requested": 650000,
    "avg_loan_amount_safe": 520000,
    "avg_foir_ratio": 42.3,
    "avg_credit_score": 715,
    "avg_salary": 75000,
    "avg_emi": 12450
  },
  "stage_metrics": {
    "stage_distribution": {
      "initial": 1250,
      "trust_building": 1180,
      "need_discovery": 1050,
      "education": 920,
      "personalization": 800,
      "eligibility": 650,
      "outcome": 450
    },
    "intent_distribution": {
      "car_loan": 562,
      "personal_loan": 375,
      "education_loan": 188,
      "eligibility_check": 125
    }
  },
  "performance_metrics": {
    "avg_response_time_ms": 145.2,
    "p95_response_time_ms": 380.5,
    "p99_response_time_ms": 820.1,
    "error_rate_pct": 0.8
  }
}
```


# ============================================================================
# BENCHMARKS & TARGETS
# ============================================================================

### Conversation Health:
- Completion Rate: Target > 50% (industry avg ~35%)
- Avg Duration: 120-180 seconds (indicates engagement depth)
- Avg Messages: > 6 (conversational depth)
- Bounce Rate: < 10% (greeting effectiveness)

### Eligibility:
- Pass Rate: Target 60-75% (product fit)
- FOIR Average: 40-45% (safe risk level)
- Credit Score Avg: > 700 (quality customers)
- Amount Variance: < 20% gap (realistic requests)

### Performance:
- Response Time Avg: < 200ms (good UX)
- P95: < 500ms (tail latency)
- P99: < 1000ms (outliers)
- Error Rate: < 1% (system stability)

### Funnel:
- INITIAL → TRUST: > 95% retention
- TRUST → NEED_DISCOVERY: > 90% retention
- EDUCATION → PERSONALIZATION: > 85% retention
- PERSONALIZATION → ELIGIBILITY: > 80% retention
- ELIGIBILITY → OUTCOME: > 65% retention


# ============================================================================
# INTERPRETATION GUIDE
# ============================================================================

### High Drop-off at EDUCATION Stage?
- Content not engaging
- Too much information too early
- Consider shorter, scannable format

### High Drop-off at PERSONALIZATION?
- Data collection friction
- Users hesitant to share details
- Add "why we need this" explanations

### Low FOIR But High Amount Requests?
- Users over-estimate their capacity
- Need better pre-qualification messaging

### High Response Times?
- Check LLM integration
- Database query optimization needed
- Consider caching responses

### Low Pass Rate Despite Good Credit Scores?
- Existing EMI burden too high
- Consider co-applicant messaging

### Intent Skew to CAR_LOAN?
- Market opportunity: Focus on car financing
- Product mix optimization needed
