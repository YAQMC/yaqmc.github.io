# YAQMC website

Source and deployment for [yaqmc.github.io](https://yaqmc.github.io/), including the Chinese and English landing pages and the interactive client demo.

`site/` owns the landing pages; `demo/` owns the feature-tour song and demo entry. The build fetches the public client revision in `UPSTREAM.json`, installs its locked dependencies, and builds its actual renderer with an offline provider. The client is a build input, not a copied application source tree in this repository.

```sh
npm run build
npm test
npm run preview
```

Node.js 26.7+, Git and npm are required. GitHub Pages deploys this repository's `dist/` after validation. A scheduled workflow checks client `main` every 15 minutes, using only this repository's `GITHUB_TOKEN` to save a validated `UPSTREAM.json` revision; GitHub may delay scheduled jobs. Manual workflow dispatch refreshes immediately. Legacy `/YAQMC/`, `/YAQMC/en/` and `/YAQMC/demo/` URLs redirect to the corresponding new routes.

The website and copied renderer remain covered by their original licenses. [NOTICE.md](NOTICE.md), [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) retain the applicable notices; the deployed `SOURCE.json` identifies the exact public corresponding source revision.
