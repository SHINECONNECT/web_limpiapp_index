/* ============================================================
   LIMPIAPP · Envío de la lista de espera (sin contraseñas)
   Uso:  LimpiappWaitlist.submit('profesional' | 'cliente', {campos...})
         → Promise. Si falla, el error trae .code:
           'name' | 'email' | 'phone' | 'cp' | 'consent' | 'rate' | 'network' | 'server'
   El destino (Apps Script o Firestore) se elige en waitlist-config.js
   ============================================================ */
(function (global) {
  'use strict';

  var CFG = global.LIMPIAPP_CONFIG || {};
  var RATE_MS = 15000;         // intervalo mínimo entre dos envíos desde el mismo navegador
  var RATE_KEY = 'limpiapp_wl_last';

  function fail(code, msg) {
    var e = new Error(msg || code);
    e.code = code;
    return e;
  }

  function clean(value, max) {
    var s = (value == null ? '' : String(value)).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
    return s.length > max ? s.slice(0, max) : s;
  }

  function cleanMultiline(value, max) {
    var s = (value == null ? '' : String(value)).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
    return s.length > max ? s.slice(0, max) : s;
  }

  function normalizePhone(v) {
    var s = String(v || '').trim();
    return (s.charAt(0) === '+' ? '+' : '') + s.replace(/\D/g, '');
  }

  function validEmail(e) {
    return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  }

  function validPhone(p) {
    var digits = p.replace(/\D/g, '').length;
    return digits >= 7 && digits <= 15;
  }

  function validCp(cp) {
    return /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/.test(cp);   // admite códigos de cualquier país de la UE
  }

  function getRateStamp() {
    try { return Number(localStorage.getItem(RATE_KEY)) || 0; } catch (e) { return 0; }
  }

  function setRateStamp() {
    try { localStorage.setItem(RATE_KEY, String(Date.now())); } catch (e) { /* sin almacenamiento: seguimos */ }
  }

  /* Construye el objeto limpio que se enviará. Devuelve {payload} o lanza error de validación */
  function buildPayload(type, raw) {
    var isPro = type === 'profesional';
    var d = {
      tipo_formulario: isPro ? 'waitlist_profesional' : 'waitlist_cliente',
      perfil_usuario: isPro ? 'profesional' : 'cliente',
      nombre: clean(raw.nombre, 120),
      telefono: normalizePhone(raw.telefono),
      email: clean(raw.email, 254).toLowerCase(),
      pais: clean(raw.pais, 60),
      ciudad: clean(raw.ciudad, 80),
      cp: clean(raw.cp, 10).toUpperCase(),
      plan_codigo: clean(raw.plan_codigo, 30),
      idioma: clean(raw.idioma, 8) || 'es',
      source_channel: clean(raw.source_channel, 60) || 'web_limpiapp_pwa',
      pagina: clean(location.pathname, 60),
      consent_privacidad: raw.consent === true,
      consent_version: CFG.consentVersion || '2026-05',
      consent_fecha: new Date().toISOString()
    };

    if (isPro) {
      var tarifa = Number(String(raw.tarifa).replace(',', '.'));
      d.tarifa = isFinite(tarifa) ? Math.round(tarifa * 100) / 100 : null;
      d.experiencia = clean(raw.experiencia, 40);
      d.plan = clean(raw.plan, 60);
      d.alertas = raw.alertas === true;
    } else {
      d.servicio = clean(raw.servicio, 80);
      d.formula = clean(raw.formula, 80);
      d.detalles = cleanMultiline(raw.detalles, 1000);
    }

    if (d.nombre.length < 2) throw fail('name');
    if (!validEmail(d.email)) throw fail('email');
    if (!validPhone(d.telefono)) throw fail('phone');
    if (!validCp(d.cp)) throw fail('cp');
    if (!d.consent_privacidad) throw fail('consent');
    if (isPro && (d.tarifa === null || d.tarifa < 5 || d.tarifa > 200)) throw fail('server', 'tarifa');
    return d;
  }

  /* ---------- Destino 1: Google Apps Script ---------- */
  function sendAppsScript(payload) {
    if (!CFG.appsScriptUrl) return Promise.reject(fail('server', 'appsScriptUrl no configurada'));
    var body = new URLSearchParams();
    Object.keys(payload).forEach(function (k) {
      if (payload[k] !== null && payload[k] !== '') body.append(k, String(payload[k]));
    });
    body.append('rgpd', 'Aceptado');   // compatibilidad con el script anterior
    // mode:'no-cors' → la respuesta es opaca; si no hay error de red damos el envío por bueno.
    return fetch(CFG.appsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: body.toString()
    }).then(function () { return { ok: true }; }, function () { throw fail('network'); });
  }

  /* ---------- Destino 2: Firestore (REST, sin SDK) ---------- */
  function toFsValue(v) {
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    return { stringValue: String(v) };
  }

  function sendFirestore(type, payload) {
    var fs = CFG.firestore || {};
    if (!fs.projectId || !fs.apiKey) return Promise.reject(fail('server', 'Firestore sin configurar'));
    var collection = type === 'profesional' ? fs.collectionProfesionales : fs.collectionClientes;
    var fields = {};
    Object.keys(payload).forEach(function (k) {
      if (payload[k] !== null && payload[k] !== '') fields[k] = toFsValue(payload[k]);
    });
    var url = 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(fs.projectId) +
      '/databases/(default)/documents/' + encodeURIComponent(collection) + '?key=' + encodeURIComponent(fs.apiKey);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fields })
    }).then(function (res) {
      if (!res.ok) throw fail('server', 'HTTP ' + res.status);
      return { ok: true };
    }, function () { throw fail('network'); });
  }

  /* ---------- API pública ---------- */
  function submit(type, raw, honeypotValue) {
    var payload;
    try {
      payload = buildPayload(type, raw || {});
    } catch (e) {
      return Promise.reject(e);
    }

    // Antispam silencioso: si el campo trampa (honeypot) viene relleno, es un bot:
    // respondemos "ok" sin enviar nada. Una persona nunca ve ni rellena ese campo.
    if (honeypotValue && String(honeypotValue).trim() !== '') {
      return new Promise(function (resolve) { setTimeout(function () { resolve({ ok: true, skipped: true }); }, 800); });
    }

    if (Date.now() - getRateStamp() < RATE_MS) return Promise.reject(fail('rate'));

    var send = (CFG.waitlistProvider === 'firestore') ? sendFirestore(type, payload) : sendAppsScript(payload);
    return send.then(function (r) { setRateStamp(); return r; });
  }

  global.LimpiappWaitlist = { submit: submit, _buildPayload: buildPayload };
})(window);
