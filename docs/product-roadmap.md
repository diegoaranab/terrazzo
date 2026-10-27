# Terrazzo Product Roadmap

_Last updated: 2026-10-27_

## Current execution status

- ✅ PR #22 — Angular 22 storefront migration merged on 2026-10-27.
- ✅ Main merge commit: `ba5e834ff568d5be9daff95faf47d6ebeaebd601`.
- ✅ Validate Storefront workflow passed on `main`.
- ✅ Angular GitHub Pages build + deployment passed after switching Pages Source to GitHub Actions.
- ✅ GitHub Pages deployment reported success for `https://diegoaranab.github.io/terrazzo/`.
- ✅ PR #23 — Content and performance refresh merged on 2026-10-27.
- ✅ Main merge commit: `c2f4ee9bd333292f6b60ed648c3e048d26609fe1`.
- ✅ Sharp tooling upgraded to stable 0.35.5; media budgets enforced in CI.
- ✅ Validate Storefront and GitHub Pages deployment passed on the PR #23 merge commit.
- ✅ PR #24 — Brand, UI/UX and media polish merged on 2026-10-27.
- ✅ Main merge commit: `2b68a5252b700f98f2d2de9f09d08d0685917c9d`.
- ✅ Final PR #24 CI and GitHub Pages deployment passed on `main`.
- ✅ PR #25 — Final demo hardening merged on 2026-10-27.
- ✅ Main merge commit: `28243b88283ee224d4303dbf618c998c73c2beff`.
- ✅ Gallery GLightbox reduced-motion/mobile lifecycle bug fixed; final CI and GitHub Pages deployment passed.
- ➡️ Next: live manual recheck of the gallery fix, then final recording QA, owner content confirmation, and menu-media decision.


## Purpose

Terrazzo is the first client and validation environment for a future SaaS platform aimed at independent and small-to-medium restaurants in Mexico. The product should evolve from a branded digital storefront into a practical sales and operations layer that gives restaurant owners control over their content, orders, payments, analytics, integrations, and eventually AI-assisted business insights.

The goal is **not** to build a replacement POS. The goal is to integrate with the restaurant's existing operational stack when possible and add the customer-facing, management, automation, and intelligence layers around it.

## Current baseline

Repository: `diegoaranab/terrazzo`

Current production baseline before reactivation:
- Static GitHub Pages storefront.
- HTML + CSS + vanilla JavaScript.
- Bootstrap 5, Flickity and GLightbox.
- JSON-backed menu, events and gallery.
- 33 menu products with category filters.
- LocalStorage cart with quantity controls and totals.
- WhatsApp checkout with generated order code and itemized message.
- Events / sports feed and gallery.
- Image optimization script using Sharp.
- JSON content validation and GitHub Actions validation.
- Payment architecture and provider research already documented.
- No backend, authentication, Admin, online payments or POS integration yet.

The reactivation baseline was commit `9a5dd6ee56bf2c0a01e5eba4a7716bcca6cbb2cc`. A documentation-only roadmap commit may follow it before PR #22.

## Product principles

1. **Validate in increments.** Do not build the full SaaS before the Terrazzo owner validates the direction.
2. **Restaurant-owned content.** Menu, prices, availability, events, gallery, hours and business information must ultimately be manageable from an Admin UI.
3. **Do not replace the POS.** Integrate through provider-specific adapters when APIs and permissions exist.
4. **No hard dependency on a POS.** The product must still work when a restaurant has no supported integration.
5. **Payments are backend-trusted.** Never trust browser totals or expose provider secrets in the frontend.
6. **AI starts read-only.** AI may interpret authorized operational data through controlled backend tools; it must not directly mutate business data in the first release.
7. **Human approval for generated content.** AI-created event copy, promotions or social imports should be reviewed before publishing.
8. **Use official integrations.** Prefer Meta / POS / payment provider APIs over scraping as a product dependency.
9. **Real media first.** Prefer real Terrazzo photography. Use generated imagery only where appropriate and make it visually credible rather than artificial food-ad photography.
10. **Performance is a feature.** Media uploads should be optimized automatically and delivered responsively.
11. **Design for multi-tenancy later, not prematurely.** Terrazzo remains the proving ground; the reusable SaaS core should eventually live in a private codebase.
12. **Keep recurring costs measurable.** AWS, media, OpenAI usage, support and integrations must be attributable per restaurant before finalizing commercial plans.

