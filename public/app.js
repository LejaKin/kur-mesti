"use strict";
/* Kur mesti? – Vilnius. Visa naršyklės logika viename faile.
   AI (serveryje) nustato daikto KATEGORIJĄ, o šis failas pagal vartotojo konteinerius parenka, KUR mesti. */

// ---------- Konteineriai, kuriuos vartotojas gali turėti ----------
const BIN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M5 6l1 14h12l1-14"/></svg>';
const PIN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const DROP_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/></svg>';
const BAG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8c0-3 1-5 3-5s3 2 3 5"/></svg>';

const BINS = {
  geltonas: { name: "Geltonas konteineris", short: "Geltonas", desc: "Plastikas, metalas, Tetra Pak pakuotės", color: "#F2C200", light: true },
  melynas:  { name: "Mėlynas konteineris", short: "Mėlynas", desc: "Popierius ir kartonas", color: "#1F67C9" },
  zalias:   { name: "Žalias konteineris", short: "Žalias", desc: "Stiklinės pakuotės", color: "#1E8E46" },
  bendras:  { name: "Bendras pakuočių konteineris", short: "Bendras pakuočių", desc: "Plastikas, metalas, popierius ir kartonas kartu (stovi vietoj geltono ir mėlyno)", color: "linear-gradient(135deg,#F2C200 0 50%,#1F67C9 50% 100%)" },
  maisto:   { name: "Maisto atliekų konteineris", short: "Maisto atliekų", desc: "Tik Panerių, Naujininkų, Grigiškių sen., pietinėje Rasų ir Vilkpėdės dalyje", color: "#8A5A2B" },
  tekstile: { name: "Tekstilės konteineris", short: "Tekstilės", desc: "Netoliese yra tekstilės konteineris", color: "#7C4DCC" },
  aliejus:  { name: "Maistinio aliejaus konteineris", short: "Aliejaus", desc: "Netoliese yra „Riebuko“ aliejaus konteineris", color: "#C98A0B" },
  zaliuju:  { name: "Žaliųjų atliekų konteineris", short: "Žaliųjų atliekų", desc: "Individualaus namo konteineris žolei, lapams, šakoms", color: "#5E8C12" },
  // Visada prieinami / ne vartotojo pasirinkimas:
  misrios:   { name: "Mišrių atliekų konteineris", color: "#4B5563" },
  oranzinis: { name: "Oranžinis maišelis → mišrių atliekų konteineris", color: "#EA7317", icon: BAG_ICON },
  kriaukle:  { name: "Išpilkite į kriauklę", color: "#2A6F9E", icon: DROP_ICON },
  vieta:     { name: "Speciali surinkimo vieta", color: "#0F6E66", icon: PIN_ICON },
};
const SELECTABLE = [
  { group: "Rūšiavimo konteineriai", keys: ["geltonas", "melynas", "zalias", "bendras"] },
  { group: "Kiti konteineriai šalia namų", keys: ["maisto", "tekstile", "aliejus", "zaliuju"] },
];

const DGASA = "Didelių gabaritų atliekų aikštelė: Pilaitės pr. 50, Liepkalnio g. 113B, Pramonės g. 209S, Graičiūno g. 36C arba Pumpėnų g. 10";
const PICKUP = "Nemokamas paėmimas iš namų kartą per metus – užsakykite VASA savitarnoje arba tel. 0 800 19118";
const L = {
  pickup: ["Užsakyti paėmimą", "https://vasa.lt/individuali-atlieku-paemimo-paslauga"],
  tekstile: ["Tekstilės konteinerių žemėlapis", "https://vasa.lt/tekstile"],
  riebukas: ["Aliejaus konteinerių žemėlapis", "https://vasa.lt/riebukas"],
  maisto: ["VASA: maisto atliekos", "https://vasa.lt/maisto-atliekos"],
  elektronika: ["VASA: elektronika", "https://vasa.lt/elektronika"],
  baterijos: ["VASA: baterijos", "https://vasa.lt/baterijos-ir-akumuliatoriai"],
  pavojingos: ["VASA: pavojingos atliekos", "https://vasa.lt/pavojingos-atliekos"],
  zaliosios: ["VASA: žaliosios atliekos", "https://vasa.lt/zaliosios-atliekos"],
  konteineriai: ["VASA: rūšiavimo konteineriai", "https://vasa.lt/rusiavimo-konteineriai"],
  misrios: ["VASA: mišrios atliekos", "https://vasa.lt/misrios-komunalines-atliekos"],
};

