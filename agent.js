/**
 * Autonomous AIProve agent.
 *
 * A fully autonomous agent for the AIProve bounty arena (aiprove.fun).
 * No human in the loop: it
 *   1. reads the arena's skill.md,
 *   2. signs in with its OWN keypair (generated on first run, kept in
 *      ./keypair.json and never committed),
 *   3. enters EVERY open bounty,
 *   4. submits a forecast prediction to every AutoGrade forecast bounty
 *      it can answer (yes/no direction, numeric close, long/short).
 *
 * It does NOT submit to PosterJudge bounties (they need creative work a
 * poster judges) and does NOT submit to bounties that need a code repo
 * (code-golf, backtests, bug hunts, ...). It only enters those.
 *
 * Run:  npm install && node agent.js
 * Output is a full transcript of the autonomous loop.
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const API = 'https://aiprove.fun';
const KEYPAIR_PATH = path.join(__dirname, 'keypair.json');
const HANDLE = 'auto-agent';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

/* ------------------------------------------------------------------ */
/* Live prices (best effort, with sane fallbacks)                      */
/* ------------------------------------------------------------------ */

async function fetchCrypto() {
  try {
    const r = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    );
    const d = await r.json();
    return { btc: d.bitcoin.usd, eth: d.ethereum.usd };
  } catch (e) {
    log('  [price] CoinGecko failed, using fallback:', e.message);
    return { btc: 68000, eth: 1900 };
  }
}

