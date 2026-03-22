# 📘 Project Best Practices

## 1. Project Purpose
Afrensics E-System Defence & Intelligence Security (AEDI Security) is a Vite + React + TypeScript single-page application providing cybersecurity services and content. Core capabilities include a breach checking tool (with M-Pesa payment flow and multiple API fallbacks), multi-language marketing pages, a blog, SEO integration, and extensive client- and server-side security hardening.

## 2. Project Structure
- Root
  - index.html: SPA entry HTML
  - package.json: scripts and dependencies
  - vite.config.ts: dev server (port 8080), React SWC plugin, path alias "@" → ./src, optional dev-only component tagger, Rollup JSON plugin, proxy for "/api" → http://localhost:8081
  - tsconfig.json, tsconfig.app.json, tsconfig.node.json: TS options and path alias
  - eslint.config.js: TS/React lint rules
  - tailwind.config.ts, postcss.config.js: styling configuration
  - public/: static assets (.htaccess, robots.txt, sitemap.xml, error.html)
  - nginx-security.conf, .htaccess-fixed, simple-.htaccess: server security templates/guides
  - breach-check-proxy.php, test-hibp-api.php, mpesa-payment-api.php: server-side helpers/proxies
  - Documentation: SECURITY_IMPLEMENTATION.md, FREE-* guides, MPESA-INTEGRATION-GUIDE.md, SEO_SETUP.md, DEPLOYMENT-INSTRUCTIONS.md, FINAL-DEPLOY-INSTRUCTIONS.md, EMAILJS_SETUP.md