// ---------- Kategorija + vartotojo konteineriai → kur mesti ----------
function destination(cat, my) {
  const has = (k) => my.includes(k);
  const packaging = (own) => {
    if (has(own)) return { bin: own };
    if (has("bendras")) return { bin: "bendras" };
    return { bin: own, missing: `Prie jūsų namų tokio konteinerio nepažymėta. Artimiausias viešas ${BINS[own].short.toLowerCase()} arba bendras pakuočių konteineris (jų yra prie daugiabučių ir parduotuvių).`, links: [L.konteineriai] };
  };
  switch (cat) {
    case "stiklas":
      return has("zalias") ? { bin: "zalias" } : { bin: "zalias", missing: "Žalio konteinerio nepažymėjote. Neškite į artimiausią viešą žalią stiklo konteinerį (prie daugiabučių, parduotuvių). Į bendrą pakuočių konteinerį stiklo mesti negalima.", links: [L.konteineriai] };
    case "popierius": return packaging("melynas");
    case "plastikas_metalas": return packaging("geltonas");
    case "maisto":
      return has("maisto") ? { bin: "maisto", note: "Galima mesti su bet kokiu maišeliu arba be jo." }
        : { bin: "oranzinis", note: "Kaupkite oranžiniame maišelyje, tvirtai užrišite ir meskite į mišrių atliekų konteinerį. Be pakuočių.", links: [L.maisto] };
    case "misrios": return { bin: "misrios", links: [L.misrios] };
    case "tekstile":
      return has("tekstile") ? { bin: "tekstile", note: "Nešvarią ar šlapią tekstilę supakuokite sandariai. Tinkamą dėvėti galite nešti į „Dėk’ui“ stotelę." }
        : { bin: "tekstile", missing: "Tekstilės konteinerio nepažymėjote. Artimiausią rasite žemėlapyje; tekstilę priima ir H&M, Lindex parduotuvės, o tinkamą dėvėti – „Dėk’ui“ stotelės.", links: [L.tekstile] };
    case "aliejus":
      return has("aliejus") ? { bin: "aliejus", note: "Atvėsintą aliejų supilkite į sandarų indą, uždarykite ir meskite visą indą." }
        : { bin: "aliejus", missing: "Aliejaus konteinerio nepažymėjote. Artimiausią „Riebuko“ konteinerį rasite žemėlapyje (Vilniuje ~196) arba nuvežkite į didelių gabaritų atliekų aikštelę. Labai mažą kiekį sugerkite popieriniu rankšluosčiu ir meskite į maisto atliekas.", links: [L.riebukas] };
    case "zaliosios":
      return has("zaliuju") ? { bin: "zaliuju" }
        : { bin: "vieta", where: "Žaliųjų atliekų aikštelė arba kompostas", note: "Nemokamai priima VAATC žaliųjų atliekų aikštelės (pvz., Trakų g. 1A, Lentvaris). Kambarinių gėlių lapai – į oranžinį maisto maišelį. Į mišrių konteinerį mesti draudžiama.", links: [L.zaliosios] };
    case "elektronika_smulki":
      return { bin: "vieta", where: "Elektronikos surinkimo dėžė parduotuvėje", note: "Tokios dėžės yra maisto prekių ir elektronikos parduotuvėse. Veikiantį daiktą galite atiduoti į „Dėk’ui“ stotelę. Į konteinerius mesti negalima.", links: [L.elektronika] };
    case "elektronika_stambi":
      return { bin: "vieta", where: "Nemokamas paėmimas arba aikštelė", note: `${PICKUP}. Arba: ${DGASA}.`, links: [L.pickup, L.elektronika] };
    case "baterijos":
      return { bin: "vieta", where: "Baterijų surinkimo dėžutė", note: "Dėžutės yra parduotuvėse ir kai kurių daugiabučių laiptinėse. Automobilių akumuliatorius priima juos parduodančios įmonės.", links: [L.baterijos] };
    case "lempos":
      return { bin: "vieta", where: "Lempų surinkimo dėžė parduotuvėje arba aikštelė", note: `Į stiklo konteinerį lempučių mesti negalima. Dienos šviesos lempas atiduokite nepažeistas ir supakuotas. ${DGASA}.`, links: [["VASA: lempos", "https://vasa.lt/dienos-sviesos-lempos"]] };
    case "pavojingos":
      return { bin: "vieta", where: "Pavojingų atliekų surinkimas", note: `${PICKUP}. Arba: ${DGASA}. Į jokį konteinerį mesti negalima.`, links: [L.pickup, L.pavojingos] };
    case "vaistai":
      return { bin: "vieta", where: "Vaistinė", note: "Seni ir nereikalingi vaistai nemokamai priimami vaistinėse. Neškite visą pakuotę su likučiu – neišpilkite ir neišmeskite į konteinerį.", links: [["VASA: medikamentai", "https://vasa.lt/medikamentai"]] };
    case "skystis":
      return { bin: "kriaukle", note: "Tik neriebius skysčius (gėrimai, sirupas, sultys, pienas). Aliejaus ir riebalų į kriauklę pilti negalima – jie užkemša vamzdžius; nedidelį riebų likutį sugerkite popieriniu rankšluosčiu ir dėkite į maisto atliekas.", links: [["VASA: aliejus", "https://vasa.lt/kepimo-aliejaus-atliekos"]] };
    case "uzstato": {
      return { bin: "vieta", where: "Taromatas parduotuvėje", note: "Pakuotę su užstato ženklu grąžinkite į taromatą ir atgausite užstatą. Jei ženklo nėra – plastiką ir skardinę į geltoną (ar bendrą pakuočių), stiklą – į žalią konteinerį." };
    }
    case "didziosios":
      return { bin: "vieta", where: "Didelių gabaritų atliekos", note: `${PICKUP}. Arba: ${DGASA}. Tvarkingus daiktus – į „Dėk’ui“ stotelę. Prie konteinerių palikti draudžiama (bauda 140–600 €).`, links: [L.pickup] };
    case "statybines":
      return { bin: "vieta", where: "Statybinės atliekos – paėmimas arba aikštelė", note: `Sudėkite į maišus iki 25 kg. ${PICKUP}. Arba: ${DGASA}.`, links: [L.pickup] };
    case "padangos":
      return { bin: "vieta", where: "Aikštelė arba padangų pardavėjas", note: `4 padangos per metus nemokamai: ${DGASA.replace("Didelių gabaritų atliekų aikštelė: ", "")}. Taip pat priima padangų pardavėjai ir servisai.`, links: [["VASA: padangos", "https://vasa.lt/padangos"]] };
    case "gyvsidabris":
      return { bin: "vieta", where: "Aikštelė arba „Grinda“ tel. 1355", note: `Gyvsidabrio termometrą nemokamai paims „Grinda“ avarinė tarnyba (tel. 1355) arba priims aikštelė. ${DGASA}.`, links: [["VASA: gyvsidabris", "https://vasa.lt/gyvsidabrio-turincios-atliekos"]] };
    default:
      return { bin: "misrios" };
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
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function swatch(key, extraClass = "") {
  const b = BINS[key];
  return `<span class="swatch ${extraClass}" style="background:${b.color}">${b.icon || BIN_ICON}</span>`;
}

// ---------- Ekranai ----------
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => (s.hidden = s.id !== id));
  $("#bottom-bar").hidden = id === "screen-setup";
  $("#setup-bar").hidden = id !== "screen-setup";
  window.scrollTo(0, 0);
}

