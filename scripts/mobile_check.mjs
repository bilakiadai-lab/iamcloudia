// Ouvre chaque page du dossier site/ sur téléphone (390 px) et sur ordinateur (1280 px)
// et échoue si la page déborde en largeur ou si le navigateur signale une erreur JavaScript.
// Usage : node scripts/mobile_check.mjs [dossier]
import { chromium } from "playwright";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve(process.argv[2] || "site");
const pages = readdirSync(dir).filter((f) => f.endsWith(".html")).sort();
const extra = { "test-positionnement.html": ["#cloud", "#ai"] };
const browser = await chromium.launch();
let failures = 0;

for (const width of [390, 1280]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  for (const page of pages) {
    for (const hash of ["", ...(extra[page] || [])]) {
      const p = await context.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      // Les polices Google ne sont pas nécessaires pour ce contrôle.
      await p.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
      await p.goto(`file://${dir}/${page}${hash}`);
      await p.waitForTimeout(300);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const label = `${page}${hash} à ${width} px`;
      if (overflow > 1) { failures++; console.log(`::error::${label} : la page déborde de ${overflow} px en largeur`); }
      for (const e of errors) { failures++; console.log(`::error::${label} : erreur JavaScript « ${e} »`); }
      if (overflow <= 1 && !errors.length) console.log(`OK  ${label}`);
      await p.close();
    }
  }
  await context.close();
}
await browser.close();
process.exit(failures ? 1 : 0);
