# Vue FE Boilerplate

Base pronta all'uso per un frontend Vue 3 con dashboard, autenticazione e deploy su Cloudflare Pages.
Cloni, lanci `npm install && npm run dev` e hai un'app funzionante **senza backend** (mock attivi di default).

## Stack

| Ambito     | Scelta                                          |
| ---------- | ----------------------------------------------- |
| Framework  | Vue 3 (Composition API, `<script setup>`)       |
| Build      | Vite 5                                          |
| UI         | PrimeVue 4 (preset Aura) + PrimeIcons           |
| CSS        | Tailwind 3 + `tailwindcss-primeui`              |
| Stato      | Pinia                                           |
| Routing    | Vue Router 4                                    |
| HTTP       | Axios (istanza unica con interceptor)           |
| Auth       | Firebase Auth + Google Identity Services        |
| Grafici    | chart.js via `<Chart>` di PrimeVue              |
| Deploy     | Cloudflare Pages                                |

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173  — login mock, dati mock
```

Il `.env` di default ha `VITE_MOCK_AUTH=true` e `VITE_MOCK_API=true`: nessun Firebase, nessun backend.
Per collegare i servizi reali vedi [Configurazione](#configurazione).

Script disponibili:

| Comando          | Cosa fa                                        |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | dev server con HMR                             |
| `npm run build`  | build di produzione in `dist/`                 |
| `npm run preview`| serve la build in locale                       |
| `npm run lint`   | ESLint con `--fix`                             |
| `npm run format` | Prettier su `src/`                             |
| `npm run deploy` | build + `wrangler pages deploy dist`           |

---

## Struttura

```
src/
├── assets/            # scss del layout + tailwind entry + logo
├── config/index.js    # UNICO punto che legge import.meta.env
├── layout/            # chrome dell'app (topbar, sidebar, menu, footer)
│   └── composables/layout.js   # stato layout + dark mode
├── plugins/
│   ├── axios.js       # istanza HTTP + interceptor token/401
│   └── firebase.js    # init Firebase (saltata in mock mode)
├── router/
│   ├── index.js       # rotte + guard di autenticazione e ruoli
│   └── menu.js        # voci della sidebar
├── services/          # un file per entita', solo chiamate API
│   ├── AuthService.js # login Google, logout, profilo, mock login
│   ├── ItemService.js # SERVICE DI RIFERIMENTO
│   ├── UserService.js
│   └── mock/          # adapter finti, cancellabili
├── stores/user.js     # utente corrente (Pinia)
└── views/pages/       # una cartella per feature, self-contained
    ├── dashboard/
    ├── items/         # PAGINA DI RIFERIMENTO (CRUD completo)
    ├── admin/         # esempio di rotta protetta da ruolo
    └── auth/          # login, access denied, error, 404
```

## Regole architetturali

Poche regole, ma non negoziabili: sono ciò che tiene il progetto leggibile quando cresce.

1. **Ogni feature è self-contained** sotto `src/views/pages/<feature>/`. Sotto-componenti in `components/`, logica riusabile in `composables/`. Niente cartelle globali che diventano discariche.
2. **Le chiamate HTTP stanno solo nei service.** I componenti non importano mai `axios`.
3. **I service non gestiscono errori**: rilanciano. Il `try/catch` con toast sta nella pagina, che è l'unica a sapere cosa mostrare all'utente.
4. **Le variabili d'ambiente si leggono solo in `src/config/index.js`.**
5. **La pagina orchestra, i figli comunicano con props/emit.** Un dialog non chiama un service.
6. **La protezione vera è `meta.roles` sulla rotta.** Il filtro nel menu nasconde soltanto.
7. **I componenti PrimeVue non si importano**: `unplugin-vue-components` li risolve da solo (`<Button>`, `<DataTable>`, `<Chart>`...).

---

## Aggiungere una pagina

**1. Crea la cartella** `src/views/pages/prodotti/Prodotti.vue` (+ `components/` se serve).

**2. Crea il service** `src/services/ProdottoService.js`, copiando [ItemService.js](src/services/ItemService.js):

```javascript
import api from '@/plugins/axios'