function renderSetup() {
  const sel = myBins || [];
  $("#container-list").innerHTML = SELECTABLE.map((g) =>
    `<div class="group-title">${g.group}</div>` +
    g.keys.map((k) => `
      <label class="choice">
        <input type="checkbox" value="${k}" ${sel.includes(k) ? "checked" : ""}>
        ${swatch(k)}
        <span><span class="t">${BINS[k].name}</span><br><span class="d">${BINS[k].desc}</span></span>
      </label>`).join("")
  ).join("");
  show("screen-setup");
}

function renderHome() {
  $("#my-bins").innerHTML = (myBins.length ? myBins : []).map((k) => `<span class="chip">${swatch(k)}${BINS[k].short}</span>`).join("")
    + `<span class="chip">${swatch("misrios")}Mišrios</span>`;
  const hist = store.get("history", []);
  $("#history-title").hidden = !hist.length;
  $("#history").innerHTML = hist.slice(0, 10).map((h) => {
    const d = destination(h.cat, myBins);
    const where = d.where || BINS[d.bin].name;
    return `<li>${swatch(d.bin)}<span><b>${esc(h.name)}</b><br><small>${esc(where)}</small></span><span class="when">${new Date(h.t).toLocaleDateString("lt-LT")}</span></li>`;
  }).join("");
  $("#search-input").value = "";
  $("#search-suggest").innerHTML = "";
  show("screen-home");
}

