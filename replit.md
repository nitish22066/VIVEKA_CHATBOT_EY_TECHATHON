# VIVEKA - AI Loan Assistant

## Overview
VIVEKA is an AI-powered loan assistant application with a React frontend. The chatbot helps users navigate loan options (car, education, business loans), understand credit scores, and complete loan applications with document uploads.

## Project Architecture

### Frontend (React + Vite + TypeScript)
- **Entry Point**: `main.tsx` and `App.tsx` in root directory
- **Components**: `components/` - Navbar, Footer
- **Pages**: `pages/` - Home, Chatbot, FAQ, KnowledgeCenter, BudgetPlanner, Trust, SMSAssist, Community, LocateBranch
- **Styles**: `styles/globals.css` with Tailwind CSS
- **Config**: `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`

### Knowledge Base
- **Location**: `knowledge_base/` - PDF and markdown documents for reference

## Chatbot Features
The chatbot (`pages/Chatbot.tsx`) includes:
1. **Persuasive loan conversations** for car, education, and business loans
2. **Knowledge base queries** - answers questions about credit scores, EMI, interest rates, etc.
3. **Loan detail collection** - amount, tenure, interest rate calculation
4. **Consent management** - asks for user consent before collecting details
5. **Document upload flow** - type-specific document requirements with upload buttons
6. **Document validation** - validates uploads, escalates invalid docs to officer
7. **Loan approval** - generates sanction letter PDF for download

### Document Requirements by Loan Type
- **Education Loan**: Academic records, admission letter, KYC, co-applicant income proof
- **Business Loan**: GST certificate, bank statements, ITR, balance sheets
- **Car Loan**: KYC, income proof, bank statements

## Development

### Running the Frontend
```bash
npm run dev
```
Frontend runs on port 5000 using Vite.

### Building for Production
```bash
npm run build
```
Output goes to `dist/` directory.

## Recent Changes
- 2024-12-16: Removed backend code, simplified architecture
- 2024-12-16: Built complete chatbot with persuasive responses
- 2024-12-16: Added document upload and validation flow
- 2024-12-16: Added sanction letter generation and download

## User Preferences
- Purple/violet color scheme for branding
- Clean, modern UI with Tailwind CSS
- React with TypeScript
- No heavy LLM dependencies - simple rule-based chatbot
