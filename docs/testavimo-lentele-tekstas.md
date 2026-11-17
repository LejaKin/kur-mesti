# Testavimo lentelė (teksto atvejai)

Data: 2026-11-17 · Modelis: claude-opus-5-5 · Taisyklės: rules/vasa-taisykles.md

**Rezultatas: 20 iš 20 (100 %)** · tokenų: 253362 įvesties, 4807 išvesties

| # | Užklausa | AI atsakymas | Teisingai pagal VASA | Sutapo | Laikas, s | Pastaba |
|---|---|---|---|---|---|---|
| 1 | tuščias stiklainis nuo uogienės su metaliniu dangteliu | Uogienės stiklainis → stiklas; Metalinis stiklainio dangtelis → plastikas_metalas | stiklas + plastikas_metalas | ✅ | 4.7 | dangtelis atskirai |
| 2 | pieno pakelis Tetra Pak | Pieno likutis → skystis; Pieno pakelis (Tetra Pak) → plastikas_metalas | plastikas_metalas | ✅ | 4.7 | VASA: Tetra Pak – į geltoną |
| 3 | riebalais sutepta picos dėžė | Švari picos dėžės dalis → popierius; Riebalais permirkusi picos dėžės dalis → misrios; Picos likučiai → maisto | misrios | ✅ | 5.5 | sutepto kartono į popierių negalima |
| 4 | kasos čekis | Kasos čekis → misrios | misrios | ✅ | 3.2 | VASA nemini; terminis popierius |
| 5 | vienkartinis popierinis kavos puodelis | Vienkartinis popierinis kavos puodelis → plastikas_metalas | plastikas_metalas | ✅ | 3.7 | VASA: ne į popierių |
| 6 | sudužusi stiklinė gėrimui | Sudužusi stiklinė (gėrimo indas) → misrios | misrios | ✅ | 4.9 | stikliniai indai – ne į žalią |
| 7 | senas veidrodis | Senas veidrodis → didziosios | didziosios | ✅ | 4.0 | veidrodžių į stiklą negalima |
| 8 | AA baterijos | AA baterijos → baterijos | baterijos | ✅ | 3.9 |  |
| 9 | pasibaigusio galiojimo tabletės | Pasibaigusio galiojimo tabletės (vaistai) → vaistai; Pasibaigusios maisto papildų ar vitaminų tabletės (jei tai ne vaistai) → maisto | vaistai | ✅ | 5.6 | vaistinė |
| 10 | senas megztinis | Senas megztinis → tekstile | tekstile | ✅ | 3.6 |  |
| 11 | kavos tirščiai | Kavos tirščiai → maisto | maisto | ✅ | 2.9 | oranžinis maišelis |
| 12 | sauskelnės | Panaudotos sauskelnės → misrios | misrios | ✅ | 4.7 |  |
| 13 | panaudotas kepimo aliejus | Panaudotas kepimo aliejus → aliejus | aliejus | ✅ | 3.7 |  |
| 14 | LED lemputė | LED lemputė → lempos | lempos | ✅ | 3.7 | į stiklą negalima |
| 15 | plaukų džiovintuvas | Plaukų džiovintuvas → elektronika_smulki | elektronika_smulki | ✅ | 3.3 |  |
| 16 | dažų skardinė su likučiais | Dažų skardinė su likučiais → pavojingos | pavojingos | ✅ | 4.0 |  |
| 17 | kartoninė siuntinio dėžė | Kartoninė siuntinio dėžė → popierius | popierius | ✅ | 3.6 | išlankstyti |
| 18 | traškučių pakelis | Traškučių pakelis → plastikas_metalas | plastikas_metalas | ✅ | 3.6 | blizgi pakuotė |
| 19 | senas čiužinys | Senas čiužinys → didziosios | didziosios | ✅ | 2.9 |  |
| 20 | dantų šepetėlis | Dantų šepetėlis → misrios | misrios | ✅ | 3.3 | higienos reikmenys |
