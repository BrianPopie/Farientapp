# Farient -- Executive Compensation Intelligence Platform

**Product Requirements Document (PRD)**  
**Last updated:** Nov 8, 2025  
**Author:** Brian / Zaigo Labs

---

## 1. Overview

Farient is an AI-powered research platform for executive compensation and governance intelligence. It transforms complex SEC filings and policy data into structured, auditable insights -- enabling analysts to perform benchmarking, pay-for-performance evaluations, and policy risk assessments 10x faster with full source traceability.

## 2. Problem Statement

Traditional executive-comp research is slow, manual, and error-prone:

- Analysts spend hours extracting tables from DEF 14As and 10-Ks.
- Peer-group benchmarking and pay-for-performance analysis require heavy Excel work.
- Policy interpretation (ISS/Glass Lewis) lacks automation and version control.
- Reports to boards are prepared manually, often losing source traceability.

Farient addresses these inefficiencies by automating ingestion, structuring, and analysis -- ensuring every metric is linked back to its filing origin.

## 3. Objectives & KPIs

| Objective | Key Result |
| --- | --- |
| Reduce comp-research turnaround time | 10x faster (from days to hours) |
| Ensure traceability of all metrics | 100% citations linked to filing lines |
| Boost analyst productivity | >= 3x more clients handled per analyst |
| Maintain factual accuracy | >= 95% extraction accuracy (validated via QA agent) |
| Generate board-ready output | One-pager and appendix in < 3 minutes |

## 4. Core Functionalities

### 4.1 Filing Ingestion & Parsing Engine

- Fetches DEF 14A, 10-K/Q, 8-K, and Form 4 from EDGAR automatically.
- Parses PDF/HTML tables (Summary Comp Table, Grants of Plan-Based Awards, Pay-vs-Performance).
- Normalizes entities (tickers, CIKs, exec names, metric definitions).
- Tracks citations per cell for complete auditability.

### 4.2 Structured Data Lake + Semantic Search

- Hybrid Postgres + pgvector architecture.
- Enables hybrid retrieval (structured SQL + semantic search).
- Supports source-bounded RAG -- LLMs can only reference verified spans.
- Versioned schema per policy year and extraction template.

### 4.3 Benchmarking & Pay-for-Performance Analytics

- Peer-group selection with transparency on inclusion logic.
- TSR vs. compensation trend charts.
- Pay-mix visualization and outlier detection.
- Plan-design benchmarking across metrics and vesting types.

### 4.4 Policy & Governance Intelligence

- Maps practices to ISS/Glass Lewis policy criteria.
- Computes Say-on-Pay risk scores with evidence.
- Tracks policy deltas between years (e.g., 2025 -> 2026).
- Links ESG and governance data to comp structures.

### 4.5 Agentic Research Workflow

- Multi-agent pipeline (Gatherer, Extractor, Analyst, QA, Report).
- Each step logged with duration and status.
- Built for human-in-the-loop QA and reproducibility.

### 4.6 Board-Ready Report Generation

- Auto-generate Google Docs/Slides one-pagers, tear sheets, and appendix tables.
- Dynamic drill-down sections (summary -> detail).
- Citations clickable to source filing.

### 4.7 Administrative & Integration Layer

- SSO + role-based access.
- Template and peer-set editors.
- Slack/Email/Drive/Salesforce integrations.
- Full audit logging and retry queues.

## 5. Architecture Summary

- **Frontend:** Next.js 15 (App Router) + Tailwind + shadcn/ui + Recharts + Zustand.  
- **Backend (later phase):** Supabase / Postgres + pgvector + LangGraph agent orchestration.  
- **Storage:** JSON-structured filings + citations + vector index.  
- **Integrations:** Google Docs/Slides API, Slack Webhook, Salesforce Engagement Object.  
- **Security:** SSO (Google Workspace / Okta), PII scrubbers, audit logs.

## 6. MVP Scope (6-8 Week Pilot)

**Included**

- Mock ingestion from public EDGAR filings (10 companies).
- Parsing simulation with line-level citations.
- Semantic search over structured data.
- Peer benchmarking + P4P charts.
- Policy risk dashboard.
- Agentic workflow visualization.
- Exportable board-ready PDF/Slides (mock).

**Excluded**

- Live EDGAR API integration (Phase 2).
- Licensed data vendors (Equilar, ISS, GL).
- Real Google/Slack integrations (placeholders).

## 7. Phased Timeline

| Phase | Duration | Focus |
| --- | --- | --- |
| 0. Design Sprint | 1 week | Stakeholder mapping, schema design |
| 1. Data & Ingestion | 2 weeks | Filings pipeline + normalization |
| 2. Agentic Workflows | 2 weeks | Gatherer -> QA -> Report agents |
| 3. Pilot & Evaluation | 2 weeks | Run on 10 companies; measure accuracy/time saved |
| 4. Hardening & Integrations | 1 week | SSO, retries, admin, templates |

## 8. Success Metrics

- 10 Companies successfully processed end-to-end.
- >= 95% accuracy in table extraction (manual validation).
- > 90% analyst satisfaction (NPS).
- < 5 minutes to generate a board-ready one-pager.

## 9. Risks & Mitigation

| Risk | Mitigation |
| --- | --- |
| Parsing errors from malformed PDFs | Multi-parser fallback + human-review queue |
| Licensing or data-rights constraints | Begin with public data; add vendor feeds later |
| Policy misinterpretation | Encode ISS/GL rules as versioned JSON logic trees |
| Peer-set subjectivity | Transparent peer builder with filter visibility |
| Hallucinated outputs | RAG restricted to cited spans only |

## 10. Future Enhancements

- Fine-tuned LLM for comp terminology (CD&A-aware model).
- Smart narrative generator ("Analyst Summary" paragraphs).
- Continuous policy tracker (live ISS/GL diff feed).
- Predictive comp modeling ("if-we-grant-this, ISS score = X").
- Automated QA metrics dashboard with regression testing.

## 11. Deliverables

- Farient Mock UI (Next.js 15 App) -- Seven functional sections with mocked data.
- Structured Schema Definition -- SQL + JSON schemas for filings, grants, peers, citations.
- Demo Dataset -- 10 companies x 5 years x ~300 citations.
- Evaluation Script -- Accuracy and performance harness.
- Pilot Report Deck -- NPS results, time savings, next-phase recommendations.

## 12. Ownership

| Role | Owner | Responsibility |
| --- | --- | --- |
| Product Lead | Brian | Vision, roadmap, and client coordination |
| Engineering Lead | Dom / Aris | Architecture, development, and QA |
| Design Lead | Rodj | UI/UX system, layouts, and visuals |
| Data Engineer | TBD | ETL, normalization, and Postgres schema |
| AI Engineer | TBD | Agent workflow and RAG integration |