const ProdottoService = {
  async list(params = {}) {
    const { data } = await api.get('/prodotti', { params })
    return data
  },
  async get(id) {
    const { data } = await api.get(`/prodotti/${id}`)
    return data
  },
  async create(payload) {
    const { data } = await api.post('/prodotti', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await api.put(`/prodotti/${id}`, payload)
    return data
  },
  async remove(id) {
    const { data } = await api.delete(`/prodotti/${id}`)
    return data
  },
}

export default ProdottoService
```

**3. Registra la rotta** in [src/router/index.js](src/router/index.js), dentro i `children` di `AppLayout`:

```javascript
{
  path: 'prodotti',
  name: 'prodotti',
  component: () => import('@/views/pages/prodotti/Prodotti.vue'),
  meta: { roles: [ROLES.ADMIN] },   // opzionale
}
```

**4. Aggiungi la voce di menu** in [src/router/menu.js](src/router/menu.js):

```javascript
{ label: 'Prodotti', icon: 'pi pi-fw pi-box', to: '/prodotti', roles: [ROLES.ADMIN] }
```

Icone: [primevue.org/icons](https://primevue.org/icons), formato `pi pi-fw pi-<nome>`.

Il modello da copiare per la pagina è [Items.vue](src/views/pages/items/Items.vue): caricamento, toolbar, tabella, dialog create/edit, conferma eliminazione, toast.

---

## Autenticazione

Flusso reale:

1. `Login.vue` monta il bottone Google (Google Identity Services).
2. Il credential Google diventa una sessione Firebase (`signInWithCredential`).
3. Si chiama `GET /auth/me` con l'ID token: il backend risponde con il **profilo applicativo** (ruolo compreso).
4. Il profilo finisce nello store Pinia; la guard del router lo carica una volta sola.
5. Ogni richiesta Axios inietta un ID token fresco (Firebase li ruota ogni ora).
6. Un 401 riporta al login, tranne dove si passa `skipAuthRedirect: true`.

La guard in [src/router/index.js](src/router/index.js):

- le rotte in `PUBLIC_PATHS` passano sempre;
- senza sessione → `/auth/login?redirect=<rotta richiesta>`;
- con `meta.roles` non soddisfatto → `/auth/access`.

### Mock auth

Con `VITE_MOCK_AUTH=true` Firebase non viene inizializzato: il login mostra un select del ruolo e salva un
utente finto in `localStorage`. Serve per sviluppare l'UI senza backend e per le demo.
Il backend che ti serve per il flusso reale deve esporre `GET /auth/me` e validare l'ID token Firebase.

---

## Configurazione

Tutte le variabili sono in [.env.example](.env.example). Le principali:

| Variabile                  | Default                | Note                                              |
| -------------------------- | ---------------------- | ------------------------------------------------- |
| `VITE_APP_NAME`            | `Vue Boilerplate`      | topbar, footer, login                             |
| `VITE_API_URL`             | `/api/v1`              | baseURL di Axios                                  |
| `VITE_PROXY_TARGET`        | —                      | se valorizzato, Vite fa proxy su `/api` (no CORS) |
| `VITE_MOCK_AUTH`           | `true`                 | login finto, niente Firebase                      |
| `VITE_MOCK_API`            | `true`                 | service con dati in memoria                       |
| `VITE_FIREBASE_*`          | —                      | obbligatorie se `VITE_MOCK_AUTH=false`            |
| `VITE_GOOGLE_CLIENT_ID`    | —                      | obbligatoria se `VITE_MOCK_AUTH=false`            |

> Le `VITE_*` sono **inlinate nel bundle a build time**: sono configurazione pubblica, non segreti.
> Chiavi private e credenziali stanno sul backend.

### Passare da mock a reale

1. Metti `VITE_MOCK_AUTH=false` e `VITE_MOCK_API=false`, valorizza Firebase e il client id Google.
2. Nei service togli il ramo `if (MOCK_API)` e l'import da `./mock/`.
3. Cancella `src/services/mock/`.

---

## Deploy su Cloudflare Pages

Il progetto è una SPA statica: `npm run build` produce `dist/`, che Pages serve così com'è.

**Da CLI:**

```bash
npm run deploy      # build + wrangler pages deploy dist
```

**Da dashboard (repo collegato):**

- Build command: `npm run build`
- Build output directory: `dist`
- Variabile `NODE_VERSION` = `20`
- Le `VITE_*` vanno tra le Environment Variables del progetto Pages (servono a build time)

Due dettagli che evitano i classici problemi:

- [public/\_redirects](public/_redirects) contiene `/* /index.html 200`: senza, un refresh su `/items` dà 404.
- [wrangler.toml](wrangler.toml) dichiara `pages_build_output_dir = "dist"`.

---

## Dark mode e temi

La dark mode aggiunge `.app-dark` su `<html>` (`toggleDarkMode` in [layout.js](src/layout/composables/layout.js)),
riconosciuta sia da Tailwind (`darkMode: ['selector', '[class*="app-dark"]']`) sia da PrimeVue (`darkModeSelector`).
Il pannello palette in topbar ([AppConfigurator.vue](src/layout/AppConfigurator.vue)) permette di cambiare
preset, colore primario, superficie e modalità menu a runtime.
