# Svarbiausi darbo su AI (Claude Code) fragmentai

Visas pokalbis išsaugotas Claude Code programoje. Čia pateikti svarbiausi momentai, kurie parodo, kaip buvo formuluojama užduotis, tikrinami rezultatai ir taisomos klaidos.

## 1. Užduoties formulavimas
Claude Code gavo visą užduoties aprašymą, VASA taisyklių lentelę ir 17 vasa.lt nuorodų su nurodymu:
> „Atlik šią užduotį savarankiškai. Leidžiu naudotis viskuo, kas mano kompiuteryje. Man reikia jau parengto produkto.“

**Ką padarė AI:** pirmiausia patikrino kompiuterio įrankius ir rado, kad nėra git, GitHub CLI ir Vercel CLI. Tada parsisiuntė visus VASA puslapius ir atmintinės PDF, o taisykles sudėjo į vieną failą `rules/vasa-taisykles.md`. Kur VASA atvejo nemini, faile pažymėta.

## 2. Architektūros sprendimas: AI nesprendžia, į kurį konteinerį mesti
AI grąžina tik daikto **kategoriją** (iš 19 fiksuotų), o konteinerį parenka programėlės kodas pagal vartotojo pažymėtus konteinerius. Taip patarimas visada atitinka tai, ką vartotojas turi, ir nepriklauso nuo to, ką AI „sugalvoja“. Pavyzdys: stiklainis su metaliniu dangteliu, kai vartotojas turi tik bendrą pakuočių ir žalią konteinerį. Rezultatas: stiklainis į žalią, dangtelis į bendrą pakuočių, uogienės likučiai į oranžinį maišelį.

## 3. Klaida: netinkamas API rakto formatas
Pirmas testų paleidimas: **0 iš 20**, klaida `401 invalid x-api-key`. AI pirmiausia nusprendė, kad `sk-ant-usr-…` nėra API raktas, ir rakto patikrinime pareikalavo `sk-ant-api` pradžios. Vartotoja atsiuntė konsolės ekrano nuotrauką, kurioje matyti, kad nauja konsolė raktus išduoda būtent `sk-ant-usr-` formatu. **Taisymas:** AI pripažino klaidą, leido abu formatus ir rakto įvedimui atidarė atskirą macOS langą, nes terminalo kortelė neleido įvesti teksto. Tuo pačiu raktu išbandžius dar kartą: 200 OK.

## 4. Rezultato tikrinimas testais
Sukurtas testavimo scenarijus `tests/run-tests.js` su 20 sudėtingų atvejų: Tetra Pak, riebalais sutepta picos dėžė, čekis, sudužusi stiklinė, veidrodis, LED lemputė, dažai ir kt. Teisingi atsakymai paimti iš VASA taisyklių. Rezultatas **20 iš 20**, žr. `docs/testavimo-lentele-tekstas.md`.

## 5. Patikrinimas gyvoje svetainėje
Po paskelbimo AI pats atidarė paskelbtą nuorodą telefono dydžio naršyklėje, įkėlė testinę nuotrauką ir patikrino, kad nuotraukos kelias (telefonas → Vercel funkcija → Claude → atsakymas) veikia ir kad patarimas atitinka pažymėtus konteinerius.

## 6. Vartotojos rasta logikos klaida: žvakė stiklinėje
Testuodama telefonu vartotoja nufotografavo žvakę stiklinėje su metaliniu dangteliu ir pastebėjo prieštaravimą:
> „Kodėl man verta išgremžti vašką, jei tiek jis, tiek indelis keliauja į tą patį konteinerį?“

**Priežastis:** AI paruošimo patarimus rašė nepriklausomai nuo kategorijų, o taisyklėse žvakių nebuvo.
**Taisymas:** (1) AI nurodyme atsirado nuoseklumo taisyklė: atskirti ar išvalyti liepiama tik tada, kai tai pakeičia, kur dalis keliauja. Taip pat aiškiai atskirtos pakuotės nuo daiktų (stiklinių indų). (2) Į taisyklių failą įrašyta: stiklinė su vašku – į mišrias, vaško išgremžti nereikia; metalinis dangtelis – į geltoną. **Patikrinimas:** ta pati nuotrauka davė nuoseklų atsakymą, o 20 teksto testų po pakeitimo vis dar 20/20.

