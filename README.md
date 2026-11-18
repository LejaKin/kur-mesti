# Kur mesti? Vilnius

Web programėlė telefonui: nufotografuoji atlieką, o ji pasako, į kurį Vilniaus konteinerį ją mesti. Patarimai remiasi **VASA** (vasa.lt) taisyklėmis.

**Gyva versija:** https://kur-mesti-vilnius.vercel.app (atsidaro telefono naršyklėje, diegti nereikia)

## Kaip veikia

1. **Mano konteineriai.** Pirmą kartą atsidarius pažymite, kokie konteineriai yra prie namų: geltonas, mėlynas, žalias, bendras pakuočių, maisto, tekstilės, aliejaus, žaliųjų atliekų. Pasirinkimas saugomas telefone (`localStorage`), jį galima keisti mygtuku „Mano konteineriai“.
2. **Nuotrauka.** Mygtukas „Fotografuoti“ atidaro kamerą, „Galerija“ – nuotraukų galeriją. Nuotrauka telefone sumažinama iki 1568 px ir siunčiama į serverį.
3. **Atpažinimas.** Serverio funkcija `api/classify.js` siunčia nuotrauką ir visą taisyklių failą `rules/vasa-taisykles.md` modeliui Claude Opus 5.5. Modelis grąžina griežto formato JSON: kiekvieną daiktą, jo medžiagą, kategoriją (iš 20 fiksuotų), pasitikėjimo lygį, paruošimą (išpilti, atskirti dangtelį ir pan.) ir paaiškinimą.
4. **Patarimas.** Konteinerį parenka ne AI, o programėlės kodas (`destination()` faile `public/app.js`), pagal vartotojo pažymėtus konteinerius. Pavyzdžiui, plastikas: geltonas → jei jo nėra, bendras pakuočių → jei ir jo nėra, artimiausias viešas konteineris. Specialioms atliekoms nurodoma alternatyva: didelių gabaritų aikštelės adresai, nemokamas paėmimas per VASA, taromatas, vaistinė, parduotuvių dėžės, „Dėk’ui“.
5. **Nesuprato.** Jei AI nuotraukos neatpažino arba nepasitiki atsakymu, programėlė taip ir pasako. Ji pasiūlo fotografuoti dar kartą arba pasirinkti iš sąrašo (~65 dažnų atliekų katalogas, veikia be AI).
6. **Papildomai.** Paieška tekstu (iš pradžių vietiniame kataloge, tada per AI), neseniai tikrintų daiktų istorija ir **anglų kalba**: mygtukas LT/EN viršuje perjungia visą sąsają, konteinerius, patarimus, sąrašą ir AI atsakymus (tekstai – `public/i18n.js`).

```
Telefonas (public/)  ──nuotrauka──▶  Vercel funkcija (api/classify.js)  ──▶  Claude API
   ▲  kategorija → konteineris            + rules/vasa-taisykles.md
   └──────────────── JSON ◀───────────────┘          (API raktas tik serveryje)
```

## Taisyklių šaltinis

`rules/vasa-taisykles.md` surinkta 2026-11-17 iš šių šaltinių:
- VASA atmintinė „Rūšiuok atsakingai“ (PDF, 2026 m. liepa)
- vasa.lt puslapiai: rūšiavimo konteineriai, maisto, mišrios, tekstilė, elektronika, baterijos, lempos, gyvsidabris, pavojingos, medikamentai, statybinės, medienos, padangos, žaliosios, aliejus, individualus paėmimas

Kur VASA atvejo tiesiogiai nemini (pvz., kasos čekiai), faile pažymėta „[ne VASA – bendra praktika]“.

## Kaip paleisti savo kompiuteryje

Reikia Node.js 20 ar naujesnio ir Claude API rakto (console.anthropic.com).

```bash
npm install
./scripts/irasyti-rakta.sh      # raktas įrašomas į .env (nekeliamas į GitHub)
npm run dev                     # http://localhost:3000
```

## Kaip paskelbti (Vercel)

```bash
vercel deploy --prod
./scripts/rakta-i-vercel.sh     # raktas → Vercel aplinkos kintamasis ANTHROPIC_API_KEY
```

## Testavimas

**Rezultatai:** 20 realių nuotraukų – 20/20 (`docs/testavimo-lentele.md`); 20 teksto atvejų – 20/20 (`docs/testavimo-lentele-tekstas.md`). Klaidos, rastos testuojant telefonu, ir jų pataisymai – `docs/telefono-testai.md`.

```bash
node tests/run-tests.js --text  # 20 teksto atvejų → docs/testavimo-lentele-tekstas.md
node tests/run-tests.js         # 20 nuotraukų iš tests/nuotraukos/ → docs/testavimo-lentele.md
```

Teisingi atsakymai pagal VASA surašyti `tests/text-cases.json` ir `tests/tikri-atsakymai.csv`.

## Saugumas ir kaina

- API raktas laikomas tik Vercel aplinkos kintamajame, į naršyklę jis nepatenka.
- Vienam IP leidžiama iki 20 užklausų per 10 min. Išlaidų riba nustatoma Anthropic konsolėje (10 USD).
- Taisyklių failas kešuojamas (prompt caching), todėl pakartotinės užklausos pigesnės. Viena nuotrauka kainuoja apie 0,01–0,03 USD.

## Failai

| Failas | Paskirtis |
|---|---|
| `public/index.html`, `app.js`, `style.css` | programėlė (be karkasų, vienas JS failas) |
| `api/classify.js` | serverio funkcija, AI užklausa |
| `rules/vasa-taisykles.md` | VASA taisyklės, kurias naudoja AI |
| `tests/` | testavimo scenarijus ir teisingi atsakymai |
| `docs/` | testavimo lentelės, pristatymas, AI pokalbių fragmentai |
