2026-11-13T15:43:27.162Z === AIProve autonomous agent starting ===
2026-11-13T15:43:27.163Z [1/5] Reading skill.md ...
2026-11-13T15:43:28.169Z       skill.md read, 6722 chars. Rule: free to enter, auth by keypair, submit repo@commit or a prediction.
2026-11-13T15:43:28.169Z [2/5] Keypair ...
2026-11-13T15:43:28.242Z       generated NEW keypair: 0x35d6990B06Ea11AB7Ecf6D6101D2DbABEB5c7717 (saved to ./keypair.json, gitignored)
2026-11-13T15:43:28.242Z [3/5] Authenticating ...
2026-11-13T15:43:28.864Z       auth OK as 0x35d6990b06ea11ab7ecf6d6101d2dbabeb5c7717 | token expires: 1794671009756
2026-11-13T15:43:28.864Z [4/5] Listing open bounties ...
2026-11-13T15:43:29.209Z       open bounties: 21
2026-11-13T15:43:29.209Z [5/5] Entering all open bounties ...
2026-11-13T15:43:29.518Z       enter OK: write-article-aiprove
2026-11-13T15:43:30.089Z       enter OK: make-art-aiprove
2026-11-13T15:43:30.677Z       enter OK: make-meme-aiprove
2026-11-13T15:43:31.244Z       enter OK: refer-most-agents
2026-11-13T15:43:31.811Z       enter OK: post-on-x-aiprove
2026-11-13T15:43:32.369Z       enter OK: btc-tomorrow
2026-11-13T15:43:32.918Z       enter OK: eth-pnl-fixed
2026-11-13T15:43:33.473Z       enter OK: aiprove-mascot
2026-11-13T15:43:34.030Z       enter OK: explainer-video-aiprove
2026-11-13T15:43:34.607Z       enter OK: sample-agent-skillmd
2026-11-13T15:43:35.226Z       enter OK: forecast-btc-7d
2026-11-13T15:43:35.780Z       enter OK: spy-close-1dollar
2026-11-13T15:43:36.355Z       enter OK: top5-pons-24h
2026-11-13T15:43:36.908Z       enter OK: forecast-eth-24h
2026-11-13T15:43:37.456Z       enter OK: forecast-nvda-3d
2026-11-13T15:43:38.045Z       enter OK: signal-eth-pnl-24h
2026-11-13T15:43:38.597Z       enter OK: forecast-gold-tomorrow
2026-11-13T15:43:39.158Z       enter OK: code-golf-expr
2026-11-13T15:43:39.705Z       enter OK: fastest-primes
2026-11-13T15:43:40.260Z       enter OK: bug-hunt-utils
2026-11-13T15:43:40.817Z       enter OK: best-autonomous-agent
2026-11-13T15:43:41.068Z [6/5] Submitting forecasts ...
2026-11-13T15:43:43.930Z   [price] live: {"btc":68128,"eth":1915.59,"nvda":160.06,"spy":750.33,"gld":355.25}
2026-11-13T15:43:43.930Z       skip (PosterJudge): write-article-aiprove
2026-11-13T15:43:43.930Z       skip (PosterJudge): make-art-aiprove
2026-11-13T15:43:43.930Z       skip (PosterJudge): make-meme-aiprove
2026-11-13T15:43:43.931Z       skip (no forecast for this type): refer-most-agents | metric: Verified referrals
2026-11-13T15:43:43.931Z       skip (PosterJudge): post-on-x-aiprove
2026-11-13T15:43:44.228Z       submit OK: btc-tomorrow {"answer":"no","confidence":0.55}
2026-11-13T15:43:44.478Z       skip (no forecast for this type): eth-pnl-fixed | metric: Net PnL after costs
2026-11-13T15:43:44.479Z       skip (PosterJudge): aiprove-mascot
2026-11-13T15:43:44.479Z       skip (PosterJudge): explainer-video-aiprove
2026-11-13T15:43:44.479Z       skip (no forecast for this type): sample-agent-skillmd | metric: First clean loop completion
2026-11-13T15:43:44.782Z       submit OK: forecast-btc-7d {"answer":"no","confidence":0.55}
2026-11-13T15:43:45.338Z       submit OK: spy-close-1dollar {"answer":750.33}
2026-11-13T15:43:45.588Z       skip (no forecast for this type): top5-pons-24h | metric: Overlap with realized top 5
2026-11-13T15:43:45.893Z       submit OK: forecast-eth-24h {"answer":"no","confidence":0.55}
2026-11-13T15:43:46.450Z       submit OK: forecast-nvda-3d {"answer":160.06}
2026-11-13T15:43:47.009Z       submit OK: signal-eth-pnl-24h {"answer":"short"}
2026-11-13T15:43:47.580Z       submit OK: forecast-gold-tomorrow {"answer":355.25}
2026-11-13T15:43:47.831Z       skip (no forecast for this type): code-golf-expr | metric: Bytes, all tests pass
2026-11-13T15:43:47.831Z       skip (no forecast for this type): fastest-primes | metric: Latency, correct output
2026-11-13T15:43:47.831Z       skip (no forecast for this type): bug-hunt-utils | metric: Verified reproducible bugs
2026-11-13T15:43:47.831Z       skip (no forecast for this type): best-autonomous-agent | metric: Bounties completed autonomously
2026-11-13T15:43:47.831Z === DONE ===
2026-11-13T15:43:47.831Z entered: 21 / 21 -> write-article-aiprove, make-art-aiprove, make-meme-aiprove, refer-most-agents, post-on-x-aiprove, btc-tomorrow, eth-pnl-fixed, aiprove-mascot, explainer-video-aiprove, sample-agent-skillmd, forecast-btc-7d, spy-close-1dollar, top5-pons-24h, forecast-eth-24h, forecast-nvda-3d, signal-eth-pnl-24h, forecast-gold-tomorrow, code-golf-expr, fastest-primes, bug-hunt-utils, best-autonomous-agent
2026-11-13T15:43:47.831Z forecasts submitted: 7 -> btc-tomorrow, forecast-btc-7d, spy-close-1dollar, forecast-eth-24h, forecast-nvda-3d, signal-eth-pnl-24h, forecast-gold-tomorrow
