# Plan: Pass upgrade, ATS checker rankings, redundancy guide

Date: 1 October 2026 · Status: for approval · Branch: `feature/job-search-pass`

## Recommended order

1. **Pass upgrade (£17)**: about 1 day of build. It needs one real payment check in Dodo, which takes calendar time, so start it first and build item 2 while waiting.
2. **ATS checker**: 2–3 days. This is the biggest traffic opportunity (1K–10K UK searches a month; we sit around position 46).
3. **Redundancy guide upgrade**: about 1.5 days. 100–1K searches a month, and it links naturally with the redundancy calculator, our most-seen page.

Every item ends with: review of the diff, all tests, a local browser run (desktop + 375px), then deploy only on your go-ahead.

---

## 1. "Upgrade to the Job Search Pass for £17"

**Who:** someone who bought a single CV (£7.99) in the last **14 days** and has no active Pass. They pay **£17.00** (£24.99 − £7.99), which matches the "your £7.99 counts" promise exactly.

**Expected impact (honest):** at 1–2 single-CV sales a week, even a 20–30% upgrade rate is roughly £15–£35 a month. It's small, but it's the cheapest revenue lever and it lifts average order value. The bigger gain comes once items 2–3 bring more buyers.

### How it charges £17 (recommended: one-off discount on the existing Pass)
- When an eligible buyer clicks upgrade, our server creates a **single-use Dodo discount**:
  - flat £7.99;
  - restricted to the Pass product;
  - usage limit 1;
  - expires in 2 hours.
