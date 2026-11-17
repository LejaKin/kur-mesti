# Testavimo lentelė (teksto atvejai)

Data: 2026-11-17 · Modelis: claude-opus-5-5 · Taisyklės: rules/vasa-taisykles.md

**Rezultatas: 20 iš 20 (100 %)** · tokenų: 234242 įvesties, 5702 išvesties

| # | Užklausa | AI atsakymas | Teisingai pagal VASA | Sutapo | Laikas, s | Pastaba |
|---|---|---|---|---|---|---|
| 1 | tuščias stiklainis nuo uogienės su metaliniu dangteliu | Uogienės stiklainis → stiklas; Stiklainio dangtelis → plastikas_metalas | stiklas + plastikas_metalas | ✅ | 5.0 | dangtelis atskirai |
| 2 | pieno pakelis Tetra Pak | Pieno pakelis → plastikas_metalas | plastikas_metalas | ✅ | 4.5 | VASA: Tetra Pak – į geltoną |
| 3 | riebalais sutepta picos dėžė | Picos dėžė – švarios dalys → popierius; Picos dėžė – riebalais permirkusios dalys → misrios; Picos likučiai (jei yra) → maisto | misrios | ✅ | 5.9 | sutepto kartono į popierių negalima |
| 4 | kasos čekis | Kasos čekis → misrios | misrios | ✅ | 3.9 | VASA nemini; terminis popierius |
| 5 | vienkartinis popierinis kavos puodelis | Vienkartinis popierinis kavos puodelis → plastikas_metalas | plastikas_metalas | ✅ | 3.1 | VASA: ne į popierių |
| 6 | sudužusi stiklinė gėrimui | Sudužusi geriamoji stiklinė (šukės) → misrios | misrios | ✅ | 3.1 | stikliniai indai – ne į žalią |
| 7 | senas veidrodis | Senas veidrodis → didziosios | didziosios | ✅ | 5.3 | veidrodžių į stiklą negalima |
| 8 | AA baterijos | AA baterijos → baterijos | baterijos | ✅ | 2.4 |  |
| 9 | pasibaigusio galiojimo tabletės | Pasibaigusio galiojimo tabletės (vaistai) → vaistai | vaistai | ✅ | 5.0 | vaistinė |
| 10 | senas megztinis | Senas megztinis → tekstile | tekstile | ✅ | 4.6 |  |
| 11 | kavos tirščiai | Kavos tirščiai → maisto | maisto | ✅ | 5.1 | oranžinis maišelis |
| 12 | sauskelnės | Sauskelnės → misrios | misrios | ✅ | 4.8 |  |
| 13 | panaudotas kepimo aliejus | Panaudotas kepimo aliejus → aliejus | aliejus | ✅ | 3.7 |  |
| 14 | LED lemputė | LED lemputė → lempos | lempos | ✅ | 3.7 | į stiklą negalima |
| 15 | plaukų džiovintuvas | Plaukų džiovintuvas → elektronika_smulki | elektronika_smulki | ✅ | 3.2 |  |
| 16 | dažų skardinė su likučiais | Dažų skardinė su likučiais → pavojingos | pavojingos | ✅ | 4.8 |  |
| 17 | kartoninė siuntinio dėžė | Kartoninė siuntinio dėžė → popierius | popierius | ✅ | 4.9 | išlankstyti |
| 18 | traškučių pakelis | Traškučių pakelis → plastikas_metalas | plastikas_metalas | ✅ | 3.0 | blizgi pakuotė |
| 19 | senas čiužinys | Senas čiužinys → didziosios | didziosios | ✅ | 4.8 |  |
| 20 | dantų šepetėlis | Dantų šepetėlis → misrios | misrios | ✅ | 4.0 | higienos reikmenys |
