# NOTES-INTERNAL (not published)

This file is excluded from the site (`_config.yml`) and from `scripts/publish.sh`. It holds what used to sit as comments in the
published HTML, which leaked process (operator quotes, record ids, internal paths).

## The headline as of 2026-10-01 (operator's definition)

- h1 wording is fixed: "Build +X% more on your weekly limit, Y× cheaper, with the same code quality." Only X and Y change.
- Y = 10: best measured antiloki cell against raw Claude **Opus**, same task (eight modules, 37 checks), same checks.
  Opus $1.151/run (merge_scores id 6, n=2, quality 1.0, 278 s) vs Composer x Composer with QA $0.1017/run (id 2480, n=3, 0.973, 95 s) = 11.3x, rounded DOWN to 10.
  Also shown: Composer alone $0.0671 (id 2572) = 17.2x; Sonnet plans + Composer writes + Sonnet QA $0.1554 (id 1646, n=5) = 7.4x.
  Opus is not stable day to day (ladder run 2026-09-22: $0.61) -> pipeline about 6.0x -> honest range 6x-11x.
  Sonnet reference: raw Sonnet $0.3297 (id 34, n=1) -> 3.2x with QA, 2.1x with a Sonnet planner.
- X = +112: the paired task result 0.3297 / 0.1554 = 2.12x. The older derivation 1/(1-0.528) "stable across cuts" could not be reproduced by the audit and is gone from the page.
- The seven-cell cheapest-Claude analysis (3x, geometric mean 5.7x before QA, 3.2x estimated with QA) and the withdrawn 6.7x live on in paper.html section 11.4 as context.

## Decisions of the 2026-10-01 pass

- The two print sections (Cowork/agents, X-ray) and the hero "stage" (two 3D prints, 10-agents.jpg and 11-xray.jpg, which showed the withdrawn Kimi/Qwen agents) were removed together with the lightbox. No image is referenced by any page now; img/ is untouched (the operator decides about the files).
- Buy buttons were dead (CHECKOUT empty): plans are shown as "coming soon", the 7-day trial download is the only call to action.
- Lifetime "2 years of updates" is not enforced by license.rs (inside_window is true for a key with no expires_at): the page says only that update terms are set at checkout.
- Open policy question in the core: a lapsed yearly key stops working even on a build inside its window once the daily re-check stores "expired" (HANDOFF section 15 item 7).
- Support address: footer keeps support@antiloki.dev; CNAME is antiloki.com and the Tauri allowlist uses antiloki.dev. The operator should confirm which mailbox exists.
- Codex chat: the "each seat opens as a chat" claim is kept; Codex's real-account turn awaits the operator's window (memory: Oct 9), so verify before leaning on it.

## Comments removed from the published files (verbatim)

### index.html [html]
<!-- HERO — what it is, and the one reason -->


