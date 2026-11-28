/* ============================================================
   LIMPIAPP · Configuración compartida de la web
   Este es el ÚNICO archivo que hay que tocar para:
   - cambiar a dónde van las solicitudes de la lista de espera
   - activar los botones de la app cuando esté publicada
   ============================================================ */
window.LIMPIAPP_CONFIG = {
  /* ---------- 1. LISTA DE ESPERA ----------
     'apps-script' → hoja de cálculo de Google (funciona hoy).
     'firestore'   → base de datos Firebase (cuando Serxus confirme que
                     el proyecto Firebase es de Shineconnect). Ver docs/GUIA.md */
  waitlistProvider: 'apps-script',

  // URL de la aplicación web de Google Apps Script (ver apps-script/Code.gs)
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbxFL9Ggmj67…/exec',

  // Solo si waitlistProvider === 'firestore'
  firestore: {
    projectId: '',                          // p. ej. 'limpiapp-prod'
    apiKey: '',                             // clave web de Firebase (es pública por diseño)
    collectionProfesionales: 'waitlist_profesionales',
    collectionClientes: 'waitlist_clientes'
  },

  /* ---------- 2. LA APP ----------
     Mientras estén en null la web NO muestra "Abrir app", ni los botones de
     App Store / Google Play, ni la caja de "Instalar". Cuando la app se publique,
     rellena las URLs y aparecerán solas. */
  app: {
    openUrl: null,      // enlace universal / deep link que facilite Serxus
    iosUrl: null,       // https://apps.apple.com/...
    androidUrl: null    // https://play.google.com/store/apps/details?id=...
  },

  contactEmail: 'gerencia@limpiapp.app',
  consentVersion: '2026-05'   // sube este valor si cambias la Política de Privacidad
};