- The server then opens the normal Pass checkout with that code applied (Dodo's `discount_codes` field).
- **Why this route:** the order is still the Pass product, so unlock rules, webhook, refunds, emails and growth reports keep working unchanged. The order just records £17.00.
- **Fallback if the discount route misbehaves:** a separate £17 "Pass upgrade" product in Dodo, treated as a Pass in code. That needs changes to unlock SQL, the webhook, reporting and email, so it's only plan B.
- **Must verify first:** that Dodo's flat discount `amount` is in pence (799) and is honoured with our checkout settings. Check it in Dodo test mode if you have test keys; otherwise with one real £17 purchase by you, refunded afterwards.

### Rules (server is the single source of truth)
- **Pure function** `upgradeEligibility(orders, now)` returns `{ eligible, creditMinor, priceMinor, endsAt }`.
  - **Eligible when:** there's a non-refunded single-CV order paid within 14 days and no active Pass.
  - **Credit:** what that order actually paid, capped at £7.99.
- **Matching SQL:** in `lib/cv-entitlement.ts`.
- **Status API:** `/api/payments/status` adds `upgrade: { eligible, price, endsAt }`.
- **Checkout API:** `/api/checkout/dodo` with plan `pass`. If the buyer is eligible, it creates the discount and adds `metadata.upgrade_from_order`. If discount creation fails, it returns an error rather than silently charging £24.99.
- **Edge cases:**
  - **Already bought a Pass:** they're not eligible.
  - **Original £7.99 refunded later:** the Pass stays, because it was paid for separately; this is noted in the refund policy.
  - **Repeat clicks:** each click gets its own short-lived single-use code; unused ones expire.

### Where the offer appears
1. **Right after a single-CV payment is confirmed in the editor:**
   - Heading: "Applying for more jobs? Upgrade to the Job Search Pass for £17. Your £7.99 counts."
   - Below it: a line showing the offer end date.
2. **When duplicating a CV for another job:** the checkout sheet shows the Pass at **£17 (was £24.99)** while the buyer is eligible.
3. **Purchase confirmation email:** one line with the deadline, linking back to the editor.
4. **Pricing page and refund policy:** a short explanation of the upgrade credit.

**Tracking:** editor events `upgrade_offer_shown` and `upgrade_offer_clicked`, plus orders carrying `upgrade_from_order`.

**Tests:**
- eligibility (window edges, refunds, active Pass);
- price maths;
- checkout builds the right Dodo body (mocked);
- UI states in the browser.

**Effort:** about 1 day, plus the payment check.

---

## 2. ATS checker: match what searchers want

**Problem:** the pages ranking for "ats cv checker" (LiveCareer, CVBeat, NeuraCV, Owl Apply, My CV Check, JobSpace) let you **upload a CV and get a score straight away**, usually without a job advert. Ours needs pasted CV text **and** a pasted job advert, so it doesn't match the main search intent. That's likely why we sit around position 46.

### Phase A: tool changes (~1.5 days)
1. **Upload PDF or Word.**
   - Read the text in the browser using our existing PDF/DOCX extractor (moved out of `document-readability-checker.tsx` into a shared helper).
   - Fill the CV box, which stays editable.
   - The file itself is never uploaded.
2. **Job advert optional.** With no advert, run a free **CV readability check** in the browser (no AI cost):
   - text can be extracted;
   - length is around 2 pages;
   - standard UK headings are present (Profile, Experience, Education, Skills);
   - contact details are present;
   - dates are consistent;
   - bullet use;
   - signs of columns or tables in PDFs.
   - The result is labelled honestly as a readability score, not a guarantee of passing any employer's system.
3. **With an advert:** the current evidence-led match score runs as today.

### Phase B: page changes (~1 day)
- **Title:** "Free ATS CV Checker UK – Upload Your CV for an Instant Score".
- **Meta description:** mention PDF/Word upload, no signup and UK conventions.
- **Schema name:** "WorkCV ATS CV Checker" (currently "AI CV Fit Checker", which doesn't match).
- **New sections:**
  - "What an ATS checks in a UK CV" (reading the file, headings, keywords, file type);
  - "Is my CV ATS-friendly?" (a checklist);
  - "What's a good ATS score?" (honest: there's no universal score).
  - Every factual claim is sourced.
- **FAQ:** add "Can I upload a PDF or Word CV?", "Is it free?" and "Do I need a job description?".
- **Internal links:**
  - use the anchor text "ATS CV checker" site-wide;
  - add prominent links from the ATS CV template page (727 impressions) and the How to write a CV page (714), plus the templates and examples hubs.

**Tracking:** `tool_started` / `tool_completed` with mode `upload`, `readability` or `match`.

**Success measure:** weekly position for "ats cv checker" in Search Console. The aim is page 1–2 within 6–8 weeks of indexing. Without more backlinks that isn't guaranteed.

---

## 3. "Made redundant? What to do next": upgrade the existing page

We already have `/situations/made-redundant` ("Made Redundant UK: What to Do Next"), but it barely appears in search. A second page on the same topic would compete with it, so the plan is to **upgrade this page and keep its URL**.

**What ranks now:** Citizens Advice, MoneySavingExpert's step-by-step plan, Reed career advice, nidirect, and HR blogs with checklists. They're strong on rights or money, but few link rights, money and the job search in one practical timeline with working calculators.

### New structure
- **A timeline checklist**, with checkboxes saved in the visitor's browser:
  - **Today:** get the decision and calculation in writing; check the consultation details.
  - **This week:** check redundancy pay, notice and holiday pay; tax (the first £30,000 is usually tax-free); pension.
  - **Before your last day:** final payslip items, a reference, and time off to look for work.
  - **First 30 days:** Universal Credit or New Style JSA if needed; budget with the take-home pay calculator.
  - **Days 30–90:** job search routine: CV, the tracker, tailoring.
- **Working tools in line:** redundancy pay, notice period and take-home pay calculators, the job tracker, CV examples, and the Pass offer (redundancy version).
- **Sources:** every money or rights claim is checked against GOV.UK, Acas, MoneyHelper or Citizens Advice, with a "checked on" date. Nothing unverified.
- **Search targeting:**
  - title "Made Redundant? What to Do Next (UK Checklist)";
  - an FAQ covering "what to do when made redundant", "can I get Universal Credit after redundancy" and "is redundancy pay taxed".
- **A strong link from the redundancy calculator** (our page with the most impressions) to this guide.

**Effort:** about 1.5 days.

---

## Decisions needed
1. **Order:** upgrade → ATS → redundancy (recommended)?
2. **Upgrade window:** 14 days after the single-CV purchase (recommended), or another length?
3. **Payment check:** do you have Dodo **test-mode** keys? If not, are you OK doing one real £17 Pass upgrade purchase yourself and refunding it?
4. **ATS:** include the no-advert readability check in this round (recommended), or upload only?
5. **Redundancy:** upgrade the existing page and keep its URL (recommended)?