---

# Reactivation Track — Demo-ready storefront

## PR #22 — Angular 22 storefront migration ✅ MERGED

**Goal:** migrate the existing storefront from static vanilla JavaScript to the latest stable Angular 22.x while preserving visible content and functional behavior.

This is a parity migration, not a redesign.

Required parity:
- Hero and CTA behavior.
- Promotion ticker.
- Menu category filtering.
- All current menu data.
- Cart add/remove/update behavior.
- LocalStorage persistence.
- Totals and order-code generation.
- WhatsApp checkout.
- Events feed.
- Gallery carousel/lightbox.
- Desktop/mobile responsive behavior.
- Contact and map.
- GitHub Pages deployment.
- Existing content validation and image optimizer.

Technical direction:
- Modern standalone Angular architecture.
- Typed models for menu items, events and gallery items.
- Feature-oriented components and services.
- Cart state isolated behind a service.
- Data loading isolated behind services.
- No backend or authentication.
- No Angular Material or unrelated design-system migration.
- Keep Bootstrap/Flickity/GLightbox temporarily if that is the safest path to parity.
- Preserve GitHub Pages subpath requirements.
- Update Node/CI to a version supported by Angular 22.
- Add build and focused unit-test validation to CI.

**Non-goals:** Admin, backend, payments, OpenAI, POS integration, content refresh, visual redesign, image replacement.

## PR #23 — Content and performance refresh ✅ MERGED

Implementation complete: [media measurements and validation](media-performance.md), [owner content verification](content-verification.md). Contact data remains unchanged until owner confirmation.

After Angular parity is merged:
- Remove or demote expired event content such as World Cup 2026.
- Verify current address, hours, phone, promotions and brand wording with reliable/current sources or owner confirmation.
- Optimize the approximately 30 MB hero video or replace its loading strategy.
- Convert legacy menu PNG assets to optimized modern formats where appropriate.
- Add responsive images / lazy loading.
- Review bundle and initial network payload.
- Preserve storefront behavior.

## PR #24 — Brand, UI/UX and media polish ✅ MERGED

Implementation and validation: [brand/UI polish review](brand-ui-polish.md); future product media: [menu image refresh plan](menu-image-refresh-plan.md).

- Rebalance the visual identity toward the real venue: dark/charcoal foundation, real photography and neon accents rather than large synthetic cosmic surfaces.
- Preserve the recognizable Terrazzo cosmic/urban identity.
- Audit menu imagery using three outcomes: keep / replace with real photo / regenerate.
- Prioritize real restaurant photography.
- Improve spacing, hierarchy, responsive behavior and accessibility without redesigning the product into a generic restaurant template.
- Re-test desktop and mobile flows.

## Demo readiness

After PRs #22–#24:
- Run full QA from clean `main`.
- Validate the deployed GitHub Pages version on desktop and mobile.
- Record a desktop walkthrough.
- Record a shorter mobile walkthrough.
- Present business value first; defer deep implementation discussion until the owner shows interest.
- Capture owner feedback about workflow, pain points and current tools.

---

# Commercial V1 — after owner validation

## Admin / CMS foundation

Capabilities:
- Menu categories and products.
- Prices.
- Product availability / sold-out state.
- Promotions.
- Events with publish/start/end dates and automatic expiration.
- Gallery/media.
- Business information and hours.
- Role-based access.

Likely platform direction:
- Angular Admin.
- TypeScript/Node backend.
- AWS managed/serverless services.
- Authentication through an appropriate managed identity service.
- Media in object storage + CDN.
- Infrastructure as code.

Exact database technology should be chosen from domain/query requirements, not preference.

## Media pipeline

Admin upload flow should automatically:
- Validate file type and limits.
- Store original safely.
- Generate responsive derivatives.
- Prefer WebP/AVIF where supported.
- Produce thumbnails.
- Serve assets through CDN.
- Avoid requiring owners to understand image optimization.

Video should remain optional and configurable.

---

# Orders and payments

## Order service

Move order authority from LocalStorage/WhatsApp to backend-managed orders.

Suggested lifecycle:
`draft -> submitted -> confirmed -> preparing -> ready -> delivered/cancelled`