## 7. Vartotojos rastos spragos: vaistai, vitaminai ir pakuotės turinys
Vartotoja nufotografavo nosies purškalą ir šnypščiųjų vitaminų tūbelę, palygino atsakymus su vasa.lt/medikamentai ir rado dvi problemas:
> „Purškalas – į vaistinę, bet kodėl tada nurodoma, kad vitaminai į maisto atliekas, o kartoninė dėžutė (kurios nuotraukoje nesimato) – į popierių? … Tai kodėl šita pakuotė į geltoną? O kur aš ištuštinti turėčiau turinį?“

**Priežastys:** (1) prie kategorijos „vaistai“ visada buvo rodomas tas pats bendras tekstas, minintis kitus daiktus; (2) AI liepė „ištuštinti“, bet nenurodė, kur dėti turinį; (3) AI nebuvo aiškiai nurodyta, kuo skiriasi vaistai ir papildai.
**Taisymas:** bendras tekstas sutrumpintas; AI nurodyme atsirado taisyklės TURINYS (visada pasakyti, kur dėti turinį, ir pateikti jį kaip atskirą daiktą) bei VAISTAI ir PAPILDAI pagal VASA; paaiškinime leidžiama kalbėti tik apie nuotraukoje esančius daiktus. **Patikrinimas:** vitaminai → tabletės į oranžinį maišelį, tuščia tūbelė į geltoną; purškalas → visas į vaistinę. 20 teksto testų vis dar 20/20.

**Vartotojos pasiūlymas ateičiai:** atsakymas „jei tuščia – čia, jei pilna – ten“ arba klausimų skiltis, pvz. „o jei pakuotė pilna?“. Sprendimas: pirmiausia pristatyti prašytą MVP, o tai pateikti kaip kitą žingsnį.

## 8. Kartojimasis ir skysčiai: AI turėjo surasti faktus
Vartotoja pastebėjo, kad skiltys „Kaip“ ir „Kodėl“ kartoja tą patį, ir paklausė apie sirupą:
> „Ar likučiai ant butelio sienelių – nieko tokio pagal taisykles? Ar tikrai visus skysčius maistinius galima šalinti į kanalizaciją? Aš nežinau – surask ir patikslink.“

**Ką AI rado:** VASA atmintinė – „Pakuočių plauti nebūtina, užtenka išpilti skysčius“ (likučiai ant sienelių netrukdo). VASA draudžia į kriauklę pilti tik aliejų ir riebalus; apie kitus skysčius VASA ir „Vilniaus vandenys“ tiesiogiai nieko nesako, todėl tai pažymėta kaip „[ne VASA – bendra praktika]“. Be to, AI pats pastebėjo trečią klaidą: sirupo kortelės antraštė buvo „Mišrių atliekų konteineris“, o tekstas liepė pilti į kriauklę.
**Taisymas:** (1) AI nurodyme kiekvienam laukui apibrėžta paskirtis: „Paruošimas“ – tik veiksmai, „Kodėl“ – tik priežastis, be kartojimo; (2) nauja kategorija „Išpilkite į kriauklę“ neriebiems skysčiams, o riebūs skysčiai sugeriami popieriumi ir keliauja į maisto atliekas; (3) taisyklių faile atsirado skyrius 5a „Skysto maisto likučiai“. 20 teksto testų – 20/20.

## Kitos smulkios pataisos
- Kai nebuvo galima įdiegti globalių npm paketų, Vercel ir GitHub CLI buvo įdiegti į vartotojo aplanką.
- Kadangi kompiuteryje nėra git, kodas į GitHub įkeltas per GitHub API.
- Telefone patarimo eilutės „Paruošimas:“ buvo per siauros, todėl išdėstymas pakeistas.
