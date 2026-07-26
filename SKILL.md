---
name: vue-fe-boilerplate
description: "Crea un nuovo progetto frontend Vue 3 partendo da un boilerplate pronto (Vite, PrimeVue 4 Aura, Tailwind, Pinia, Vue Router, Axios, Firebase Auth, deploy Cloudflare Pages). Parte senza backend grazie a mock auth e mock API. Usa questa skill quando l'utente vuole iniziare un nuovo progetto Vue o una SPA, creare una dashboard o un gestionale con login e rotte protette per ruolo, o dice 'nuovo progetto Vue' / 'il solito boilerplate'. Contiene anche le regole architetturali da rispettare quando si aggiungono pagine a un progetto gia' creato da questo boilerplate."
---

# vue-fe-boilerplate

Scaffolding di un frontend Vue 3 gia' funzionante: layout con topbar/sidebar/dark mode, login,
rotte protette per ruolo, una pagina CRUD di riferimento e una dashboard con grafici.
Con i mock attivi gira senza backend e senza Firebase.

## Scaffolding di un nuovo progetto

**1. Chiedi il nome del progetto** se l'utente non l'ha detto. Serve per la cartella,
per `package.json` e per `VITE_APP_NAME`.

**2. Copia il template.** Usa `template/.` con il punto finale: senza, i dotfile
(`.env.example`, `.eslintrc.cjs`, `.gitignore`, `.prettierrc.json`) non vengono copiati
ed e' un errore che si scopre tardi. Il percorso `template/` e' relativo alla cartella
di questo plugin (dove si trova questo `SKILL.md`).

```bash
mkdir -p <target>
cp -r <cartella-di-questo-plugin>/template/. <target>/
```

**3. Personalizza tre punti**, altrimenti il progetto resta chiamato "vue-fe-boilerplate":

| File               | Cosa cambiare                          |
| ------------------ | --------------------------------------- |
| `package.json`     | campo `name`                           |
| `index.html`       | `<title>`                              |
| `.env`             | `VITE_APP_NAME`                        |

**4. Crea il `.env`.** Non e' nel template perche' e' gitignorato: `cp .env.example .env`.
L'app parte anche senza, perche' `src/config/index.js` ha i default con i mock a `true`,
ma averlo rende esplicito cosa si sta usando.

**5. Installa e avvia.**

```bash
npm install
npm run dev
```

**6. Verifica che sia davvero partito.** Apri `http://127.0.0.1:5173` — non `localhost`,
che su alcune macchine Windows risolve su IPv6 mentre Vite ascolta su IPv4 e da' 404.
Il login e' finto: si sceglie il ruolo (`admin` o `user`) e si clicca Accedi. Con `admin`
si vedono anche la voce Utenti e la pagina `/admin`.

**7. Inizializza git** nel nuovo progetto (`git init`), non ereditare la storia di questo repo.

## Regole architetturali

Sono nel `CLAUDE.md` copiato dentro il progetto, che vale come istruzioni per chi ci lavora dopo.
Le tre che si violano piu' spesso:

- **HTTP solo nei service.** Un componente non importa mai `axios`, importa il service.
  I service non fanno `try/catch`: rilanciano, e la pagina cattura e mostra il toast.
- **`import.meta.env` si legge solo in `src/config/index.js`.** Altrove si importa da `@/config`.
- **Una feature = una cartella** sotto `src/views/pages/<feature>/`, con i suoi `components/`.
  La pagina orchestra, i figli ricevono props ed emettono eventi.

File da copiare come modello: `src/views/pages/items/Items.vue` (CRUD completo),
`src/services/ItemService.js` (service), la voce `/admin` in `src/router/index.js` (rotta con ruolo).

Per aggiungere una pagina servono quattro passi: il componente sotto `src/views/pages/`,
il service, la rotta nei `children` di `AppLayout` in `src/router/index.js`, la voce in
`src/router/menu.js`. Se la rotta ha `meta.roles`, la voce di menu deve avere lo stesso `roles`.

## Passare dai mock al backend reale

I flag `VITE_MOCK_AUTH` e `VITE_MOCK_API` vanno a `false`, e vanno valorizzate le variabili
Firebase e `VITE_GOOGLE_CLIENT_ID`. Il backend deve esporre `GET /auth/me`, che valida l'ID token
Firebase e risponde con il profilo applicativo (ruolo compreso).

Togliere il codice mock tocca nove file, non solo i service. Prima di cancellare
`src/services/mock/` va spostato altrove `ITEM_CATEGORIES` / `ITEM_STATUSES`, che stanno dentro
`itemsMock.js` ma sono costanti di dominio usate da `ItemDialog.vue`: cancellare la cartella
senza spostarle rompe il build. Oltre ai due service ci sono rami mock in `AuthService.js`,
`Login.vue`, `plugins/axios.js`, `plugins/firebase.js` e `config/index.js`.

## Note

- Niente TypeScript, il progetto e' in JavaScript. Testi UI in italiano.
- I componenti PrimeVue non si importano: `unplugin-vue-components` li auto-importa.
- Non aggiungere `optimizeDeps.noDiscovery` a `vite.config.mjs`: senza un `include` esplicito
  le dipendenze CJS (`dayjs`) non vengono pre-bundlate e in dev il browser fallisce l'import.
- Il boilerplate non ha test: non c'e' nessun runner configurato.
