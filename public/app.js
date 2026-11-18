"use strict";
/* Kur mesti? – Vilnius. Visa naršyklės logika viename faile.
   AI (serveryje) nustato daikto KATEGORIJĄ, o šis failas pagal vartotojo konteinerius parenka, KUR mesti. */

// ---------- Konteineriai, kuriuos vartotojas gali turėti ----------
const BIN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M5 6l1 14h12l1-14"/></svg>';
const PIN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const DROP_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/></svg>';
const BAG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8c0-3 1-5 3-5s3 2 3 5"/></svg>';

// Spalvos ir ikonos; pavadinimai – i18n.js
const BIN_STYLE = {
  geltonas: { color: "#F2C200", light: true }, melynas: { color: "#1F67C9" }, zalias: { color: "#1E8E46" },
  bendras: { color: "linear-gradient(135deg,#F2C200 0 50%,#1F67C9 50% 100%)" }, maisto: { color: "#8A5A2B" },
  tekstile: { color: "#7C4DCC" }, aliejus: { color: "#C98A0B" }, zaliuju: { color: "#5E8C12" },
  misrios: { color: "#4B5563" }, oranzinis: { color: "#EA7317", icon: BAG_ICON }, kriaukle: { color: "#2A6F9E", icon: DROP_ICON }, vieta: { color: "#0F6E66", icon: PIN_ICON },
};
const SELECTABLE = [["geltonas", "melynas", "zalias", "bendras"], ["maisto", "tekstile", "aliejus", "zaliuju"]];
const URLS = {
  pickup: "https://vasa.lt/individuali-atlieku-paemimo-paslauga", tekstile: "https://vasa.lt/tekstile", riebukas: "https://vasa.lt/riebukas",
  maisto: "https://vasa.lt/maisto-atliekos", elektronika: "https://vasa.lt/elektronika", baterijos: "https://vasa.lt/baterijos-ir-akumuliatoriai",
  pavojingos: "https://vasa.lt/pavojingos-atliekos", zaliosios: "https://vasa.lt/zaliosios-atliekos", konteineriai: "https://vasa.lt/rusiavimo-konteineriai",
  misrios: "https://vasa.lt/misrios-komunalines-atliekos", lempos: "https://vasa.lt/dienos-sviesos-lempos", medikamentai: "https://vasa.lt/medikamentai",
  aliejus: "https://vasa.lt/kepimo-aliejaus-atliekos", padangos: "https://vasa.lt/padangos", gyvsidabris: "https://vasa.lt/gyvsidabrio-turincios-atliekos",
};

// ---------- Kalba ----------
let LANG = (() => { try { return localStorage.getItem("lang") === "en" ? "en" : "lt"; } catch { return "lt"; } })();
const T = () => I18N[LANG];
const binName = (k) => T().bins[k][0];
const binShort = (k) => T().bins[k][1];
const binDesc = (k) => T().bins[k][2];
const BINS = new Proxy({}, { get: (_, k) => ({ ...BIN_STYLE[k], name: binName(k) }) });
const lk = (...keys) => keys.map((k) => [T().links[k], URLS[k]]);

