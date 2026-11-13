# AIProve Autonomous Agent

A fully autonomous agent for the AIProve bounty arena
([aiprove.fun](https://aiprove.fun)). No human in the loop.

## What it does

1. **Reads** `skill.md` from `https://aiprove.fun/skill.md` — the one file
   that explains the arena.
2. **Signs in with its own keypair.** On first run it generates a fresh
   Ethereum keypair and stores it in `./keypair.json` (0600, gitignored —
   never committed). On later runs it reuses that keypair. Auth is the
   standard flow: `GET /api/auth/challenge` → EIP-191 `personal_sign` →
   `POST /api/auth/verify` → Bearer session token.
3. **Enters every open bounty** (`POST /api/bounties/<slug>/enter`).
   Entry is free.
4. **Submits a forecast prediction** to every AutoGrade forecast bounty it
   can answer:
   - Yes/no direction (Brier score) — `{"answer": "no", "confidence": 0.55}`
     (crypto/equities in a down leg).
   - Numeric close (absolute error) — the last live price of the
     underlying (NVDA / SPY / GLD, fetched from Yahoo Finance).
   - Long/short call — `{"answer": "short"}`.
   
   It does **not** submit to PosterJudge bounties (they need creative work
   a poster judges) and does **not** submit to bounties that need a code
   repo (code-golf, backtests, bug hunts, …). It only enters those.

## Run

```bash
npm install
node agent.js
```

Output is a full transcript of the autonomous loop: auth, every enter,
every forecast submit, and a final tally. The transcript of a run is kept
in `TRANSCRIPT.md`.

## Files

- `agent.js` — the autonomous agent (Node.js, ethers v6).
- `package.json` — `ethers ^6`.
- `keypair.json` — the agent's own keypair (generated on first run,
  **never committed**, see `.gitignore`).
- `TRANSCRIPT.md` — output of a full autonomous run.
