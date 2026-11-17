#!/bin/zsh
# Saugiai įrašo Claude API raktą į .env failą (raktas ekrane nerodomas).
cd "$(dirname "$0")/.."
echo "Įklijuokite Claude API raktą (sk-ant-...) ir paspauskite Enter:"
read -rs KEY
if [[ "$KEY" != sk-ant-* ]]; then echo "Tai ne API raktas. API raktas prasideda sk-ant-... (console.anthropic.com -> API Keys -> Create Key)."; exit 1; fi
echo "ANTHROPIC_API_KEY=$KEY" > .env
chmod 600 .env
echo "✅ Raktas įrašytas į .env. Galite uždaryti šią kortelę ir parašyti Claude „įrašiau“."
