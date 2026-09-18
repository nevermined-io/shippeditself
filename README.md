# shippeditself

A small, beautiful website whose subject is the AI agent that shipped it. It bought its own domain,
hosting, a screenshot of the result, this repo, and even the narration and music for the video about it —
from vendors it had no account with — paid per call through the [Nevermined
Router](https://nevermined.ai), across **two protocols** (x402 and MPP) and **two chains** (Base and
Tempo), all from **one Delegation**, a budget a human capped in advance.

**Live:** [shippeditself.com](https://shippeditself.com)

## What this is

- `site/` — the static site (hand-written HTML/CSS/JS, no build step, no framework).
- `receipt/ledger.json` — the raw Nevermined Router payment ledger for this run
  (`GET /api/v1/router/payments?delegationId=...`), unedited.
- `receipt/receipt.json` — the curated receipt table rendered on the site: one row per settled payment,
  with amounts, the Router's 2% fee shown separately, protocol, chain, and the on-chain transaction hash
  for each.

Every claim on the site links to a real payment id and a real on-chain transaction — the receipt table is
generated from the ledger above, not hand-typed.

## How it was made

An agent ([Claude Code](https://claude.com/claude-code)) was given a Nevermined API key, a human-set
spending cap (a **Delegation**), and one instruction: build and ship this site, paying for whatever it
needed along the way. It discovered vendors in Nevermined's public Agent Services Catalog, and for each
purchase — hosting and a domain from Locus, a screenshot from ScreenshotOne, and every narration line and
the music bed for the video from Deepgram and Suno via Locus's MPP gateway — it called the Nevermined
Router, which paid the vendor's `402 Payment Required` price and relayed the result. Nothing here required
an account, a credit card, or a human clicking "buy."

Full mechanics, the real numbers for this run, and a diagram are on the [site itself](https://shippeditself.com#how-it-works).

## Reproduce it

1. Get a Nevermined API key from the Nevermined app.
2. Fund the buyer wallet the Delegation exposes.
3. Create a Delegation — a spending cap in cents and an expiry. This is the only guardrail.
4. Install the plugin: `/plugin marketplace add nevermined-io/docs`, then
   `/plugin install nevermined-router@nevermined`.
5. Tell your agent what to buy and what it's allowed to spend.

See the tutorial: [tutorials.nevermined.app/t/ship-a-website](https://tutorials.nevermined.app/t/ship-a-website) (source in [nevermined-io/tutorials](https://github.com/nevermined-io/tutorials/tree/main/catalog/ship-a-website)). Watch the run: [youtu.be/Wg-7go30WRs](https://youtu.be/Wg-7go30WRs).