function itemCard(it) {
  const d = destination(it.kategorija, myBins);
  const b = BINS[d.bin];
  const where = d.where || b.name;
  const low = it.pasitikejimas === "zemas";
  const links = (d.links || []).map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join("");
  return `
  <article class="item">
    <div class="bin ${b.light ? "light" : ""}" style="background:${b.color}">
      ${swatch(d.bin)}
      <div><div class="label">${d.missing ? "Reikia" : d.bin === "kriaukle" ? "Turinys" : "Meskite į"}</div><div class="where">${esc(where)}</div></div>
    </div>
    <div class="body">
      ${low ? `<span class="low">AI nėra tikras – patikrinkite</span>` : ""}
      <p class="name">${esc(it.pavadinimas)}</p>
      ${it.medziaga ? `<div class="mat">${esc(it.medziaga)}</div>` : ""}
      ${d.missing ? `<div class="notice"><b>Neturite šio konteinerio.</b> ${esc(d.missing)}</div>` : ""}
      ${it.paruosimas ? `<div class="row"><b>Paruošimas:</b><span>${esc(it.paruosimas)}</span></div>` : ""}
      ${d.note ? `<div class="row"><b>Kaip:</b><span>${esc(d.note)}</span></div>` : ""}
      ${it.paaiskinimas ? `<div class="row"><b>Kodėl:</b><span>${esc(it.paaiskinimas)}</span></div>` : ""}
      ${links ? `<div class="links">${links}</div>` : ""}
    </div>
  </article>`;
}

function renderResult(data, imgUrl) {
  const prev = $("#result-preview");
  if (imgUrl) { prev.src = imgUrl; prev.hidden = false; } else prev.hidden = true;
  const items = (data.daiktai || []);
  const sure = items.filter((i) => i.pasitikejimas !== "zemas");
  let html = "";
  if (!data.atpazinta || !items.length || !sure.length) {
    html += `
      <div class="unclear">
        <div class="big">🤔</div>
        <h1>Nepavyko tiksliai atpažinti</h1>
        <p class="lead">${data.pastaba ? esc(data.pastaba) + " " : ""}Nufotografuokite iš arčiau ir gerame apšvietime, kad matytųsi ženklinimas, arba pasirinkite iš sąrašo.</p>
      </div>`;
    if (items.length) html += `<h2>Spėjimas</h2>` + items.map(itemCard).join("");
  } else {
    html += items.map(itemCard).join("");
  }
  html += `<div class="actions">
    <button class="btn" data-act="list">Nėra teisingo? Pasirinkti iš sąrašo</button>
    <button class="btn" data-act="retake">Fotografuoti dar kartą</button>
  </div>
  <p class="source">Patarimai pagal VASA (vasa.lt) Vilniaus taisykles. AI gali klysti.</p>`;
  $("#result-list").innerHTML = html;
  show("screen-result");
  // istorija
  const hist = store.get("history", []);
  items.filter((i) => i.pasitikejimas !== "zemas").forEach((i) => hist.unshift({ name: i.pavadinimas, cat: i.kategorija, t: Date.now() }));
  store.set("history", hist.slice(0, 30));
}

