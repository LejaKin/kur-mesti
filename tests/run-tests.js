// Testavimas: paleidžia AI su nuotraukomis (tests/nuotraukos/*.jpg) ir/arba teksto atvejais,
// palygina su teisingu atsakymu pagal VASA ir sugeneruoja lentelę docs/testavimo-lentele.md.
//
//   node tests/run-tests.js            – nuotraukos iš tests/nuotraukos + tests/tikri-atsakymai.csv
//   node tests/run-tests.js --text     – 20 teksto atvejų iš tests/text-cases.json (greitas patikrinimas)
//
// API raktas: .env faile (ANTHROPIC_API_KEY=...).
import fs from "node:fs";
import path from "node:path";

if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const { default: handler } = await import("../api/classify.js");

function call(body) {
  return new Promise((resolve) => {
    const res = { code: 200, status(c) { this.code = c; return this; }, json(o) { resolve({ code: this.code, data: o }); } };
    handler({ method: "POST", headers: {}, body }, res);
  });
}

const textMode = process.argv.includes("--text");
let cases = [];
if (textMode) {
  cases = JSON.parse(fs.readFileSync("tests/text-cases.json", "utf8")).map((c) => ({ id: c.text, body: { text: c.text }, expected: c.expected, note: c.note || "" }));
} else {
  const csv = fs.readFileSync("tests/tikri-atsakymai.csv", "utf8").trim().split("\n").slice(1);
  cases = csv.filter(Boolean).map((l) => {
    const [file, expected, note = ""] = l.split(";").map((s) => s.trim());
    const img = fs.readFileSync(path.join("tests/nuotraukos", file)).toString("base64");
    const ext = path.extname(file).toLowerCase();
    return { id: file, body: { image: img, mediaType: ext === ".png" ? "image/png" : "image/jpeg" }, expected, note };
  });
}

const rows = [];
let ok = 0, tokensIn = 0, tokensOut = 0;
for (const c of cases) {
  const t0 = Date.now();
  const { code, data } = await call(c.body);
  const items = data.daiktai || [];
  const got = items.map((i) => i.kategorija);
  // Sutapo, jei teisinga kategorija yra tarp AI nurodytų (keliems daiktams – visos turi būti).
  // „a|b“ – tinka bet kuris variantas; „NESUPRATO“ – tikimasi, kad AI pasakys, jog neatpažino.
  const expectedList = c.expected.split("+").map((s) => s.trim());
  const unclear = !data.atpazinta || !items.some((i) => i.pasitikejimas !== "zemas");
  const match = code === 200 && (c.expected.trim() === "NESUPRATO" ? unclear : !unclear && expectedList.every((e) => e.split("|").some((x) => got.includes(x.trim()))));
  if (match) ok++;
  tokensIn += (data.usage?.in || 0) + (data.usage?.cacheRead || 0);
  tokensOut += data.usage?.out || 0;
  rows.push({ id: c.id, ai: items.map((i) => `${i.pavadinimas} → ${i.kategorija}${i.pasitikejimas === "zemas" ? " (nepasitiki)" : ""}`).join("; ") || `nesuprato: ${data.pastaba || data.error || ""}`, expected: c.expected, match, s: ((Date.now() - t0) / 1000).toFixed(1), note: c.note });
  console.log(match ? "✅" : "❌", c.id, "→", got.join(", ") || "-", "| tikėtasi:", c.expected);
}

const pct = Math.round((ok / cases.length) * 100);
const md = `# Testavimo lentelė${textMode ? " (teksto atvejai)" : ""}

Data: ${new Date().toISOString().slice(0, 10)} · Modelis: claude-opus-5-5 · Taisyklės: rules/vasa-taisykles.md

**Rezultatas: ${ok} iš ${cases.length} (${pct} %)** · tokenų: ${tokensIn} įvesties, ${tokensOut} išvesties

| # | ${textMode ? "Užklausa" : "Nuotrauka"} | AI atsakymas | Teisingai pagal VASA | Sutapo | Laikas, s | Pastaba |
|---|---|---|---|---|---|---|
${rows.map((r, i) => `| ${i + 1} | ${r.id} | ${r.ai.replace(/\|/g, "/")} | ${r.expected} | ${r.match ? "✅" : "❌"} | ${r.s} | ${r.note} |`).join("\n")}
`;
fs.mkdirSync("docs", { recursive: true });
const out = textMode ? "docs/testavimo-lentele-tekstas.md" : "docs/testavimo-lentele.md";
fs.writeFileSync(out, md);
console.log(`\n${ok}/${cases.length} (${pct} %) → ${out}`);