- src/
  - main.tsx: React bootstrap
  - App.tsx: Router and global providers (TanStack Query, Tooltip/Toaster, SEO helpers, chat, popup)
  - pages/: Route-level screens (Index, Services, About, Blog, BlogPost, CheckBreach, CheckBreachWithPayment, Contact, NotFound)
  - components/: Feature and layout components (PaymentModal, Navigation, Footer, TawkChat, Analytics, SEO, UI kit under components/ui)
  - services/: API/service layer (freeBreachAPI, breachCheckService, mpesaService, cybersecurityAPI)
  - hooks/: Custom hooks (usePenetrationTestingPopup, use-mobile, use-toast)
  - utils/: Helpers (security.ts, slugify.ts, lib/utils.ts)
  - config/: emailjs.ts, seo.ts
  - i18n.ts and locales/: i18next with en, fr, sw, es, de
  - assets/: imagery and logos
  - data/: content data (blog-posts/*.md used by Blog/BlogPost pages)

Notes
- Routing uses BrowserRouter. Ensure server fallback to index.html (see nginx-security.conf and .htaccess) when deploying.
- Path alias "@" maps to src; import using "@/…" to avoid brittle relative paths.
- Vite dev proxy maps "/api" to http://localhost:8081. During local dev, backend helpers (e.g., mpesa callback) must be available there. Some client code also calls http://localhost:8081 directly (e.g., breach-check-proxy.php), so run a local PHP server on port 8081 or adjust endpoints consistently.

## 3. Test Strategy
Current state
- No tests or testing frameworks are present in the repository.

Recommendations
- Unit testing: Vitest + React Testing Library for components and hooks.
- Integration testing: Cover payment flows (PaymentModal + mpesaService), breach API flow (freeBreachAPI) with mocked fetch.
- Mocking: Use MSW (Mock Service Worker) for network calls; stub secureStorage/localStorage via test utilities.
- Structure: Mirror src/ with __tests__/ or colocate *.test.ts(x) alongside modules.
- Coverage: Target ≥80% lines on services/utils and critical UI; exclude generated UI boilerplate from strict thresholds.
- CI: Add a simple workflow to run lint and tests on pushes/PRs.
- Config: Add vitest.config.ts with jsdom environment; extend ESLint for test files if needed.

## 4. Code Style
Language and typing
- Use TypeScript for all new code. Prefer explicit interfaces/types for API results and component props.
- Adopt Vite env access (import.meta.env.VITE_*) instead of process.env.* in client code. Migrate any remaining process.env usages (e.g., breachCheckService) to import.meta.env.

Components and hooks
- Functional components only; prefer small, composable components.
- Use custom hooks (src/hooks) for reusable state/effects and to encapsulate timers/intervals (e.g., usePenetrationTestingPopup).
- Keep page components (src/pages) for composition and routing; keep them thin and delegate logic to services/hooks.

Naming conventions
- Files: PascalCase for components/pages, camelCase for utilities, kebab-case for assets.
- Variables/functions: camelCase; types/interfaces: PascalCase; constants: UPPER_SNAKE_CASE.

Styling
- Tailwind CSS for layout and utility classes; shadcn-ui components in components/ui.
- Favor semantic class patterns and avoid inline styles; keep design tokens in Tailwind theme where possible.

Documentation and comments
- Document service methods, data contracts, and non-trivial hooks.
- Keep comments concise; prefer naming and type clarity over excessive comments.

Error and exception handling
- Wrap network calls in try/catch; surface actionable messages to users (e.g., via toasts) and log details to console in development.
- Provide graceful fallbacks (pattern used in services like breachCheckService and freeBreachAPI/cybersecurityAPI).
- Centralize retry/rate-limiting logic in the service layer; avoid duplicating in UI.

Security and privacy
- Do not store emails or PII; the breach tool tracks only anonymous counts via localStorage/secureStorage as per copy. Follow SECURITY_IMPLEMENTATION.md.
- Use utils/security for sanitization, validation, rate limiting, and secureStorage; prefer secureStorage over raw localStorage for new features.
- Respect HIBP rate limits (≥1.5s between calls) and use server-side proxy where possible to avoid CORS and protect secrets.
- Legacy note: some modules (e.g., mpesaService, freeBreachAPI) use localStorage directly for simulation/state. Treat as demo-only; do not persist PII in production builds. If retention is required, wrap with secureStorage and apply TTL/pseudonymization.

## 5. Common Patterns
Services layer
- API classes with a singleton export (e.g., export const freeBreachAPI = new FreeBreachAPI()).
- Layered fallbacks for external dependencies (freeBreachAPI tries server proxy → direct API → CORS proxies → alternative providers → local simulation).
- Rate limiting and backoff baked into services (breachCheckService.enforceRateLimit with 1.5s spacing).
- Use Vite proxy for "/api" paths during dev; keep server endpoints aligned with client expectations (e.g., mpesa callback at /api/mpesa/callback).

Security utilities
- utils/security.ts includes sanitizeHtml, removeScriptTags, sanitizeSqlInput, email/phone/url validation, CSP helpers, RateLimiter, secureStorage, and securityLogger.
- Use these utilities for any user input processing and storage.

SEO and i18n
- SEO component mutates head tags programmatically; centralized config in config/seo.ts. Use <SEO /> in pages to set meta, OG, and Twitter tags.
- i18n via i18next with JSON locale files (en, fr, sw, es, de). Add keys to all supported locales and default to English.

UI kit and composition
- shadcn-ui + Radix primitives under components/ui; share base patterns (Button, Card, Dialog, etc.).
- Keep feature components in components/ and assemble in pages/.

Content and blog
- Markdown posts under src/data/blog-posts drive Blog/BlogPost pages. Use utils/slugify.ts for URL-safe slugs.

Payments and phone handling
- PaymentModal orchestrates the flow with mpesaService and simulates server endpoints; phone numbers normalized to 2547/2541 patterns.
- mpesaService encapsulates STK Push simulation, status checks, and basic notification recording (demo). Ensure production implementations move sensitive operations server-side.

Routing and data fetching
- BrowserRouter with page components under pages/.
- QueryClientProvider included; for new async data, prefer TanStack Query for caching, retries, and loading states.

Dev-only helpers
- lovable-tagger plugin is enabled only in development via vite.config.ts. Do not rely on tags in production logic.

## 6. Do's and Don'ts
Do
- Use path alias imports (e.g., import X from "@/services/…").
- Centralize external API calls in services/ and handle rate limiting and fallbacks there.
- Use import.meta.env.VITE_* for client configuration and never expose secrets in the repo; migrate any remaining process.env usages.
- Validate and sanitize all user inputs via utils/security before use.
- Use SEO and i18n consistently on new pages.
- Keep pages thin; move logic to hooks/services.
- Prefer TanStack Query for new API data fetching and caching.
- Keep CSP/security headers updated when introducing new external resources; update nginx/Apache configs accordingly.
- Align dev server proxy (/api) and client/service endpoints; run local server on port 8081 for PHP helpers during development when needed.

Don't
- Don’t store PII (emails, phone numbers) beyond transient processing paths; avoid persisting such data client-side.
- Don’t call external breach APIs without respecting rate limits or via client-only in production; use the server proxy instead.
- Don’t access process.env in client code; use import.meta.env and VITE_ prefix (update breachCheckService accordingly).
- Don’t bypass the services layer by fetching directly in components for cross-cutting concerns.
- Don’t write directly to localStorage for new features; use secureStorage wrapper.
- Don’t break Router fallback; ensure server serves index.html for unknown routes.

## 7. Tools & Dependencies
Key libraries
- React 18 + TypeScript, Vite 5 (Node 18+ recommended), @vitejs/plugin-react-swc
- Tailwind CSS + shadcn-ui (Radix UI), lucide-react icons
- React Router 6, @tanstack/react-query
- i18next/react-i18next
- emailjs-com (for contact messaging), recharts, embla-carousel-react

Build/dev configuration
- Vite dev server on port 8080; alias @ → src; host "::" for IPv6; proxy "/api" to http://localhost:8081.
- Dev-only: lovable-tagger componentTagger, Rollup JSON plugin.
- ESLint with TS/React rules (see eslint.config.js). Consider adding Prettier for formatting.

Env vars
- Use VITE_* (e.g., VITE_EMAILJS_PUBLIC_KEY, VITE_HIBP_API_KEY). Replace any process.env.* (e.g., REACT_APP_HIBP_API_KEY) with import.meta.env.VITE_*.

Setup
- Install: npm i
- Dev: npm run dev (http://localhost:8080)
- Build: npm run build → dist/
- Preview: npm run preview

Server-side
- Use breach-check-proxy.php to avoid CORS and keep API keys server-side.
- Follow SECURITY_IMPLEMENTATION.md and nginx-security.conf for headers and SPA fallback.
- See MPESA-INTEGRATION-GUIDE.md for implementing real M-Pesa flows server-side.

## 8. Other Notes
- When generating new code, conform to the existing folder structure and naming conventions.
- Keep SEO and translations updated when adding pages/features.
- If introducing new external connections (connect-src), update CSP in server configs and public/.htaccess. External domains currently referenced include HIBP, BreachDirectory, Intelligence X, and various CORS proxies used by freeBreachAPI.
- For the breach checker, maintain the privacy guarantee: no email storage; show anonymous usage counts only.
- Prefer Zod (already a dependency) for schema validation of API payloads and forms.
- Replace console logs with a structured logger for production readiness if observability needs grow.
- Ensure 1.5s+ spacing between HIBP calls; batch or queue on multi-email checks.
- For deployments, ensure server rewrites to index.html for client-side routing and enable strict security headers as documented.
- Local dev alignment: some code directly references http://localhost:8081 (e.g., breach-check-proxy.php) instead of "/api". Either run a local PHP server on 8081 or standardize clients to "/api" and configure Vite proxy accordingly.
