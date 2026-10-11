# antiloki: positioning

*Internal. Written 2026-10-11 from what the product does today and what we have measured. Where it says "hypothesis", nobody has tested it yet.*

## The one-sentence position

**For people who pay for more than one AI coding subscription, antiloki is the control layer over those subscriptions: it sends each job to the seat that has been measured best at it, checks the result, and keeps a record of who did what and what it cost. Unlike using the tools alone, nothing in it is a promise you have to take on trust.**

## The situation we are in

Code is a commodity, and the vendors are shipping the features we ship. Building a better product is not the contest; getting people to pay is. So the position has to rest on things the vendors have little reason to give away, and on a distribution path we can actually run alone.

- **Not our contest:** being the best editor or the smartest single agent. Cursor, Claude Code and Codex will keep winning that.
- **Our contest:** being the neutral layer across all of them, the one that tells you the truth about the work: which model did it, whether it passed, what it cost.

## Who it is for (hypotheses, in order of how much I would bet)

1. **Freelancers and small agencies who already pay for two or more AI subscriptions** and cannot say what each one costs per job, or who did what on a client's repo. They feel the pain weekly, they can decide alone, and a one-time price fits how they budget.
2. **Heavy solo developers who hit a seat's limit mid-task.** The routing around an exhausted seat is a concrete, demonstrable benefit.
3. **Engineering leads who want receipts** (a confidence reading, a per-task cost, a trail naming the model). Real, but a longer sale; do not chase it yet.

Not for: people who want one AI that "just does it", and anyone who will not install a desktop app.

## What we can prove today

| claim | the evidence |
|---|---|
| each job goes to the seat measured best at it | 1,186 measured runs ship as the default routing table; the method and every script are published |
| the result is checked | a confidence reading with its reasons on every result; one-click independent QA in a real browser |
| you can see who did what and what it cost | Sagas: every task shows the agent, the exact model, the time and the cost the run recorded |
| it works with what you already pay for | it drives Claude Code, Codex, Cursor, Gemini and Grok through their own CLIs; no new account |

## Claims to audit before we say them out loud

A position built on "we tell the truth" dies on the first claim that does not reproduce. Re-run, or remove:

- the headline multipliers on the landing page (an earlier "10x cheaper" stopped reproducing against raw Opus; confirm every number now on the page against the paper's tables);
- anything comparing us with a vendor's feature set: cite the vendor's own docs, dated;
- "checkout is open" or "macOS" anywhere until it is true. Today: Windows current, Linux older, macOS coming.

## Where a moat could come from

1. **The measured data.** The routing table is expensive for anyone else to reproduce, and it improves with use. This is the strongest asset.
2. **History that accumulates.** Sagas, episodes and per-project memory live in the project. The longer someone uses it the more it costs to leave. It is local and open, so this is a mild switching cost and we should not pretend otherwise.
3. **Trust.** Receipts are something the token-sellers have no incentive to build.

## The biggest risk

We sit on top of platforms we do not control. A vendor can change a CLI, restrict third-party use of a subscription, or ship multi-model routing. Mitigations: stay on each vendor's official interface, keep the data asset ours, and move fast on the parts only a neutral layer can do.

## Distribution: three channels to test, each with a number that ends the test

| channel | the move | cost | success looks like |
|---|---|---|---|
| **Evidence content** | post the benchmark and "every run, with the scripts" where developers argue about these tools; one concrete finding per post | days, no money | 500 downloads from one post; 10% of them activate the trial |
| **Comparison pages** | "antiloki vs using Claude Code alone", honest about when the tool alone is better | a week | ranks for the comparison searches within a quarter |
| **Direct outreach to agencies and freelancers** | 20 people a week who post about juggling AI subscriptions; offer the trial and ask what broke | time only | 5 conversations, 2 trials, 1 purchase from the first 20 |

The question to answer is the video's: not "is the product good" but **how do we get the first 50 people to pay $499?** The first purchase teaches more than fifty downloads, so the funnel to watch is: download, trial started, key activated, paid.

## Pricing: questions, not answers

- One-time $499 fits how the first customer budgets, and there is no churn to leak. It also means every sale is a one-off, so the pipeline has to refill itself.
- Is $499 right for a freelancer who pays $20 to $200 a month for each seat? Test a lower first price against the same offer before deciding.
- The two-year update window is the lever: it defines what a repeat purchase is.

## Decisions I need from you

1. Is the first customer the freelancer and small agency? If not, who?
2. Which one of the three channels do we run first? (I would run evidence content, because we already have the evidence.)
3. Do we open checkout before the claims audit, or after? (I would audit first.)
4. Windows-only for the first 50 buyers, or hold for macOS?
5. Do we test a lower first price?

## The next 14 days

1. Day 1-2: claims audit on the landing page and the paper; fix or remove.
2. Day 3: checkout live (Creem), end-to-end test purchase, then the trial-to-key flow.
3. Day 4-7: one evidence post, chosen from the benchmark, with the scripts.
4. Day 8-14: outreach to 20 agency and freelancer prospects; log every reply; write down what broke.
5. Day 14: read the numbers (downloads, trials, activations, purchases) and change the plan from them.
