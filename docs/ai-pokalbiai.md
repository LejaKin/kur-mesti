# Svarbiausi darbo su AI (Claude Code) fragmentai

Visas pokalbis išsaugotas Claude Code programoje. Čia pateikti 5 momentai, kurie parodo, kaip buvo formuluojama užduotis, tikrinami rezultatai ir taisomos klaidos.

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

## Kitos smulkios pataisos
- Kai nebuvo galima įdiegti globalių npm paketų, Vercel ir GitHub CLI buvo įdiegti į vartotojo aplanką.
- Kadangi kompiuteryje nėra git, kodas į GitHub įkeltas per GitHub API.
- Telefone patarimo eilutės „Paruošimas:“ buvo per siauros, todėl išdėstymas pakeistas.
