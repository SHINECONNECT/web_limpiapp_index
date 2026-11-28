# LIMPIAPP · web (limpiapp.app)

Web estática (HTML + JS, sin compilar) desplegada en Vercel. Funciona como **lista de espera sin contraseñas**
mientras se construye la app (Firebase, Serxus).

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Portada |
| `clientes.html` / `registro.html` | Lista de espera de clientes / profesionales |
| `login.html` | Aviso "acceso próximamente" (no hay cuentas todavía) |
| `waitlist-config.js` | **Único archivo que tocas** para cambiar el destino de los datos o activar los botones de la app |
| `waitlist.js`, `waitlist-i18n.js` | Validación, antispam, envío y textos compartidos |
| `apps-script/Code.gs` | Código del receptor en Google Apps Script (hoja privada) |
| `firebase/firestore.waitlist.rules` | Reglas de seguridad para cuando se migre a Firestore |
| `manifest.json`, `service-worker.js`, `offline.html`, `icons/` | PWA |
| `vercel.json` | Cabeceras de seguridad y caché |
| `scripts/make-assets.py` | Regenera logos e iconos desde `branding/logo-original.png` |

Guía completa de puesta en marcha: **[docs/GUIA.md](docs/GUIA.md)**.
