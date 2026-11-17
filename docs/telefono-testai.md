# Testai telefonu (realios nuotraukos)

Vartotoja fotografavo realias atliekas paskelbtoje programėlėje (kur-mesti-vilnius.vercel.app). Čia surašyti atvejai, kuriuose rasta ir pataisyta klaidų.

| # | Daiktas | Pirmas AI atsakymas | Teisingai pagal VASA | Sutapo pirmą kartą | Po pataisymo |
|---|---|---|---|---|---|
| 1 | Traškučių tūba „Snack Day“ (kartonas + folija, plastikinis dangtelis) | visa tūba – geltonas | geltonas (kombinuota pakuotė) | ✅ | ✅ (aiškesnis paaiškinimas) |
| 2 | Žvakė stiklinėje su metaliniu dangteliu | išgremžti vašką; vaškas ir stiklinė – mišrios | stiklinė su vašku – mišrios (gremžti nereikia); dangtelis – geltonas | ❌ (nelogiškas paruošimas) | ✅ |
| 3 | Nosies purškalas „Nasometin“ (vaistas) | vaistinė, bet patarime minimi vitaminai ir dėžutė, kurių nuotraukoje nėra | vaistinė – visas buteliukas su likučiu | ⚠️ (kategorija teisinga, tekstas klaidinantis) | ✅ |
| 4 | Šnypščiųjų multivitaminų tūbelė | „Ištuštinkite“ – geltonas (nepasakyta, kur dėti tabletes) | tabletės – oranžinis maišelis; tuščia tūbelė – geltonas | ⚠️ (trūko turinio) | ✅ |

Likusios nuotraukos bus surašytos į `docs/testavimo-lentele.md` (`node tests/run-tests.js`).