async function fetchStock(sym) {
  const fallbacks = { NVDA: 160, SPY: 750, GLD: 355 };
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=1d&interval=1d`,
      { headers: { 'user-agent': 'Mozilla/5.0' } }
    );
    const d = await r.json();
    const p = d.chart.result[0].meta.regularMarketPrice;
    if (typeof p === 'number' && p > 0) return p;
    throw new Error('no price in response');
  } catch (e) {
    log(`  [price] Yahoo ${sym} failed, using fallback:`, e.message);
    return fallbacks[sym];
  }
}

async function fetchPrices() {
  const crypto = await fetchCrypto();
  const [nvda, spy, gld] = await Promise.all([
    fetchStock('NVDA'),
    fetchStock('SPY'),
    fetchStock('GLD'),
  ]);
  const prices = { ...crypto, nvda, spy, gld };
  log('  [price] live:', JSON.stringify(prices));
  return prices;
}

/* ------------------------------------------------------------------ */
/* Forecast builder                                                    */
/* ------------------------------------------------------------------ */

/**
 * Build a prediction payload for one bounty, or null to skip it.
 * - yes/no direction (metric "Brier score"): answer "no" + confidence 0.55
 *   (crypto/equities are in a down leg at the time of writing).
 * - numeric close (metric "Absolute error, $"): answer = last live price
 *   of the underlying.
 * - long/short (metric "Realized PnL on your call"): answer "short".
 * Anything else (top-5 lists, code, creative work) -> null (enter only).
 */
function buildPrediction(bounty, prices) {
  const slug = bounty.slug;
  const metric = (bounty.metric || '').toLowerCase();

  // Long / short call on ETH.
  if (slug === 'signal-eth-pnl-24h') {
    return { answer: 'short' };
  }

  // Numeric close predictions.
  if (metric.includes('absolute error')) {
    if (slug === 'forecast-nvda-3d') return { answer: round2(prices.nvda) };
    if (slug === 'spy-close-1dollar') return { answer: round2(prices.spy) };
    if (slug === 'forecast-gold-tomorrow') return { answer: round2(prices.gld) };
    return null;
  }

  // Yes / no direction (Brier score).
  if (metric.includes('brier')) {
    if (
      slug === 'btc-tomorrow' ||
      slug === 'forecast-btc-7d' ||
      slug === 'forecast-eth-24h'
    ) {
      return { answer: 'no', confidence: 0.55 };
    }
    return null;
  }

  return null;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

/* ------------------------------------------------------------------ */
/* Main loop                                                           */
/* ------------------------------------------------------------------ */

async function main() {
  log('=== AIProve autonomous agent starting ===');

  // 1. Read skill.md (the one file that explains everything).
  log('[1/5] Reading skill.md ...');
  const skillRes = await fetch(API + '/skill.md');
  if (!skillRes.ok) throw new Error('skill.md fetch failed: ' + skillRes.status);
  const skill = await skillRes.text();
  log('      skill.md read,', skill.length, 'chars. Rule: free to enter,',
    'auth by keypair, submit repo@commit or a prediction.');

  // 2. Own keypair (generate on first run, reuse afterwards).
  log('[2/5] Keypair ...');
  let wallet;
  if (fs.existsSync(KEYPAIR_PATH)) {
    const kp = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8'));
    wallet = new ethers.Wallet(kp.privateKey);
    log('      loaded existing keypair:', wallet.address);
  } else {
    wallet = ethers.Wallet.createRandom();
    fs.writeFileSync(
      KEYPAIR_PATH,
      JSON.stringify({ address: wallet.address, privateKey: wallet.privateKey }, null, 2),
      { mode: 0o600 }
    );
    log('      generated NEW keypair:', wallet.address, '(saved to ./keypair.json, gitignored)');
  }

  // 3. Auth: challenge -> EIP-191 personal_sign -> verify -> session token.
  log('[3/5] Authenticating ...');
  const cRes = await fetch(`${API}/api/auth/challenge?address=${wallet.address}`);
  const cData = await cRes.json();
  if (!cData.challenge) throw new Error('no challenge: ' + JSON.stringify(cData));
  const sig = await wallet.signMessage(cData.challenge);
  const vRes = await fetch(`${API}/api/auth/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address: wallet.address, signature: sig }),
  });
  const vData = await vRes.json();
  if (!vData.token) throw new Error('verify failed: ' + JSON.stringify(vData));
  const token = vData.token;
  log('      auth OK as', vData.address, '| token expires:', vData.expiresAt);

  // 4. List open bounties.
  log('[4/5] Listing open bounties ...');
  const bRes = await fetch(`${API}/api/bounties?status=open`);
  const bData = await bRes.json();
  const bounties = bData.bounties || [];
  log('      open bounties:', bounties.length);

  // 5. Enter every open bounty.
  log('[5/5] Entering all open bounties ...');
  let entered = 0;
  const enteredSlugs = [];
  for (const b of bounties) {
    try {
      const r = await fetch(`${API}/api/bounties/${b.slug}/enter`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'content-type': 'application/json' },
        body: JSON.stringify({ handle: HANDLE }),
      });
      const d = await r.json();
      if (r.ok) {
        entered++;
        enteredSlugs.push(b.slug);
        log('      enter OK:', b.slug);
      } else {
        log('      enter FAIL:', b.slug, JSON.stringify(d).slice(0, 150));
      }
    } catch (e) {
      log('      enter ERR:', b.slug, e.message);
    }
    await sleep(250);
  }

  // 6. Submit forecasts to the AutoGrade forecast bounties we can answer.
  log('[6/5] Submitting forecasts ...');
  const prices = await fetchPrices();
  let submitted = 0;
  const submittedSlugs = [];
  for (const b of bounties) {
    if (b.lane !== 'AutoGrade') {
      log('      skip (PosterJudge):', b.slug);
      continue;
    }
    const pred = buildPrediction(b, prices);
    if (!pred) {
      log('      skip (no forecast for this type):', b.slug, '| metric:', b.metric);
      continue;
    }
    try {
      const r = await fetch(`${API}/api/bounties/${b.slug}/submit`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'content-type': 'application/json' },
        body: JSON.stringify({ prediction: pred, handle: HANDLE }),
      });
      const d = await r.json();
      if (r.ok) {
        submitted++;
        submittedSlugs.push(b.slug);
        log('      submit OK:', b.slug, JSON.stringify(pred));
      } else {
        log('      submit FAIL:', b.slug, JSON.stringify(d).slice(0, 200));
      }
    } catch (e) {
      log('      submit ERR:', b.slug, e.message);
    }
    await sleep(250);
  }

  log('=== DONE ===');
  log('entered:', entered, '/', bounties.length, '->', enteredSlugs.join(', '));
  log('forecasts submitted:', submitted, '->', submittedSlugs.join(', '));
}

main().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
