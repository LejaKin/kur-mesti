#!/bin/zsh
# Perkelia API raktą iš .env į Vercel aplinkos kintamąjį ir iš naujo paskelbia programėlę.
cd "$(dirname "$0")/.."
KEY=$(grep '^ANTHROPIC_API_KEY=' .env | cut -d= -f2-)
[[ -z "$KEY" ]] && { echo "Nėra .env rakto. Pirma paleiskite ./scripts/irasyti-rakta.sh"; exit 1; }
~/.local/bin/vercel env rm ANTHROPIC_API_KEY production --yes >/dev/null 2>&1
printf "%s" "$KEY" | ~/.local/bin/vercel env add ANTHROPIC_API_KEY production --sensitive >/dev/null && echo "✅ Raktas įrašytas į Vercel"
~/.local/bin/vercel deploy --prod --yes >/dev/null && echo "✅ Programėlė paskelbta iš naujo: https://kur-mesti-vilnius.vercel.app"