// ---------- Kategorija + vartotojo konteineriai → kur mesti ----------
function destination(cat, my) {
  const has = (k) => my.includes(k);
  const X = T().d;
  const packaging = (own) => {
    if (has(own)) return { bin: own };
    if (has("bendras")) return { bin: "bendras" };
    return { bin: own, missing: X.packMissing(binShort(own)), links: lk("konteineriai") };
  };
  switch (cat) {
    case "stiklas": return has("zalias") ? { bin: "zalias" } : { bin: "zalias", missing: X.glassMissing, links: lk("konteineriai") };
    case "popierius": return packaging("melynas");
    case "plastikas_metalas": return packaging("geltonas");
    case "maisto": return has("maisto") ? { bin: "maisto", note: X.foodBin } : { bin: "oranzinis", note: X.foodBag, links: lk("maisto") };
    case "misrios": return { bin: "misrios", links: lk("misrios") };
    case "tekstile": return has("tekstile") ? { bin: "tekstile", note: X.textileHas } : { bin: "tekstile", missing: X.textileMissing, links: lk("tekstile") };
    case "aliejus": return has("aliejus") ? { bin: "aliejus", note: X.oilHas } : { bin: "aliejus", missing: X.oilMissing, links: lk("riebukas") };
    case "zaliosios": return has("zaliuju") ? { bin: "zaliuju" } : { bin: "vieta", where: X.greenWhere, note: X.greenNote, links: lk("zaliosios") };
    case "elektronika_smulki": return { bin: "vieta", where: X.smallElWhere, note: X.smallElNote, links: lk("elektronika") };
    case "elektronika_stambi": return { bin: "vieta", where: X.bigElWhere, note: X.bigElNote, links: lk("pickup", "elektronika") };
    case "baterijos": return { bin: "vieta", where: X.battWhere, note: X.battNote, links: lk("baterijos") };
    case "lempos": return { bin: "vieta", where: X.lampWhere, note: X.lampNote, links: lk("lempos") };
    case "pavojingos": return { bin: "vieta", where: X.hazWhere, note: X.hazNote, links: lk("pickup", "pavojingos") };
    case "vaistai": return { bin: "vieta", where: X.medWhere, note: X.medNote, links: lk("medikamentai") };
    case "skystis": return { bin: "kriaukle", note: X.liquidNote, links: lk("aliejus") };
    case "uzstato": return { bin: "vieta", where: X.depWhere, note: X.depNote };
    case "didziosios": return { bin: "vieta", where: X.bulkyWhere, note: X.bulkyNote, links: lk("pickup") };
    case "statybines": return { bin: "vieta", where: X.buildWhere, note: X.buildNote, links: lk("pickup") };
    case "padangos": return { bin: "vieta", where: X.tyreWhere, note: X.tyreNote, links: lk("padangos") };
    case "gyvsidabris": return { bin: "vieta", where: X.mercWhere, note: X.mercNote, links: lk("gyvsidabris") };
    default: return { bin: "misrios" };
  }
}

