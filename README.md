# vue-fe-boilerplate (Claude Code plugin)

Questo repo e' una **skill/plugin per Claude Code**, non un progetto da avviare direttamente.
Il progetto Vue 3 vero e proprio (Vite, PrimeVue 4, Tailwind, Pinia, Firebase Auth) vive
in [`template/`](template/) e viene copiato da li' ogni volta che si scaffolda un nuovo progetto.

## Installazione

Clona il repo e caricalo come plugin locale con il flag `--plugin-dir`:

```bash
git clone <url-di-questo-repo> vue-fe-boilerplate
claude --plugin-dir ./vue-fe-boilerplate
```

Da un'altra macchina basta clonare questo repo e ripetere il comando: non serve altro,
`template/` contiene gia' tutti i file del boilerplate (dotfile inclusi).

Per non dover ripetere `--plugin-dir` a ogni sessione, sposta il repo dentro la cartella
skill personale di Claude Code:

```bash
git clone <url-di-questo-repo> ~/.claude/skills/vue-fe-boilerplate
```

## Uso

Dentro Claude Code, chiedi di creare un nuovo progetto Vue (o invoca la skill per nome):
la skill copia `template/` nella cartella di destinazione, personalizza nome progetto e
`.env`, e guida l'avvio. I dettagli operativi sono in [`SKILL.md`](SKILL.md).

## Sviluppo di questa skill

Il contenuto di `template/` e' la sorgente di verita' del boilerplate: per modificarlo,
lavora dentro `template/` come un normale progetto Vue (`cd template && npm install && npm run dev`).
`SKILL.md` contiene solo le istruzioni per Claude, non codice applicativo.
