/**
 * LIMPIAPP · Lista de espera (Google Apps Script)
 * ------------------------------------------------
 * Recibe las solicitudes de /registro.html (profesionales) y /clientes.html (clientes)
 * y las guarda en una hoja de cálculo PRIVADA con dos pestañas: "Profesionales" y "Clientes".
 *
 * ✔ No recibe ni guarda contraseñas.
 * ✔ Valida y limpia los datos en el servidor (la validación del navegador no basta).
 * ✔ Ignora bots (campo trampa) y evita duplicados (mismo correo + mismo tipo).
 *
 * PUESTA EN MARCHA (5 minutos)
 * 1. Crea una hoja de cálculo nueva en Google Drive con la cuenta de Shineconnect. Déjala PRIVADA.
 * 2. En la hoja: Extensiones → Apps Script. Pega este archivo completo.
 * 3. Arriba, selecciona la función  configurarHoja  y pulsa Ejecutar (acepta los permisos).
 *    Esto crea las pestañas y las cabeceras.
 * 4. Implementar → Nueva implementación → tipo "Aplicación web":
 *      · Ejecutar como: Yo
 *      · Quién tiene acceso: Cualquier usuario
 *    Copia la URL que termina en /exec.
 * 5. Pega esa URL en  waitlist-config.js  (appsScriptUrl) y sube el cambio a GitHub.
 * 6. Si cambias este código más adelante: Implementar → Gestionar implementaciones →
 *    editar → Nueva versión. (La URL se mantiene.)
 */

var SHEETS = {
  waitlist_profesional: {
    nombre: 'Profesionales',
    columnas: ['fecha', 'nombre', 'telefono', 'email', 'pais', 'ciudad', 'cp', 'tarifa', 'experiencia',
      'plan', 'plan_codigo', 'alertas', 'idioma', 'origen', 'consent_version', 'consent_fecha', 'estado']
  },
  waitlist_cliente: {
    nombre: 'Clientes',
    columnas: ['fecha', 'nombre', 'telefono', 'email', 'pais', 'ciudad', 'cp', 'servicio', 'formula',
      'detalles', 'plan_codigo', 'idioma', 'origen', 'consent_version', 'consent_fecha', 'estado']
  }
};

/** Pon true si quieres que el script envíe un correo de confirmación (usa la cuota diaria de Gmail). */
var ENVIAR_CONFIRMACION = false;

function configurarHoja() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEETS).forEach(function (tipo) {
    var def = SHEETS[tipo];
    var hoja = ss.getSheetByName(def.nombre) || ss.insertSheet(def.nombre);
    hoja.getRange(1, 1, 1, def.columnas.length).setValues([def.columnas]).setFontWeight('bold');
    hoja.setFrozenRows(1);
  });
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
}

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    // 1. Bots: el campo "website" está oculto; si llega relleno, se descarta en silencio
    if (p.website) return respuesta_({ status: 'success' });

    var tipo = String(p.tipo_formulario || '');
    var def = SHEETS[tipo];
    if (!def) return respuesta_({ status: 'error', message: 'tipo' });

    // 2. Limpieza y validación
    var d = {
      nombre: limpiar_(p.nombre, 120),
      telefono: String(p.telefono || '').replace(/[^\d+]/g, '').slice(0, 20),
      email: limpiar_(p.email, 254).toLowerCase(),
      pais: limpiar_(p.pais, 60),
      ciudad: limpiar_(p.ciudad, 80),
      cp: limpiar_(p.cp, 10).toUpperCase(),
      tarifa: limpiar_(p.tarifa, 8),
      experiencia: limpiar_(p.experiencia, 40),
      plan: limpiar_(p.plan, 60),
      plan_codigo: limpiar_(p.plan_codigo, 30),
      alertas: p.alertas === 'true' ? 'Sí' : 'No',
      servicio: limpiar_(p.servicio, 80),
      formula: limpiar_(p.formula, 80),
      detalles: limpiar_(p.detalles, 1000),
      idioma: limpiar_(p.idioma, 8),
      origen: limpiar_(p.source_channel, 60),
      consent_version: limpiar_(p.consent_version, 12),
      consent_fecha: limpiar_(p.consent_fecha, 30)
    };

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email);
    var telDigitos = d.telefono.replace(/\D/g, '').length;
    if (d.nombre.length < 2 || !emailOk || telDigitos < 7 || telDigitos > 15) {
      return respuesta_({ status: 'error', message: 'datos' });
    }
    if (p.consent_privacidad !== 'true') return respuesta_({ status: 'error', message: 'consentimiento' });

    // Evita que una celda se interprete como fórmula (inyección de fórmulas en Sheets)
    Object.keys(d).forEach(function (k) { d[k] = neutralizarFormula_(d[k]); });

    // 3. Guardar con bloqueo para que dos envíos simultáneos no se pisen
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
      var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
      var hoja = ss.getSheetByName(def.nombre);
      if (!hoja) return respuesta_({ status: 'error', message: 'hoja' });

      // Duplicado: mismo correo ya registrado en esta pestaña → no se vuelve a añadir
      var colEmail = def.columnas.indexOf('email') + 1;
      var ultima = hoja.getLastRow();
      if (ultima > 1) {
        var correos = hoja.getRange(2, colEmail, ultima - 1, 1).getValues();
        for (var i = 0; i < correos.length; i++) {
          if (String(correos[i][0]).toLowerCase() === d.email) return respuesta_({ status: 'success', duplicado: true });
        }
      }

      var fila = def.columnas.map(function (col) {
        if (col === 'fecha') return new Date();
        if (col === 'estado') return 'pendiente';
        return d[col] !== undefined ? d[col] : '';
      });
      hoja.appendRow(fila);
    } finally {
      lock.releaseLock();
    }

    if (ENVIAR_CONFIRMACION) enviarConfirmacion_(d, tipo);
    return respuesta_({ status: 'success' });
  } catch (err) {
    return respuesta_({ status: 'error', message: 'interno' });
  }
}

/** Abrir la URL /exec en el navegador solo muestra que el servicio está vivo. */
function doGet() {
  return respuesta_({ status: 'ok', servicio: 'limpiapp-waitlist' });
}

function limpiar_(v, max) {
  var s = (v == null ? '' : String(v)).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ').trim();
  return s.length > max ? s.slice(0, max) : s;
}

function neutralizarFormula_(s) {
  return /^[=+\-@]/.test(s) && !/^\+\d[\d\s]*$/.test(s) ? "'" + s : s;
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function enviarConfirmacion_(d, tipo) {
  var esPro = tipo === 'waitlist_profesional';
  MailApp.sendEmail({
    to: d.email,
    subject: 'LIMPIAPP: hemos recibido tu solicitud',
    body: 'Hola ' + d.nombre + ',\n\n' +
      'Hemos recibido tu solicitud para ' + (esPro ? 'unirte como profesional a' : 'usar') + ' LIMPIAPP. ' +
      'Te avisaremos cuando abramos en tu zona. Hasta entonces no se realiza ningún cobro.\n\n' +
      'Puedes pedir que borremos tus datos escribiendo a gerencia@limpiapp.app.\n\n' +
      'Shineconnect S.L. · LIMPIAPP'
  });
}