// ---------- Vietinis katalogas: „Pasirinkti iš sąrašo“ ir greita paieška ----------
// [pavadinimas, kategorija, paruošimas, papildomi paieškos žodžiai]
const CATALOG = [
  ["Plastikinis butelis (be užstato)", "plastikas_metalas", "Išpilkite skystį. Plauti nebūtina.", "pet gėrimų vandens"],
  ["Butelis ar skardinė su užstato ženklu", "uzstato", "Nespauskite – taromatas turi nuskaityti brūkšninį kodą.", "užstatas taromatas skardinė alus limonadas"],
  ["Skardinė nuo konservų", "plastikas_metalas", "Išgremžkite likučius. Plauti nebūtina.", "metalas konservai"],
  ["Jogurto ar grietinės indelis", "plastikas_metalas", "Išgremžkite likučius, foliją nuplėškite – ji irgi į geltoną.", "plastikas indelis"],
  ["Pieno ar sulčių pakelis (Tetra Pak)", "plastikas_metalas", "Išpilkite likučius, suplokite.", "tetrapak kombinuota"],
  ["Plastikinis maišelis, plėvelė", "plastikas_metalas", "", "polietilenas"],
  ["Traškučių tūba (kartonas su folija, pvz. Pringles)", "plastikas_metalas", "Kombinuota pakuotė – visa tūba su dangteliu į geltoną. Išpurtykite trupinius, ardyti nereikia. Į mėlyną negalima (kartonas padengtas folija).", "pringles snack day tūba cilindras"],
  ["Traškučių pakelis, saldainio popierėlis", "plastikas_metalas", "", "blizgi pakuotė"],
  ["Vienkartinis kavos puodelis", "plastikas_metalas", "Išpilkite likučius. Į popierių mesti negalima.", "kava puodelis"],
  ["Plastikinis dangtelis, metalinis dangtelis", "plastikas_metalas", "", "kamštelis"],
  ["Kosmetikos, šampūno buteliukas", "plastikas_metalas", "Išspauskite likučius.", "šampūnas kremas"],
  ["Ploviklio butelis", "plastikas_metalas", "Ištuštinkite.", "buitinė chemija"],
  ["Aliuminio folija (švari)", "plastikas_metalas", "Labai suteptą – į mišrias.", "folija"],
  ["Putplastis nuo pakuotės", "plastikas_metalas", "", "polistirenas"],
  ["Kiaušinių dėklas (plastikinis)", "plastikas_metalas", "", ""],
  ["Kartoninė dėžė", "popierius", "Išlankstykite, jei galite – suplėšykite.", "kartonas siunta"],
  ["Laikraštis, žurnalas", "popierius", "", "spauda"],
  ["Popierinis maišelis", "popierius", "", ""],
  ["Vokas, rašomasis popierius, sąsiuvinis", "popierius", "Segtuvus išimkite.", "laiškas"],
  ["Kiaušinių dėklas (kartoninis)", "popierius", "", ""],
  ["Picos dėžė (švari)", "popierius", "Riebalais permirkusias dalis atplėškite ir meskite į mišrias.", "pica"],
  ["Picos dėžės riebalų suteptos dalys", "misrios", "", "pica"],
  ["Vaistų dėžutė (kartoninė)", "popierius", "Vaistus ir lizdines plokšteles – į vaistinę.", ""],
  ["Stiklinis butelis (be užstato)", "stiklas", "Išpilkite skystį. Etiketės nulupti nereikia.", "vynas"],
  ["Stiklainis", "stiklas", "Metalinį dangtelį atsukite – jis į geltoną.", "stiklas"],
  ["Sudužęs butelis ar stiklainis", "stiklas", "Saugiai suvyniokite.", "šukės"],
  ["Sudužusi stiklinė, lėkštė, porcelianas", "misrios", "Į žalią konteinerį negalima. Saugiai suvyniokite.", "duženos keramika puodelis"],
  ["Veidrodis, langų stiklas", "didziosios", "Smulkias šukes saugiai suvyniokite ir meskite į mišrias.", "veidrodis langas"],
  ["Vaisių, daržovių lupenos", "maisto", "Be pakuočių.", "obuolys bananas"],
  ["Kavos tirščiai, arbatos pakelis", "maisto", "", "kava arbata"],
  ["Kiaušinių lukštai", "maisto", "", ""],
  ["Mėsos, žuvies likučiai, kaulai", "maisto", "", ""],
  ["Sugedęs maistas", "maisto", "Išimkite iš pakuotės; pakuotę – į geltoną ar mėlyną.", "duona pelėsis"],
  ["Popierinis rankšluostis, servetėlė (virtuvėje)", "maisto", "", "servetėlė"],
  ["Kambarinio augalo lapai", "maisto", "", "gėlė vazonas"],
  ["Kepimo popierius", "misrios", "", ""],
  ["Kasos čekis", "misrios", "Terminis popierius neperdirbamas.", "čekis kvitas"],
  ["Sauskelnės, higieniniai paketai", "misrios", "", "pampersai"],
  ["Dantų šepetėlis, skustuvas", "misrios", "", "higiena"],
  ["Cigarečių nuorūkos", "misrios", "", "cigaretė"],
  ["Virtuvinė kempinėlė, šluostė", "misrios", "", ""],
  ["Sulūžęs plastikinis žaislas", "misrios", "Išimkite baterijas. Sveiką žaislą – į „Dėk’ui“.", "žaislas"],
  ["Laminuotas popierius, nuotraukos, tapetai", "misrios", "", "nuotrauka"],
  ["Dulkių siurblio maišelis", "misrios", "", ""],
  ["Drabužiai, batai", "tekstile", "Supakuokite į maišą.", "rūbai avalynė"],
  ["Patalynė, užuolaidos, rankšluosčiai", "tekstile", "", "audinys"],
  ["Pagalvė, antklodė, kilimas", "didziosios", "Į tekstilės konteinerį negalima.", ""],
  ["Panaudotas kepimo aliejus", "aliejus", "Atvėsinkite, supilkite į uždaromą butelį.", "riebalai taukai"],
  ["Nupjauta žolė, lapai, šakos", "zaliosios", "", "sodas"],
  ["Mobilusis telefonas, laidai, ausinės", "elektronika_smulki", "", "kroviklis"],
  ["Plaukų džiovintuvas, virdulys, blenderis", "elektronika_smulki", "", "buitinė technika smulki"],
  ["Elektroninė cigaretė", "elektronika_smulki", "", "vape"],
  ["Šaldytuvas, skalbimo mašina, televizorius", "elektronika_stambi", "", "stambi technika"],
  ["Baterijos", "baterijos", "", "elementai akumuliatorius"],
  ["Lemputė (LED, taupioji, kaitrinė)", "lempos", "", "lempa"],
  ["Gyvsidabrio termometras", "gyvsidabris", "", "termometras"],
  ["Dažai, lakas, klijai", "pavojingos", "", "dažų skardinė"],
  ["Aerozolio balionėlis", "pavojingos", "Visiškai tuščią galima į geltoną; su likučiais – pavojingos.", "purškiklis dezodorantas"],
  ["Variklio tepalas, antifrizas", "pavojingos", "", "automobilis"],
  ["Vaistai, tabletės", "vaistai", "", "medikamentai"],
  ["Baldai, čiužinys", "didziosios", "", "sofa spinta kėdė"],
  ["Dviratis, vežimėlis", "didziosios", "", ""],
  ["Plytos, betonas, plytelės", "statybines", "", "remontas"],
  ["Mediena, lentos", "didziosios", "", "medis"],
  ["Padangos", "padangos", "", "ratai"],
  ["Žvakė stiklinėje", "misrios", "Stiklinę su vašku meskite į mišrias – vaško išgremžti nereikia (stiklinių indų į žalią negalima). Metalinį dangtelį – į geltoną.", "žvakė žvakidė vaškas"],
  ["Sirupo, sulčių, gėrimo likutis", "skystis", "Išpilkite, butelį meskite pagal medžiagą (stiklas – žalias, plastikas – geltonas). Plauti nebūtina.", "sirupas sultys pienas gėrimas skystis"],
  ["Atvėsę fejerverkai", "misrios", "Tik visiškai atvėsę.", "petardos"],
];

