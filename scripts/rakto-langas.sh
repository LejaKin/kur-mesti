#!/bin/zsh
# Atidaro macOS langą API raktui įklijuoti (raktas nerodomas) ir įrašo jį į .env.
cd "$(dirname "$0")/.."
KEY=$(osascript -e 'text returned of (display dialog "Įklijuokite Claude API raktą (prasideda sk-ant-…).\n\nJį rasite: platform.claude.com → Settings → API Keys → Create Key" default answer "" with hidden answer with title "Kur mesti? – API raktas" buttons {"Atšaukti", "Išsaugoti"} default button "Išsaugoti" giving up after 1800)' 2>/dev/null)
KEY=$(printf "%s" "$KEY" | tr -d '[:space:]')
if [[ "$KEY" != sk-ant-* ]]; then
  osascript -e 'display dialog "Tai ne API raktas. API raktas prasideda sk-ant-…" buttons {"Gerai"} with title "Kur mesti?"' >/dev/null 2>&1
  echo "BLOGAS_RAKTAS"; exit 1
fi
echo "ANTHROPIC_API_KEY=$KEY" > .env && chmod 600 .env && echo "RAKTAS_IRASYTAS"