### index.html [html]
<!-- THE TWO NUMBERS, AND WHERE THEY COME FROM (operator 2026-09-26: "explicitly make the product about make their
         subscription cheaper and limits wider. So our measurement is a calculation how cheaper it gets using antiloki
         and how bigger gets the limit in comparation with raw"). RE-DERIVED 2026-10-01 (operator: "the benchmark is
         outdated … I believe we have better results today"), from a read-only copy of the merge record
         (merge_scores, audited by bench/merges/audit-record.py) — five subscription seats only, no Zen/Chinese arm.
         · CHEAPER is now 3x (2026-10-01, SECOND PASS after a fact-check; the first pass of the day said 10x and was
           withdrawn). Three things were wrong with 10x: (1) six of its seven cells compared a RAW single-seat session
           (planner 'raw', qa '') with a raw Claude session, the same kind of comparison the page withdrew for the old
           6.7x, and the page says every run ends in QA, which those winners do not carry; (2) the Claude reference was
           the one that made the ratio largest, not the cheapest Claude arm inside the tolerance (raw Haiku is cheaper
           than Sonnet and keeps >= 80% of the best quality in plain, edges, contract and fix; raw Sonnet 0.973 is
           inside it on the eight-module task, so Opus was not the fair reference); (3) the bootstrap interval treated
           the four S cells as independent. NOW: the reference of a cell is the cheapest raw Claude arm (Haiku, Sonnet
           or Opus) that keeps >= 80% of the cell's best measured quality, the winner is the router's own rule, and the
           cells are the seven of the record (merge_scores, references 983, 995, 992, 1001, 34, 1230, 193;
           winners 1010, 1022, 1016, 1028, 120, 1236, 2726). Ratios 7.6, 8.9, 15.3, 5.2, 2.7, 3.8, 3.6: geometric mean 5.7x, median 5.2x,
           leave-one-out 4.9x-6.5x, the three cells outside the synthetic S family 3.3x. NO CELL CARRIES THE QA STEP:
           S2 in the same record prices raw Composer at $0.0488 a run (id 2047) and Composer x Composer with its QA check
           at $0.086 (id 2408), 1.76x; the eight-module task shows 1.5x (id 2572 $0.0671 against id 2480 $0.1017).
           5.7 / 1.76 = 3.25, an ESTIMATE and not a measurement; on the one cell with a measured QA pipeline (the
           eight-module task) the pipeline is $0.1017 against raw Sonnet $0.330, 3.2x. 3 is that, rounded DOWN, and it
           sits under both the 5.7x without QA and the 3.3x of the non-synthetic cells. No interval is printed: the
           S cells are one family and a bootstrap over seven cells would be the independent-cell figure. The old
           6.7x stays withdrawn: raw Qwen against raw Sonnet, not an antiloki arm, and Qwen is a metered Chinese model
           that is off by default. The five-seat repeat of that cell is 3.6x and it is IN the seven. THE PAGE STAYS
           HONEST (bench-f below): four of the seven cells are one synthetic family where every arm scores ~1.0;
           weighted by what a bill would be the same six cells give 3.9x; Composer/Gemini/Codex dollars are estimated
           from reported tokens at list price; the Claude reference ran 2026-09-22..28 and cannot be re-run, the
           subscription having ended. "Up to 15.3x" would be true and is the weasel the sales rule forbids.
         · THE LIMIT STAYS +112%. The analyst tried to beat it and could not: share of tokens off the Claude seat gives
           +471% over the whole mixed record but +106%, +118% and +122% on the three cuts that leave out the bench's
           raw Gemini calls, the hands jobs and so on, and by dollars only +33..+45%. +112% (= 1/(1-0.528)) is the one
           figure stable across cuts; it is "on the mix measured on this machine", not a per-task pair. A better
           number would have been inflation, so the operator's "better percentage" is the cost one only.
         · "you already HAVE" rather than "already pay for": the clause after it is entirely about not adding cost,
           so ownership reads truer than expenditure there — and it does not exclude a free tier.
         · "everything stays on your machine" rather than "100% private": it says WHY it is private instead of
           asserting a percentage, and locality is the thing a developer actually checks.
         · "WITH THE SAME CODE QUALITY" — the operator's call (2026-09-26: "8 to 9 is the same almost, theres no much
           of a difference"). Measured meaning: inside the product's one tolerance. In six of seven cells the cheaper
           arm is at or above the raw Claude reference; in SWT-bench test-writing it is 8/10 against 9/10,
           which `merges::separated` calls NOT separated at n=10. "Indistinguishable at this sample" is not
           "identical", so the basis is on the page, not only here.
         · "CLAUDE GROK, GEMINI CODEX" — both names are promises the record now backs (operator 2026-09-27: "I want to
           take out the Chinese model for the name … Claude Grok. And Gemini Codex"). They were unmeasured on
           2026-09-27; since 2026-09-28 Gemini, Grok, Cursor and Codex have measured samples (paper second edition,
           L runs, S2, screening, SWT-bench). The headline wording is the operator's and does not change; the Claude
           seat may be switched off and nothing on the page depends on it.
         · GEMINI'S FREE TIER IS NOT A SEAT (researched 2026-09-27): Antigravity's free tier is about twenty agent
           requests a day — a trial — and a usable Gemini seat is Google AI Pro. The page does not say it is free.
         SPEED LEFT THE HEADLINE on purpose: the routing rule is price first, speed second, quality as a tolerance. -->


### index.html [html]
<!-- THE PROOF, REBUILT 2026-10-01. The 2026-09-22 version (Opus plans, DeepSeek Flash writes) measured arms the
         product no longer sells. This is the SAME task and the SAME 37-check audit (bench/ladder/L.txt,
         bench/ministore-8-modules/audit.mjs), re-run 2026-09-28/29 on the five seats; one shared linear axis from
         zero, cheapest first, as before. Source rows: merge_scores ids 6, 34, 116, 1623, 1632, 1646, 2480, 2572,
         2575, 2581. The raw Opus bar is the 2026-09-22/23 reference (mean of 2), not re-run. -->


### index.html [html]
<!-- THE CELLS BEHIND "3× CHEAPER" (2026-10-01, second pass): each row is the router's winner in one benchmark cell
         against the CHEAPEST raw Claude arm (Haiku, Sonnet or Opus) that keeps >= 80% of the cell's best measured
         quality. Axis linear, 4.339% a time. Quality in the meta is winner vs reference. Neither side carries the QA step;
         the last row adds it as an estimate (see the derivation comment above the headline). -->


### index.html [html]
<!-- WHY IT EXISTS (2026-09-24) — ONE section between the hook and the systems. It was three (what it is · the
       research · the three things it does) and the operator's verdict was that they were too big: three headlines and
       ten cards to walk before the product appeared. The argument only ever had three beats, so it is three
       paragraphs and three cards now, and the research sits under them as evidence rather than as its own chapter.
       The order is still the one that matters: widen the frame, name the problem, name what antiloki does about it. -->


### index.html [html]
<!-- THE RESEARCH, SHRUNK (operator 2026-09-24: "the percentages section of the problem should be a small
         discrete section with the sources as it has now, but all smaller and discrete… one paragraph in natural
         language saying the whole information"). It was four cards with 34px numbers, which gave the outside
         research more of the screen than the product had. Every figure and every source survives, in a sentence. -->


### index.html [html]
<!-- THE DUO — the two screens, each with what you get from it (operator 2026-09-21: "not just a code
       diagnosis project — the two main benefits"). The prints float in 3D: a slow idle drift,
       and they lean toward the pointer; still under prefers-reduced-motion. -->


### index.html [html]
<!-- THE TWO STORIES: each screen is a scrollytelling chapter — the print stays put (sticky) while five
       functionalities scroll past it; the one in view lights up and the print leans toward it. Cowork: print
       left, steps right. X-ray: mirrored.
       RENAMED 2026-09-23 (operator: "threads is not a good word anymore, agents is the correct word"): the word
       described a container the product no longer has. You pick an agent and talk to it; a widget opens beside
       it. There is nothing to compose before you can work. -->


### index.html [html]
<!-- AROUND THE WORK (2026-10-01, operator: "see the work that we are doing now, the last five days … update
       everything there"). The two chapters above are tied to their prints, and the prints are older than most of
       this: seats as chat panes, QA that tests, the live film, stop and pause, the queue, the setup wizard, the PR
       button and the per-seat limits all landed 2026-09-27 to 10-01 and have no screenshot here yet. They live in
       cards, not in chapter steps, so no step points at a picture that does not show it. Every card is a feature the
       inventory of the core and FE commits verified exists; the plan-replay-as-regression-test, the file-description
       budget and the X-ray A/B are API-only or experiments and are NOT claimed as screens. -->


### index.html [html]
<!-- THE METHOD — the pitch is not "we route", it is "we measure, then we build the winner" (2026-09-23). -->


### index.html [html]
<!-- THE METHOD LEFT THE PAGE (operator 2026-09-24: "the section The method on the landing is not required you
       can remove and create a blog post to explain completely how antiloki works and at the landing just add the
       link somewhere at the bottom"). It was a whole chapter — two ledes, three cards and a five-column board —
       between the product and the price, and the argument it makes is one a reader either wants in full or does
       not want at the moment they are deciding. It is /blog/how-a-merge-is-made.html now, in full, and the link
       sits at the bottom where someone who wants it will go looking. -->


### index.html [html]
<!-- PRICING -->


### index.html [html]
<!-- DOWNLOAD -->


### index.html [css]
  /* THE MARK = the app's wordmark (shell/logo.tsx): bold lowercase Geist, tight tracking, an ember period */

### index.html [css]
  /* hero — one problem, one promise, one proof */

### index.html [css]
 /* padding-top, not the shorthand: `padding: 72px 0 0` zeroed the .wrap side gutter, so at 390 px the headline sat 6 px from the edge */

### index.html [css]
  /* the proof: three rows, raw Opus against antiloki, the numbers the benches produced */

### index.html [css]
  /* THE BENCHMARK (2026-09-24) — the shape a developer has already read on esbuild's page: one workload, every arm
     measured on it, one metric, one shared linear axis from zero, the number at the end of each bar, cheapest first.
     Zero-based always: a truncated axis is the fastest way to lose this audience, and at 5× there is nothing to
     gain by cheating. The losing arms stay in — a chart where the product wins every row reads as marketing.
     The widest bar draws at 82% of the track, not 100%: a full-width bar has nowhere to put its own number, and the
     number at the bar's end is the point. Ratios are untouched; only the drawing scale moves. */

### index.html [css]
  /* the number lives INSIDE the track, immediately after the fill — a number floated to the far right breaks the
     one thing a bar chart is for, which is reading length and value as the same glance */

### index.html [css]
 /* may give way to the number: the full-width raw bar pushed "$1.151" over the meta at 390 px */

### index.html [css]
 /* soft by gradient, not by filter — a blur this size costs frames on integrated GPUs */

### index.html [css]
  /* the hero text waits for the prints */

### index.html [css]
  /* the stage: two prints fanned in 3D under the headline; they rise out of the deep on the first visit */

### index.html [css]
  /* while the prints form they sit where the headline will be — mid-screen; they glide down as the words rise */

### index.html [css]
  /* THE DUO */

### index.html [css]
  /* THE STORIES: sticky print, five steps scrolling past it */

### index.html [css]
  /* the print leans toward the step in view (the pointer tilt still wins while hovering) */

### index.html [css]
  /* FIVE PRINTS PER CHAPTER (operator 2026-09-21: "5 prints that prove the claims, zoomed on the part that matters;
     click expands the whole page"): the shot stacks the five, the step in view fades its print in and zooms it on the
     part named by `data-zoom` (origin x% y%, scale) — a click opens the whole print in the lightbox. */

### index.html [css]
  /* THE LIGHTBOX (operator 2026-09-21: "onclick expands beautifully the prints"): the print flies from its
     card to the middle of the screen (FLIP), the page dims and blurs behind it, the whole print is shown
     (no crop), a caption under it; Esc, a click outside or × sends it back the way it came. ← → swap. */

### index.html [css]
  /* the problem */

### index.html [css]
  /* the research as one quiet paragraph (2026-09-24) — smaller than the body around it on purpose: it is the
     evidence under the argument, not the argument */

### index.html [css]
  /* the method's link, where the method's chapter used to be (2026-09-24) — quiet, and deliberately not a card */

### index.html [css]
  /* the three wow moments */

### index.html [css]
  /* wow 2 · the measurement */

### index.html [css]
  /* wow 3 · the record */

### index.html [css]
  /* the desk · threads */

### index.html [css]
  /* who + local */

### index.html [css]
  /* pricing */

### index.html [css]
  /* download + faq */

### index.html [css]
  /* THE METHOD (operator 2026-09-23: focus the whole pitch on measured merges) — benchmark → winner → agent.
     A numbered sequence because it IS a sequence: nothing is built before it is measured and ranked. */

### index.html [css]
  /* four cards now that "learn" joined control · verify · route (2026-09-24), so the grid takes a count rather
     than a fixed three — `auto-fit` with a floor keeps three-up and four-up both honest and never strands one
     card alone on a row at the widths this page is read at */

### index.html [css]
  /* WHY IT EXISTS (2026-09-24): one section between the hook and the systems — the frame, the problem, the three
     things antiloki does about it, and the outside research underneath as evidence rather than as a chapter */

### index.html [css]
  /* the winners board: the table's own rows, as the app shows them */

### index.html [js]
// store links — set once the store exists; until then every buy button leads to the trial

### index.html [js]
// the bars grow when they come into view (or sit at full width without motion)

### index.html [js]
// THE DUO'S 3D: each print leans toward the pointer (±9°), the shine follows it; leaving it resumes the idle drift

### index.html [js]
// THE REVEAL: fog → the prints form (0.15s) → the fog thins and the headline rises word by word (0.5s) → the
// rest (1.1s) → the fog is gone (1.9s). Short on purpose (feedback 2026-09-21: a five-second opening lost the
// low-attention visitor): the headline is readable inside a second. A scroll, a click or a key cuts to the end.

### index.html [js]
// every load plays it (operator 2026-09-21: "on reload the animation should show again")

### index.html [js]
// after the reveal the pair leans with the pointer (a few degrees), and each print opens the lightbox

### index.html [js]
// THE STORIES' SCROLL: the step nearest the middle of the viewport is the one on; the chapter's print leans to it

### index.html [js]
// the print of the step, zoomed on what it claims (before the first step / after the last: the first print, whole)

### index.html [js]
// THE LIGHTBOX: FLIP from the card's print to the centered full print and back

### index.html [js]
// light up the visitor's OS

### index.html [js]
// THE DOWNLOAD BUTTONS (2026-09-21): each links straight to the installer of the NEWEST RELEASE THAT HAS ONE FOR
// THAT OS — resolved from the public releases repository at load time (the GitHub API answers cross-origin for a
// public repo; the list is newest first, pre-releases included, drafts excluded). Platforms ship at different
// times (a Linux or Windows build made locally lands before the mac one from CI), so one OS can be on v0.1.3
// while another still offers v0.1.0. Until the API answers, or if it never does, the buttons keep pointing at
// the releases page itself.

### paper.html [html]
<!-- WHAT THIS PAPER IS NOW (audit 2026-09-28). Every arm below was measured on 22-23 September against the Chinese
       models reached through OpenCode Zen. On 27 September the product moved to the five subscription seats and those
       arms were WITHDRAWN — marked legacy in the record, metered rather than flat, and off by default in the app. The
       measurements are still true of what they measured; they are no longer a description of what antiloki ships. A
       reader arriving here without that sentence would take a retired configuration for the current one, so it is
       said at the top rather than in a footnote. Re-running the paper on the seats is a separate piece of work. -->


### paper.html [html]
<!-- THIRD EDITION (2026-10-01). The second edition was measured 28-29 September. Between then and 1 October the
       routing rule, the pipeline and the judges changed again, and the site's headline cost figure was re-derived.
       Rather than rewrite sections that were true of what they measured, the sections that no longer describe the
       product are marked in place, and §11 carries what is new and says which day it was measured. -->


