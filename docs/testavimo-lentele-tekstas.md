# Testavimo lentelė (teksto atvejai)

Data: 2026-11-17 · Modelis: claude-opus-5-5 · Taisyklės: rules/vasa-taisykles.md

**Rezultatas: 20 iš 20 (100 %)** · tokenų: 198033 įvesties, 5878 išvesties

| # | Užklausa | AI atsakymas | Teisingai pagal VASA | Sutapo | Laikas, s | Pastaba |
|---|---|---|---|---|---|---|
| 1 | tuščias stiklainis nuo uogienės su metaliniu dangteliu | Uogienės stiklainis → stiklas; Stiklainio dangtelis → plastikas_metalas | stiklas + plastikas_metalas | ✅ | 5.3 | dangtelis atskirai |
| 2 | pieno pakelis Tetra Pak | Pieno pakelis → plastikas_metalas | plastikas_metalas | ✅ | 4.8 | VASA: Tetra Pak – į geltoną |
| 3 | riebalais sutepta picos dėžė | Picos dėžės švari dalis → popierius; Riebalais permirkusi picos dėžės dalis → misrios | misrios | ✅ | 5.5 | sutepto kartono į popierių negalima |
| 4 | kasos čekis | Kasos čekis → misrios | misrios | ✅ | 3.8 | VASA nemini; terminis popierius |
| 5 | vienkartinis popierinis kavos puodelis | Vienkartinis kavos puodelis → plastikas_metalas; Puodelio dangtelis (jei yra) → plastikas_metalas | plastikas_metalas | ✅ | 5.9 | VASA: ne į popierių |
| 6 | sudužusi stiklinė gėrimui | Sudužusi gėrimo stiklinė → misrios | misrios | ✅ | 4.6 | stikliniai indai – ne į žalią |
| 7 | senas veidrodis | Senas veidrodis → didziosios | didziosios | ✅ | 5.4 | veidrodžių į stiklą negalima |
| 8 | AA baterijos | AA baterijos → baterijos | baterijos | ✅ | 4.1 |  |
| 9 | pasibaigusio galiojimo tabletės | Pasibaigusio galiojimo tabletės → vaistai; Vaistų kartoninė dėžutė ir informacinis lapelis → popierius | vaistai | ✅ | 5.8 | vaistinė |
| 10 | senas megztinis | Senas megztinis → tekstile | tekstile | ✅ | 4.7 |  |
| 11 | kavos tirščiai | Kavos tirščiai → maisto | maisto | ✅ | 4.5 | oranžinis maišelis |
| 12 | sauskelnės | Sauskelnės → misrios | misrios | ✅ | 4.2 |  |
| 13 | panaudotas kepimo aliejus | Panaudotas kepimo aliejus → aliejus | aliejus | ✅ | 5.0 |  |
| 14 | LED lemputė | LED lemputė → lempos | lempos | ✅ | 5.2 | į stiklą negalima |
| 15 | plaukų džiovintuvas | Plaukų džiovintuvas → elektronika_smulki | elektronika_smulki | ✅ | 4.5 |  |
| 16 | dažų skardinė su likučiais | Dažų skardinė su likučiais → pavojingos | pavojingos | ✅ | 4.5 |  |
| 17 | kartoninė siuntinio dėžė | Kartoninė siuntinio dėžė → popierius | popierius | ✅ | 5.1 | išlankstyti |
| 18 | traškučių pakelis | Traškučių pakelis → plastikas_metalas | plastikas_metalas | ✅ | 4.1 | blizgi pakuotė |
| 19 | senas čiužinys | Senas čiužinys → didziosios | didziosios | ✅ | 4.7 |  |
| 20 | dantų šepetėlis | Dantų šepetėlis → misrios | misrios | ✅ | 4.5 | higienos reikmenys |
