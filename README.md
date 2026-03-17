# StudioOS 🖥️

> The Operating System for ZXY Ventures Agentic Studio

**Status:** 🚧 MVP v0.1 | Live at: (coming soon)
**Stack:** Next.js 14 + TypeScript + Tailwind + Notion API
**Owner:** ZXY Ventures | franduranv/studioos

---

## What is StudioOS?

ZXY Ventures operates an agentic venture studio — generating, validating, and building startups with Agent OS (a team of 7 specialized AI agents).

StudioOS is the unified dashboard that makes all of this visible and manageable:

- **Idea Pipeline** — 25+ ideas ranked by Founder-Market Fit + technical score
- **Active Ventures** — Sprint progress, KPIs, and links for the 3 active builds
- **Agent OS Status** — Real-time view of what each agent is working on
- **Stage Gates** — Visual decision flow for Go/Kill on each venture

## The Problem It Solves

Without StudioOS, ZXY runs on a stack of fragmented tools:
- Notion (ideas, deals) 
- Discord (coordination, updates)
- GitHub (code, progress)
- Markdown files (research, reports)
- Manual tracking

This works at 3 ventures. It breaks at 10. StudioOS is the glue.

## Why It Matters

StudioOS is ZXY's "dog food" — the system we need to operate the studio we're building.
If we build it well, it's also the first product we can sell to other venture studios in LatAm.

**Potential as a product:** $500-2,000 USD/month per studio. TAM: 200+ studios in LatAm.

## Features (v0.1 MVP)

- [x] Dashboard with key metrics (active ventures, idea pipeline stats, agent status)
- [x] Idea Pipeline view (ACTIVA / CHISPA / VAULT)
- [x] Active Ventures view with sprint progress
- [x] Agent OS panel (7 agents, their domains and status)
- [ ] Stage Gate flow (Go/Kill decisions — v0.2)
- [ ] Portfolio metrics and financials (v0.3)
- [ ] Multi-studio support (product version — v1.0)

## Tech Stack

```
Frontend: Next.js 14 (App Router) + TypeScript
Styling: Tailwind CSS + shadcn/ui  
Data: Notion API (idea pipeline + projects)
Deploy: Vercel
Auth: None (internal tool — v0.1)
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/franduranv/studioos.git
cd studioos

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your NOTION_API_KEY

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NOTION_API_KEY=ntn_your_notion_key_here
NEXT_PUBLIC_IDEAS_DB_ID=30f16937-3e72-819b-8717-e906e61e7dfb
NEXT_PUBLIC_PROJECTS_DB_ID=30b16937-3e72-819c-8eaf-c0c8b3d5e000
```

## Project Structure

```
studioos/
├── app/
│   ├── page.tsx          # Main dashboard
│   ├── pipeline/
│   │   └── page.tsx      # Idea Pipeline (ACTIVA/CHISPA/VAULT)
│   ├── ventures/
│   │   └── page.tsx      # Active Ventures with sprint tracking
│   └── agents/
│       └── page.tsx      # Agent OS Status panel
├── components/
│   ├── IdeaCard.tsx       # Idea card with score + stage badge
│   ├── VentureCard.tsx    # Venture card with KPIs
│   ├── AgentCard.tsx      # Agent status card
│   └── NavBar.tsx         # Navigation
└── lib/
    ├── notion.ts          # Notion API client
    ├── github.ts          # GitHub API client (repo status)
    └── agents.ts          # Agent OS definitions
```

## The Agent OS

StudioOS is built to surface the work of ZXY's Agent OS:

| Agent | Role | Equivalent |
|-------|------|-----------|
| Hugo | Chief of Staff — coordination & ops | COO |
| Rafa | Research & market intelligence | Head of Research |
| Andrés | Build — code, stack, MVP | CTO |
| Luis | Growth — content, channels | CMO |
| Maribel | Legal — contracts, compliance | CLO |
| Beto | Finance — unit economics | CFO |
| Emily | Comms — stakeholders | Chief of Staff Personal |

**Cost:** ~$15-30K MXN/month in tokens vs. ~$500K-$1M MXN/month human equivalent

## Roadmap

| Version | Focus | Target |
|---------|-------|--------|
| v0.1 (now) | Dashboard + pipeline visibility | Mar 2026 |
| v0.2 | Stage gate flow + Go/Kill interface | Apr 2026 |
| v0.3 | Financial model + portfolio metrics | May 2026 |
| v1.0 | Multi-studio / product version | Jun 2026 |

---

**Built by ZXY Ventures** · [zxy.vc](https://zxy.vc) · León, Guanajuato, México

*"It's not Venture Capital. It's Venture Craft."*