// ---------- Būsena ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
let myBins = store.get("bins", null);
let current = "screen-home";
let lastResult = null;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Katalogo įrašas pasirinkta kalba: [pavadinimas, kategorija, paruošimas, paieškos žodžiai]
const cat = (i) => LANG === "en" ? [CATALOG_EN[i][0], CATALOG[i][1], CATALOG_EN[i][1], CATALOG_EN[i][2]] : CATALOG[i];
const catSearch = (i) => CATALOG[i][0] + " " + CATALOG[i][3] + " " + CATALOG_EN[i][0] + " " + CATALOG_EN[i][2];

function swatch(key, extraClass = "") {
  const b = BINS[key];
  return `<span class="swatch ${extraClass}" style="background:${b.color}">${b.icon || BIN_ICON}</span>`;
}

// ---------- Statiniai tekstai ----------
function applyStatic() {
  const t = T();
  document.documentElement.lang = t.htmlLang;
  document.title = t.brand + " Vilnius";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t[el.dataset.i18n]));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t[el.dataset.i18nPh]));
  const lb = $("#btn-lang");
  lb.textContent = t.switchTo;
  lb.setAttribute("aria-label", t.switchLabel);
}

// ---------- Ekranai ----------
function show(id) {
  current = id;
  document.querySelectorAll(".screen").forEach((s) => (s.hidden = s.id !== id));
  $("#bottom-bar").hidden = id === "screen-setup";
  $("#setup-bar").hidden = id !== "screen-setup";
  window.scrollTo(0, 0);
}

function renderSetup() {
  const sel = myBins || [];
  $("#container-list").innerHTML = SELECTABLE.map((keys, g) =>
    `<div class="group-title">${T().groups[g]}</div>` +
    keys.map((k) => `
      <label class="choice">
        <input type="checkbox" value="${k}" ${sel.includes(k) ? "checked" : ""}>
        ${swatch(k)}
        <span><span class="t">${binName(k)}</span><br><span class="d">${binDesc(k)}</span></span>
      </label>`).join("")
  ).join("");
  show("screen-setup");
}

function renderHome() {
  $("#my-bins").innerHTML = myBins.map((k) => `<span class="chip">${swatch(k)}${binShort(k)}</span>`).join("")
    + `<span class="chip">${swatch("misrios")}${T().mixedChip}</span>`;
  const hist = store.get("history", []);
  $("#history-title").hidden = !hist.length;
  $("#history").innerHTML = hist.slice(0, 10).map((h) => {
    const d = destination(h.cat, myBins);
    const where = d.where || BINS[d.bin].name;
    return `<li>${swatch(d.bin)}<span><b>${esc(h.name)}</b><br><small>${esc(where)}</small></span><span class="when">${new Date(h.t).toLocaleDateString(T().dateLocale)}</span></li>`;
  }).join("");
  $("#search-input").value = "";
  $("#search-suggest").innerHTML = "";
  show("screen-home");
}

