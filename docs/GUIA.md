# Guía de puesta en marcha

## 1. Subir a GitHub / Vercel
1. Sustituye el contenido del repositorio `web_limpiapp_index` por el de esta carpeta (o sube los archivos desde GitHub → *Add file → Upload files*).
2. Vercel despliega solo. No hay que configurar nada más (no hay *build*).
3. Prueba en `https://limpiapp.app`: portada, `clientes.html`, `registro.html`, `login.html`.

## 2. Crear el receptor de datos (Google Apps Script) — IMPORTANTE
La URL que había en el código pertenece a un despliegue **antiguo que guardaba contraseñas**. Hay que sustituirlo:
1. Crea una hoja de Google nueva con la cuenta de Shineconnect y déjala **privada**.
2. *Extensiones → Apps Script* → pega `apps-script/Code.gs` → ejecuta `configurarHoja` → *Implementar → Aplicación web* (ejecutar como "Yo", acceso "Cualquier usuario").
3. Copia la URL `/exec` en `waitlist-config.js` (`appsScriptUrl`) y sube el cambio.
4. **Desactiva el despliegue antiguo** y **borra o cambia las contraseñas** que ya estén guardadas en la hoja "Cuentas" (y avisa a esas personas de que cambien la contraseña si la usan en otros sitios).

## 3. Cuando la app exista
En `waitlist-config.js`:
- `app.openUrl` → aparece el botón "Abrir la app" y desaparece el aviso "próximamente".
- `app.iosUrl` / `app.androidUrl` → aparecen las insignias de App Store / Google Play.

## 4. Migrar la lista de espera a Firebase (Firestore)
1. En la consola de Firebase (proyecto **propiedad de Shineconnect**, no del desarrollador) crea Firestore.
2. Pega `firebase/firestore.waitlist.rules` en *Firestore → Reglas* (solo permite crear solicitudes válidas; nadie puede leerlas desde la web).
3. Rellena `firestore.projectId` y `firestore.apiKey` en `waitlist-config.js` y cambia `waitlistProvider` a `'firestore'`.
4. Importa las filas de la hoja de Google a Firestore si quieres conservarlas.

## 5. Qué preguntar a Serxus
- ¿La app usará **Firebase Auth** (cuentas) y **Firestore** (datos), o solo parte?
- ¿El proyecto de Firebase está a nombre de Shineconnect y tú eres propietaria?
- ¿Qué URL/deep link tendrá la app y cuándo habrá enlaces de tienda?
- ¿Cómo se invitará a la lista de espera a crear cuenta (enlace por correo)?

## 6. Logo e iconos
Sustituye `branding/logo-original.png` y ejecuta `python3 scripts/make-assets.py`. Ojo: esa carpeta es pública en la web.

## 7. Pendiente de revisión por un abogado (no se ha reescrito el texto legal)
- Privacidad: afirmaciones de cifrado AES-256 y 2FA (¿existen hoy?).
- Portada: porcentajes comparativos con otras plataformas, "100 % verificados" / "Verificación real", y textos "Verified cleaning professionals".
- Precios: "Alta gratuita" frente a 7,99 €/mes, IVA incluido o no, cupo "pionero 50 registros" y condiciones de la promoción.
- Cookies: mencionan Stripe y analítica que aún no están en uso.
- Si se contacta con profesionales de Milanuncios y similares: deber de información del art. 14 RGPD y base legal.

## 8. Otros
- `api/account/sync-state.js` es un esqueleto que la web ya no llama; puede borrarse o reutilizarse cuando haya cuentas.
- Traducciones propias del formulario y del acceso: es, ca, gl, eu, en, fr, de, it, pt (el resto de idiomas de `registro.html` usa inglés en esos textos).
- No se ha podido probar contra el Apps Script ni Firestore reales: haz un envío de prueba tras el paso 2.
