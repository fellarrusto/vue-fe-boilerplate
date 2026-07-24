# Istruzioni per agenti AI

Regole da rispettare quando scrivi codice in questo progetto. Il README contiene il dettaglio;
qui c'è ciò che serve per non sbagliare struttura.

## Stack

Vue 3 (`<script setup>`, Composition API) · Vite · PrimeVue 4 (preset Aura) · Tailwind · Pinia ·
Vue Router 4 · Axios · Firebase Auth. Nessun TypeScript: il progetto è in JavaScript.

## Dove va il codice

| Cosa                        | Dove                                            |
| --------------------------- | ----------------------------------------------- |
| Pagina di una feature       | `src/views/pages/<feature>/<Feature>.vue`       |
| Sotto-componenti di quella  | `src/views/pages/<feature>/components/`         |
| Logica riusabile di quella  | `src/views/pages/<feature>/composables/`        |
| Componenti davvero globali  | `src/components/`                               |
| Chiamate API                | `src/services/<Entita>Service.js`               |
| Stato condiviso             | `src/stores/<nome>.js` (Pinia setup store)      |
| Variabili d'ambiente        | solo `src/config/index.js`                      |
| Rotte                       | `src/router/index.js`                           |
| Voci di menu                | `src/router/menu.js`                            |

## Regole non negoziabili

1. **Una feature = una cartella self-contained.** Non spargere i pezzi di una feature in cartelle globali.
2. **HTTP solo nei service.** Un componente non importa mai `axios`; importa il service.
3. **I service non fanno `try/catch`.** Rilanciano; la pagina cattura e mostra il toast.
4. **I service ritornano `response.data`**, mai la response intera. Metodi: `list`, `get`, `create`, `update`, `remove`.
5. **`import.meta.env` si legge solo in `src/config/index.js`.** Altrove importa la costante da `@/config`.
6. **La pagina orchestra.** I figli ricevono props ed emettono eventi; un dialog non chiama un service.
7. **Protezione rotte: `meta.roles`.** Il `roles` nel menu serve solo a nascondere la voce; va tenuto allineato.
8. **Non importare i componenti PrimeVue**: `unplugin-vue-components` li auto-importa (`<Button>`, `<DataTable>`, `<Dialog>`, `<Chart>`, ...).
9. **Import interni con l'alias `@/`**, mai path relativi lunghi (`../../..`).
10. **Classi Tailwind scritte per esteso.** Le stringhe interpolate (`` `bg-${color}-100` ``) vengono eliminate dal purge.

## File di riferimento da copiare

- Pagina CRUD completa → `src/views/pages/items/Items.vue`
- Dialog create/edit → `src/views/pages/items/components/ItemDialog.vue`
- Service → `src/services/ItemService.js`
- Rotta protetta da ruolo → voce `/admin` in `src/router/index.js`

## Aggiungere una pagina (checklist)

1. `src/views/pages/<feature>/<Feature>.vue`
2. `src/services/<Entita>Service.js`
3. rotta nei `children` di `AppLayout` in `src/router/index.js`
4. voce in `src/router/menu.js` (icona `pi pi-fw pi-<nome>`)
5. se serve un ruolo: stesso `roles` su rotta e voce di menu

## Convenzioni di stile

- Componenti in PascalCase, service in PascalCase con suffisso `Service`, composables `useXxx`.
- Prettier: niente punto e virgola, apici singoli, indentazione 2, larghezza 140 (`npm run format`).
- Testi UI in italiano.
- Commenti solo dove spiegano un **perché** non ovvio; niente commenti che ripetono il codice.

## Mock

`VITE_MOCK_AUTH` e `VITE_MOCK_API` fanno girare l'app senza backend. Gli adapter finti stanno in
`src/services/mock/` e sono usa e getta: quando colleghi le API vere, togli il ramo `if (MOCK_API)`
dai service e cancella la cartella. Non aggiungere logica di business nei mock.