function itemCard(it) {
  const t = T();
  const d = destination(it.kategorija, myBins);
  const b = BINS[d.bin];
  const where = d.where || b.name;
  const low = it.pasitikejimas === "zemas";
  const links = (d.links || []).map(([tx, u]) => `<a href="${u}" target="_blank" rel="noopener">${tx} ↗</a>`).join("");
  return `
  <article class="item">
    <div class="bin ${b.light ? "light" : ""}" style="background:${b.color}">
      ${swatch(d.bin)}
      <div><div class="label">${d.missing ? t.labelNeed : d.bin === "kriaukle" ? t.labelContent : t.labelThrow}</div><div class="where">${esc(where)}</div></div>
    </div>
    <div class="body">
      ${low ? `<span class="low">${t.lowConf}</span>` : ""}
      <p class="name">${esc(it.pavadinimas)}</p>
      ${it.medziaga ? `<div class="mat">${esc(it.medziaga)}</div>` : ""}
      ${d.missing ? `<div class="notice"><b>${t.noBin}</b> ${esc(d.missing)}</div>` : ""}
      ${it.paruosimas ? `<div class="row"><b>${t.prep}</b><span>${esc(it.paruosimas)}</span></div>` : ""}
      ${d.note ? `<div class="row"><b>${t.how}</b><span>${esc(d.note)}</span></div>` : ""}
      ${it.paaiskinimas ? `<div class="row"><b>${t.why}</b><span>${esc(it.paaiskinimas)}</span></div>` : ""}
      ${links ? `<div class="links">${links}</div>` : ""}
    </div>
  </article>`;
}

function renderResult(data, imgUrl, saveHistory = true) {
  const t = T();
  lastResult = { data, imgUrl };
  const prev = $("#result-preview");
  if (imgUrl) { prev.src = imgUrl; prev.hidden = false; } else prev.hidden = true;
  // Katalogo rezultatas perrašomas pasirinkta kalba (AI atsakymai lieka ta kalba, kuria buvo gauti)
  const items = (data.catalogIdx != null) ? [(() => { const c = cat(data.catalogIdx); return { pavadinimas: c[0], medziaga: "", kategorija: c[1], pasitikejimas: "aukstas", paruosimas: c[2], paaiskinimas: "" }; })()] : (data.daiktai || []);
  const sure = items.filter((i) => i.pasitikejimas !== "zemas");
  let html = "";
  if (!data.atpazinta || !items.length || !sure.length) {
    html += `
      <div class="unclear">
        <div class="big">🤔</div>
        <h1>${t.unclearTitle}</h1>
        <p class="lead">${data.pastaba ? esc(data.pastaba) + " " : ""}${t.unclearTip}</p>
      </div>`;
    if (items.length) html += `<h2>${t.guess}</h2>` + items.map(itemCard).join("");
  } else {
    html += items.map(itemCard).join("");
  }
  html += `<div class="actions">
    <button class="btn" data-act="list">${t.pickList}</button>
    <button class="btn" data-act="retake">${t.retake}</button>
  </div>
  <p class="source">${t.source}</p>`;
  $("#result-list").innerHTML = html;
  show("screen-result");
  if (saveHistory) {
    const hist = store.get("history", []);
    sure.forEach((i) => hist.unshift({ name: i.pavadinimas, cat: i.kategorija, t: Date.now() }));
    store.set("history", hist.slice(0, 30));
  }
}

function renderCatalog(filter = "") {
  const f = norm(filter);
  const rows = CATALOG.map((_, i) => i).filter((i) => !f || norm(catSearch(i)).includes(f));
  $("#catalog").innerHTML = rows.map((i) => {
    const c = cat(i);
    const d = destination(c[1], myBins);
    return `<li><button data-cat="${i}">${swatch(d.bin)}<span>${esc(c[0])}</span></button></li>`;
  }).join("") || `<li class="hint">${T().listEmpty}</li>`;
}