WhatsApp may remain an optional notification / communication channel rather than the system of record.

## Mercado Pago

Implement only after the order backend exists:
- Server-side price validation.
- Payment preference/order creation.
- Test and production credentials separated.
- Webhook signature/authenticity validation.
- Idempotent payment processing.
- Payment/order state reconciliation.
- Refund/cancellation policy as required.

---

# POS integration layer

Use an adapter boundary rather than coupling the product directly to one provider.

Conceptual interface:
- Read products/prices/availability when allowed.
- Read sales/orders/payments when allowed.
- Push external orders when the provider supports it and the restaurant has the required plan/permissions.
- Normalize provider data into internal domain models.

Potential providers to investigate per client include Fudo, Soft Restaurant / National Soft and others used by the target market.

A restaurant without an API-capable POS must still be able to use the SaaS.

Owner discovery questions:
- What POS does the restaurant use today?
- Which plan/version?
- Who changes prices and products?
- How are WhatsApp/delivery orders entered into the POS?
- How is inventory handled?
- Which reports does the owner actually use?
- Where does duplicated manual work happen?

---

# Analytics

Combine digital funnel data with operational sales data when integrations permit.

Potential metrics:
- Storefront sessions.
- Menu/product views.
- Add-to-cart rate.
- Checkout initiation.
- Paid conversion.
- Average online ticket.
- Product/category performance.
- Promotion/event performance.
- Orders by channel.
- Abandoned carts.
- Repeat customers where consent and identity allow.
- POS-vs-digital comparisons.

Analytics should answer business questions, not just display decorative charts.

---

# AI Business Copilot — future phase

Start as a read-only assistant inside Admin.

Example questions:
- Which products sold best this month?
- Which days are weakest?
- Compare this month with last month.
- Which promotions appear to improve sales?
- Which products are added to cart but frequently abandoned?
- Summarize unusual changes in ticket size or order volume.

Architecture:
- OpenAI API called only from backend.
- Never expose API keys in Angular.
- The model receives controlled tool/function outputs rather than unrestricted database access.
- Enforce tenant, role and date-range authorization before tools execute.
- Log tool access and usage.
- Add per-tenant usage/cost limits.
- Route tasks to models based on complexity and current price/capability at implementation time rather than hard-coding a permanent model choice.
- Read-only first; any future write actions require explicit confirmation, narrow permissions and auditability.

Possible later use:
- Suggest event/promotion copy.
- Transform an authorized social post into a draft event.
- Explain KPIs in plain Spanish.
- Detect operational anomalies.
- Suggest questions the owner may want to investigate.

---

# Social / content integrations

For connected professional accounts, prefer official Meta APIs and authorized flows.

Possible workflow:
`Connected Instagram/Facebook -> import owned post -> extract media/caption/date -> create draft event/promotion -> owner reviews -> publish`

Do not make scraping third-party social pages a required production dependency.

---

# SaaS productization

Once Terrazzo validates the product:
- Move reusable SaaS core into a private repository.
- Implement tenant isolation.
- Per-tenant branding and domains.
- Subscription and entitlement system.
- Usage/cost metering.
- Plan-based feature flags.
- Onboarding flow.
- Support/admin tooling.
- Backups, observability and incident procedures.
- Security/privacy documentation.

The current public MIT Terrazzo repository should be treated as client/demo history, not the permanent proprietary SaaS core.

---

# Commercial hypothesis

Preferred direction:
- Low-friction implementation/setup fee.
- Recurring monthly subscription.
- Founding-client treatment for Terrazzo.
- Modules/tiers should map to concrete value rather than arbitrary feature counts.
- Avoid locking final pricing until COGS and owner interviews are known.

Cost model should include:
- Hosting/backend.
- CDN/media storage and processing.
- OpenAI API usage.
- Email/SMS/WhatsApp or other communication costs if used.
- Monitoring/logging.
- Domain.
- Support time.
- Payment/POS integration maintenance.

---

# Immediate next action

Recheck the deployed gallery lightbox on the latest `main`, specifically repeated next/previous navigation and close behavior on desktop and responsive/mobile. If clean, complete final recording QA on at least one real mobile device. Confirm owner content items before final recording/launch and decide whether menu imagery needs an additional pre-demo refresh. Admin, backend, payments, POS and AI remain later phases.