function renderCatalog(filter = "") {
  const f = norm(filter);
  const rows = CATALOG.filter((c) => !f || norm(c[0] + " " + c[3]).includes(f));
  $("#catalog").innerHTML = rows.map((c) => {
    const d = destination(c[1], myBins);
    return `<li><button data-cat="${CATALOG.indexOf(c)}">${swatch(d.bin)}<span>${esc(c[0])}</span></button></li>`;
  }).join("") || `<li class="hint">Nieko nerasta. Grįžkite ir paklauskite AI tekstu.</li>`;
}

function catalogResult(idx) {
  const c = CATALOG[idx];
  renderResult({ atpazinta: true, daiktai: [{ pavadinimas: c[0], medziaga: "", kategorija: c[1], pasitikejimas: "aukstas", paruosimas: c[2], paaiskinimas: "" }] }, null);
}

// ---------- Paieška ----------
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
function suggest(q) {
  const f = norm(q);
  if (f.length < 2) return [];
  return CATALOG.map((c, i) => [c, i]).filter(([c]) => norm(c[0] + " " + c[3]).includes(f)).slice(0, 5);
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
  $("#loading-preview").hidden = !previewUrl;
  if (previewUrl) $("#loading-preview").src = previewUrl;
  $("#loading-text").textContent = previewUrl ? "Atpažįstame daiktus…" : "Ieškome atsakymo…";
  show("screen-loading");
  const slow = setTimeout(() => ($("#loading-text").textContent = "Dar šiek tiek… tikriname VASA taisykles"), 6000);
  try {
    const r = await fetch("/api/classify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await r.json().catch(() => ({ error: "Netikėtas serverio atsakymas." }));
    if (!r.ok || data.error) throw new Error(data.error || "Klaida " + r.status);
    renderResult(data, previewUrl);
  } catch (e) {
    renderResult({ atpazinta: false, pastaba: navigator.onLine ? e.message : "Nėra interneto ryšio.", daiktai: [] }, previewUrl);
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
  catch { return renderResult({ atpazinta: false, pastaba: "Nepavyko atidaryti nuotraukos (formatas nepalaikomas).", daiktai: [] }, null); }
  await ask({ image: dataUrl.split(",")[1], mediaType: "image/jpeg" }, dataUrl);
}

// ---------- Įvykiai ----------
$("#btn-camera").onclick = () => $("#file-camera").click();
$("#btn-gallery").onclick = () => $("#file-gallery").click();
$("#file-camera").onchange = onFile;
$("#file-gallery").onchange = onFile;
$("#btn-settings").onclick = renderSetup;
$("#btn-home").onclick = () => (myBins ? renderHome() : renderSetup());
$("#btn-save").onclick = () => {
  myBins = [...document.querySelectorAll("#container-list input:checked")].map((i) => i.value);
  store.set("bins", myBins);
  renderHome();
};
$("#search-input").oninput = (e) => {
  $("#search-suggest").innerHTML = suggest(e.target.value).map(([c, i]) => {
    const d = destination(c[1], myBins);
    return `<button data-cat="${i}">${swatch(d.bin)}<span>${esc(c[0])}</span></button>`;
  }).join("");
};
$("#search-form").onsubmit = (e) => {
  e.preventDefault();
  const q = $("#search-input").value.trim();
  if (!q) return;
  const exact = CATALOG.findIndex((c) => norm(c[0]) === norm(q));
  if (exact >= 0) return catalogResult(exact);
  ask({ text: q }, null);
};
$("#list-filter").oninput = (e) => renderCatalog(e.target.value);
document.addEventListener("click", (e) => {
  const cat = e.target.closest("[data-cat]");
  if (cat) return catalogResult(+cat.dataset.cat);
  const act = e.target.closest("[data-act]");
  if (!act) return;
  if (act.dataset.act === "retake") $("#file-camera").click();
  if (act.dataset.act === "list") { $("#list-filter").value = ""; renderCatalog(); show("screen-list"); }
});

// ---------- Startas ----------
if (myBins) renderHome(); else renderSetup();