function catalogResult(idx) {
  renderResult({ atpazinta: true, catalogIdx: idx }, null);
}

// ---------- Paieška ----------
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
function suggest(q) {
  const f = norm(q);
  if (f.length < 2) return [];
  return CATALOG.map((_, i) => i).filter((i) => norm(catSearch(i)).includes(f)).slice(0, 5);
}

// ---------- Nuotraukos apdorojimas ----------
async function toJpeg(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = url; });
    const max = 1568;
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function ask(payload, previewUrl) {
  const t = T();
  $("#loading-preview").hidden = !previewUrl;
  if (previewUrl) $("#loading-preview").src = previewUrl;
  $("#loading-text").textContent = previewUrl ? t.loadingPhoto : t.loadingText;
  show("screen-loading");
  const slow = setTimeout(() => ($("#loading-text").textContent = t.loadingSlow), 6000);
  try {
    const r = await fetch("/api/classify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, lang: LANG }) });
    const data = await r.json().catch(() => ({ error: t.errServer }));
    if (!r.ok || data.error) throw new Error(data.error || "Error " + r.status);
    renderResult(data, previewUrl);
  } catch (e) {
    renderResult({ atpazinta: false, pastaba: navigator.onLine ? e.message : t.errOffline, daiktai: [] }, previewUrl);
  } finally {
    clearTimeout(slow);
  }
}

async function onFile(e) {
  const file = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!file) return;
  let dataUrl;
  try { dataUrl = await toJpeg(file); }
  catch { return renderResult({ atpazinta: false, pastaba: T().errPhoto, daiktai: [] }, null); }
  await ask({ image: dataUrl.split(",")[1], mediaType: "image/jpeg" }, dataUrl);
}

// ---------- Kalbos perjungimas ----------
function switchLang() {
  LANG = LANG === "lt" ? "en" : "lt";
  try { localStorage.setItem("lang", LANG); } catch {}
  applyStatic();
  // Perpiešiame tą patį ekraną nauja kalba
  if (current === "screen-setup") {
    const checked = [...document.querySelectorAll("#container-list input:checked")].map((i) => i.value);
    const saved = myBins; myBins = checked; renderSetup(); myBins = saved;
  } else if (current === "screen-list") { renderCatalog($("#list-filter").value); }
  else if (current === "screen-result" && lastResult) { renderResult(lastResult.data, lastResult.imgUrl, false); }
  else if (current === "screen-home" && myBins) { renderHome(); }
}

// ---------- Įvykiai ----------
$("#btn-camera").onclick = () => $("#file-camera").click();
$("#btn-gallery").onclick = () => $("#file-gallery").click();
$("#file-camera").onchange = onFile;
$("#file-gallery").onchange = onFile;
$("#btn-settings").onclick = renderSetup;
$("#btn-lang").onclick = switchLang;
$("#btn-home").onclick = () => (myBins ? renderHome() : renderSetup());
$("#btn-save").onclick = () => {
  myBins = [...document.querySelectorAll("#container-list input:checked")].map((i) => i.value);
  store.set("bins", myBins);
  renderHome();
};
$("#search-input").oninput = (e) => {
  $("#search-suggest").innerHTML = suggest(e.target.value).map((i) => {
    const c = cat(i);
    const d = destination(c[1], myBins);
    return `<button data-cat="${i}">${swatch(d.bin)}<span>${esc(c[0])}</span></button>`;
  }).join("");
};
$("#search-form").onsubmit = (e) => {
  e.preventDefault();
  const q = $("#search-input").value.trim();
  if (!q) return;
  const exact = CATALOG.findIndex((_, i) => norm(cat(i)[0]) === norm(q));
  if (exact >= 0) return catalogResult(exact);
  ask({ text: q }, null);
};
$("#list-filter").oninput = (e) => renderCatalog(e.target.value);
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-cat]");
  if (c) return catalogResult(+c.dataset.cat);
  const act = e.target.closest("[data-act]");
  if (!act) return;
  if (act.dataset.act === "retake") $("#file-camera").click();
  if (act.dataset.act === "list") { $("#list-filter").value = ""; renderCatalog(); show("screen-list"); }
});

// ---------- Startas ----------
applyStatic();
if (myBins) renderHome(); else renderSetup();
