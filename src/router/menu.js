import { ROLES } from '@/config'

/**
 * Voci della sidebar. Ogni voce che ha `roles` viene nascosta a chi non li ha
 * (il filtro sta in AppMenu.vue) — la protezione vera resta `meta.roles` sulla rotta.
 *
 * Forma di una voce:
 *   { label, icon: 'pi pi-fw pi-<nome>', to, roles?: [], items?: [] }
 * Icone disponibili: https://primevue.org/icons
 */
export const rawMenuModel = [
  {
    label: 'Principale',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
      { label: 'Items', icon: 'pi pi-fw pi-list', to: '/items' },
    ],
  },
  {
    label: 'Amministrazione',
    items: [{ label: 'Utenti', icon: 'pi pi-fw pi-users', to: '/admin', roles: [ROLES.ADMIN] }],
  },
  {
    label: 'Esempi',
    items: [{ label: 'Pagina vuota', icon: 'pi pi-fw pi-file', to: '/empty' }],
  },
]
