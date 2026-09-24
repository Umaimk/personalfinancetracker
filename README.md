# FinTrack — Personal Finance Tracker

A personal finance tracker that helps people log income/expenses, set category budgets, and understand their spending through AI-generated insights.

**Live app:** https://personalfinancetracker-silk.vercel.app/
**Repo:** https://github.com/Umaimk/personalfinancetracker

## Setup & Run Locally

```bash
git clone https://github.com/Umaimk/personalfinancetracker.git
cd personal-finance-tracker
npm install
```

Create a `.env.local` file in the project root (see `.env.example`):

```
GROQ_API_KEY=your-groq-api-key
```

Get a free key at [console.groq.com](https://console.groq.com) (no card required).

```bash
npm run dev
```

Visit `http://localhost:3000`.

Run tests:

```bash
npm run test
```

## Architecture

Built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

- `app/` — one route per screen (Dashboard, Transactions, Transaction Detail, Add Transaction, Budgets, Reports, Settings, Health check), plus `app/error.tsx` (global error boundary) and `app/not-found.tsx` (custom 404).
- `app/api/categorize/` and `app/api/insights/` — server-side API routes that call the Groq LLM API. Kept server-side so the API key never reaches the browser.
- `lib/transactions.ts`, `lib/budgets.ts` — the data layer. All data is stored in the browser's `localStorage` (no backend database) and seeded with demo data on first load.
- `lib/types.ts` — shared TypeScript types (`Transaction`, `Budget`).

Pages that need `localStorage` (Dashboard, Transactions, Budgets, Settings, Add Transaction) are Client Components (`"use client"`). Everything else is a Server Component by default.

## AI Integration

Two features, powered by the **Groq API** (Llama-family model `openai/gpt-oss-120b`):

1. **AI Suggest category** (Add Transaction form) — sends the transaction description to `/api/categorize`, which prompts the model to pick one of the app's fixed categories. Falls back to "Other" if the model returns something unexpected.
2. **AI Spending Insights** (Dashboard) — sends the user's transaction list to `/api/insights`, which prompts the model to write a short, plain-English summary of spending patterns and one practical suggestion.

**Why Groq instead of the Claude API named in the brief:** the brief explicitly allows "Claude API... or another LLM you prefer." The Anthropic console requires paid billing credits to make API calls; Groq offers a genuinely free tier with no card required, which made it the practical choice for a student project with no budget. The prompt design and error-handling approach would be identical if swapped back to Claude — only the API call itself would change.

Both routes have explicit loading, error, and fallback states — if the AI call fails (bad key, rate limit, model unavailable), the UI shows a clear message instead of crashing.

## Known Limitations & Future Improvements

- **Data storage:** all data lives in the browser's `localStorage` — it's not synced across devices and is lost if the browser's site data is cleared. A real backend (Postgres via Supabase/Neon + Prisma) would be the natural next step.
- **No authentication:** the app is single-user, no login system.
- **No editing of existing transactions** — only add/delete are supported; edit would be a small addition on top of the existing Add Transaction form.
- **No automated component/integration tests beyond the data layer** — current tests cover `lib/transactions.ts`; UI component tests would be the next testing priority.
- **Dark mode was intentionally removed** — an earlier version had a `prefers-color-scheme: dark` block that shipped with the wrong text/background contrast, causing 14 WCAG AA failures. Rather than re-tune every color for two themes under time pressure, dark mode was removed entirely; light-mode-only was a deliberate scope decision.

## Testing

Unit tests (Vitest + Testing Library) cover the transaction storage layer: seeding, add, delete, and not-found lookup. Run with `npm run test`.

## Performance & Accessibility

- **Lighthouse (mobile, PageSpeed Insights):** Performance 96, Accessibility 100, Best Practices 100, SEO 100.
- **axe DevTools manual scans** across Dashboard, Transactions, Add Transaction, and Budgets: 0 issues after fixes.
- **Concrete fix from audit findings:** axe flagged 14 serious color-contrast failures, all traced to one root cause — a dark-mode CSS block that changed the background to near-black without adjusting any text colors. Fixed by removing dark mode support and darkening the income/green token from `#16a34a` to `#15803d` for adequate contrast on white.

## Deployment

Hosted on **Vercel**, connected to the `main` branch of the GitHub repo. Every push triggers an automatic build and preview deployment. Environment variables (`GROQ_API_KEY`) are set in Vercel's dashboard under Project Settings → Environment Variables, not committed to the repo.

**Rollback plan:** if a deploy breaks production, redeploy the last known-good commit from the Vercel dashboard (Deployments tab → select a previous successful deployment → "Redeploy"), or `git revert` the breaking commit and push.

## Reflection

**Hardest part:** getting the AI integration working reliably. The original plan used the Claude API, but the Anthropic console required paid credits I didn't want to spend on a student project, so I switched to Groq — a free alternative. Even after switching, the first two model names I tried (`llama-3.1-8b-instant`, `llama-3.3-70b-versatile`) returned "model not found" for my account; I had to check Groq's playground directly to find a model my key actually had access to (`openai/gpt-oss-120b`). It was a good lesson that documentation and even common model names aren't always available to every account — checking the actual API response and the provider's own playground was more reliable than searching for the "correct" model name.

**What I'd do differently:** I'd check API access and billing requirements before writing any integration code, not after. I built both Claude API routes fully, then had to redo them for Groq. Verifying access first would have saved real time.

**Something that surprised me:** how much of my accessibility problems (14 flagged issues) traced back to a single root cause — an unfinished dark-mode color scheme — rather than 14 separate mistakes. It reframed how I think about accessibility bugs: check for one systemic cause before fixing issues one by one.