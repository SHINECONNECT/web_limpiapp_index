(function() {
  const STORAGE_KEY = 'limpiapp_cookie_consent_v1';

  const textos = {
    es: {
      titulo: 'Uso de Cookies y Privacidad (RGPD / LSSI-CE)',
      desc: 'En <strong>LIMPIAPP</strong> (operada por Shineconnect S.L.) utilizamos cookies propias técnicas necesarias para el funcionamiento y traducción de la plataforma, así como cookies opcionales de análisis y personalización. Puedes aceptar todas las cookies, rechazar las opcionales o configurar tus preferencias. Consulta nuestra <a href="cookies.html?lang=es">Política de Cookies</a>.',
      btnRechazar: 'Rechazar todas',
      btnConfig: 'Configurar',
      btnAceptar: 'Aceptar todas',
      modalTitulo: 'Configuración de Preferencias de Cookies',
      catTecTitle: 'Cookies Técnicas (Estrictamente Necesarias)',
      catTecBadge: 'Siempre activas',
      catTecDesc: 'Imprescindibles para la navegación, seguridad de sesión, pasarela Stripe y selección de idioma.',
      catAnaTitle: 'Cookies de Análisis y Medición',
      catAnaDesc: 'Nos permiten medir el tráfico y mejorar el rendimiento técnico de la plataforma de forma agregada.',
      catMktTitle: 'Cookies de Personalización y Marketing',
      catMktDesc: 'Permiten recordar preferencias avanzadas de búsqueda por código postal y mostrar comunicaciones relevantes.',
      btnGuardar: 'Guardar preferencias'
    },
    ca: {
      titulo: 'Ús de Galetes i Privacitat (RGPD / LSSI-CE)',
      desc: 'A <strong>LIMPIAPP</strong> (operada per Shineconnect S.L.) utilitzem galetes pròpies tècniques necessàries per al funcionament i traducció de la plataforma, així com galetes opcionals d’anàlisi i personalització. Pots acceptar-les totes, rebutjar les opcionals o configurar les teues preferències. Consulta la nostra <a href="cookies.html?lang=ca">Política de Galetes</a>.',
      btnRechazar: 'Rebutjar-les totes',
      btnConfig: 'Configurar',
      btnAceptar: 'Acceptar-les totes',
      modalTitulo: 'Configuració de Preferències de Galetes',
      catTecTitle: 'Galetes Tècniques (Estrictament Necessàries)',
      catTecBadge: 'Sempre actives',
      catTecDesc: 'Imprescindibles per a la navegació, seguretat de sessió, passarel·la Stripe i selecció d’idioma.',
      catAnaTitle: 'Galetes d’Anàlisi i Mesurament',
      catAnaDesc: 'Ens permeten mesurar el trànsit i millorar el rendiment tècnic de la plataforma de manera agregada.',
      catMktTitle: 'Galetes de Personalització i Màrqueting',
      catMktDesc: 'Permeten recordar preferències avançades de cerca per codi postal i mostrar comunicacions rellevants.',
      btnGuardar: 'Guardar preferències'
    },
    en: {
      titulo: 'Cookie Usage & Privacy (GDPR / ePrivacy)',
      desc: 'At <strong>LIMPIAPP</strong> (operated by Shineconnect S.L.), we use strictly necessary technical cookies for platform functionality and language settings, as well as optional analytics and personalization cookies. You can accept all, reject optional cookies, or customize your preferences. Read our <a href="cookies.html?lang=en">Cookie Policy</a>.',
      btnRechazar: 'Reject all',
      btnConfig: 'Customize',
      btnAceptar: 'Accept all',
      modalTitulo: 'Cookie Preferences Settings',
      catTecTitle: 'Technical Cookies (Strictly Necessary)',
      catTecBadge: 'Always active',
      catTecDesc: 'Essential for navigation, session security, Stripe payment processing, and language selection.',
      catAnaTitle: 'Analytics & Measurement Cookies',
      catAnaDesc: 'Allow us to measure traffic and improve technical performance in an aggregated manner.',
      catMktTitle: 'Personalization & Marketing Cookies',
      catMktDesc: 'Remember advanced postal code search preferences and display relevant communications.',
      btnGuardar: 'Save preferences'
    },
    fr: {
      titulo: 'Utilisation des Cookies et Confidentialité (RGPD)',
      desc: 'Sur <strong>LIMPIAPP</strong> (opéré par Shineconnect S.L.), nous utilisons des cookies techniques strictement nécessaires au fonctionnement et à la traduction, ainsi que des cookies optionnels d’analyse. Vous pouvez tout accepter, tout refuser ou personnaliser vos choix. Consultez notre <a href="cookies.html?lang=fr">Politique de Cookies</a>.',
      btnRechazar: 'Tout refuser',
      btnConfig: 'Personnaliser',
      btnAceptar: 'Tout accepter',
      modalTitulo: 'Paramètres des Cookies',
      catTecTitle: 'Cookies Techniques (Strictement Nécessaires)',
      catTecBadge: 'Toujours actifs',
      catTecDesc: 'Indispensables à la navigation, à la sécurité de session, au paiement Stripe et à la langue.',
      catAnaTitle: 'Cookies d’Analyse et de Mesure',
      catAnaDesc: 'Permettent de mesurer l’audience et d’améliorer les performances techniques de la plateforme.',
      catMktTitle: 'Cookies de Personnalisation et Marketing',
      catMktDesc: 'Mémorisent vos préférences de recherche par code postal.',
      btnGuardar: 'Enregistrer mes choix'
    },
    de: {
      titulo: 'Cookie-Nutzung & Datenschutz (DSGVO)',
      desc: 'Auf <strong>LIMPIAPP</strong> (betrieben von Shineconnect S.L.) verwenden wir technisch notwendige Cookies für den Betrieb und die Sprachauswahl sowie optionale Analyse-Cookies. Sie können alle akzeptieren, optionale ablehnen oder Ihre Einstellungen anpassen. Lesen Sie unsere <a href="cookies.html?lang=de">Cookie-Richtlinie</a>.',
      btnRechazar: 'Alle ablehnen',
      btnConfig: 'Einstellungen',
      btnAceptar: 'Alle akzeptieren',
      modalTitulo: 'Cookie-Einstellungen',
      catTecTitle: 'Technische Cookies (Unbedingt erforderlich)',
      catTecBadge: 'Immer aktiv',
      catTecDesc: 'Erforderlich für Navigation, Sitzungssicherheit, Stripe-Zahlungen und Sprachauswahl.',
      catAnaTitle: 'Analyse- und Mess-Cookies',
      catAnaDesc: 'Ermöglichen die statistische Auswertung zur technischen Verbesserung der Plattform.',
      catMktTitle: 'Personalisierungs- und Marketing-Cookies',
      catMktDesc: 'Speichern erweiterte Suchpräferenzen nach Postleitzahl.',
      btnGuardar: 'Auswahl speichern'
    },
    it: {
      titulo: 'Uso dei Cookie e Privacy (GDPR)',
      desc: 'Su <strong>LIMPIAPP</strong> (gestito da Shineconnect S.L.) utilizziamo cookie tecnici strettamente necessari per il funzionamento e la lingua, oltre a cookie opzionali di analisi. Puoi accettare tutti i cookie, rifiutare quelli opzionali o personalizzare le scelte. Consulta la <a href="cookies.html?lang=it">Cookie Policy</a>.',
      btnRechazar: 'Rifiuta tutti',
      btnConfig: 'Personalizza',
      btnAceptar: 'Accetta tutti',
      modalTitulo: 'Impostazioni Preferenze Cookie',
      catTecTitle: 'Cookie Tecnici (Strettamente Necessari)',
      catTecBadge: 'Sempre attivi',
      catTecDesc: 'Essenziali per la navigazione, la sicurezza, i pagamenti Stripe e la selezione della lingua.',
      catAnaTitle: 'Cookie di Analisi e Misurazione',
      catAnaDesc: 'Consentono di misurare il traffico e migliorare le prestazioni tecniche della piattaforma.',
      catMktTitle: 'Cookie di Personalizzazione e Marketing',
      catMktDesc: 'Memorizzano le preferenze di ricerca per codice postale.',
      btnGuardar: 'Salva preferenze'
    },
    pt: {
      titulo: 'Utilização de Cookies e Privacidade (RGPD)',
      desc: 'Na <strong>LIMPIAPP</strong> (operada pela Shineconnect S.L.), utilizamos cookies técnicos estritamente necessários para o funcionamento e idioma, bem como cookies opcionais de análise. Pode aceitar todos, rejeitar os opcionais ou configurar as suas preferências. Consulte a <a href="cookies.html?lang=pt">Política de Cookies</a>.',
      btnRechazar: 'Rejeitar todos',
      btnConfig: 'Configurar',
      btnAceptar: 'Aceitar todos',
      modalTitulo: 'Configuração de Preferências de Cookies',
      catTecTitle: 'Cookies Técnicos (Estritamente Necessários)',
      catTecBadge: 'Sempre ativos',
      catTecDesc: 'Essenciais para a navegação, segurança de sessão, pagamentos Stripe e seleção de idioma.',
      catAnaTitle: 'Cookies de Análise e Medição',
      catAnaDesc: 'Permitem medir o tráfego e melhorar o desempenho técnico da plataforma.',
      catMktTitle: 'Cookies de Personalização e Marketing',
      catMktDesc: 'Guardam preferências avançadas de pesquisa por código postal.',
      btnGuardar: 'Guardar preferências'
    },
    gl: {
      titulo: 'Uso de Cookies e Privacidade (RXPD / LSSI-CE)',
      desc: 'En <strong>LIMPIAPP</strong> (operada por Shineconnect S.L.) empregamos cookies técnicas necesarias para o funcionamento e tradución da plataforma, así como cookies opcionais de análise. Podes aceptalas todas, rexeitar as opcionais ou configurar as túas preferencias. Consulta a <a href="cookies.html?lang=gl">Política de Cookies</a>.',
      btnRechazar: 'Rexeitar todas',
      btnConfig: 'Configurar',
      btnAceptar: 'Aceptar todas',
      modalTitulo: 'Configuración de Preferencias de Cookies',
      catTecTitle: 'Cookies Técnicas (Estritamente Necesarias)',
      catTecBadge: 'Sempre activas',
      catTecDesc: 'Imprescindibles para a navegación, seguridade de sesión, pasarela Stripe e selección de idioma.',
      catAnaTitle: 'Cookies de Análise e Medición',
      catAnaDesc: 'Permítennos medir o tráfico e mellorar o rendemento técnico da plataforma.',
      catMktTitle: 'Cookies de Personalización e Marketing',
      catMktDesc: 'Permiten lembrar preferencias avanzadas de busca por código postal.',
      btnGuardar: 'Gardar preferencias'
    },
    eu: {
      titulo: 'Cookien Erabilera eta Pribatutasuna (DBEO)',
      desc: '<strong>LIMPIAPP</strong>-en (Shineconnect S.L.-k kudeatua) plataformaren funtzionamendurako beharrezkoak diren cookie teknikoak eta aukerako analisi-cookieak erabiltzen ditugu. Guztiak onartu, aukerakoak baztertu edo zure hobespenak konfigura ditzakezu. Ikusi gure <a href="cookies.html?lang=eu">Cookie Politika</a>.',
      btnRechazar: 'Guztiak baztertu',
      btnConfig: 'Konfiguratu',
      btnAceptar: 'Guztiak onartu',
      modalTitulo: 'Cookie Hobespenen Konfigurazioa',
      catTecTitle: 'Cookie Teknikoak (Behar-beharrezkoak)',
      catTecBadge: 'Beti aktibo',
      catTecDesc: 'Nabigaziorako, saioaren segurtasunerako, Stripe ordainketetarako eta hizkuntza aukeratzeko ezinbestekoak.',
      catAnaTitle: 'Analisi eta Neurketa Cookieak',
      catAnaDesc: 'Trafikoa neurtzeko eta plataformaren errendimendu teknikoa hobetzeko aukera ematen dute.',
      catMktTitle: 'Pertsonalizazio eta Marketin Cookieak',
      catMktDesc: 'Posta-kode bidezko bilaketa-hobespen aurreratuak gordetzen dituzte.',
      btnGuardar: 'Hobespenak gorde'
    }
  };

  function getLang() {
    const p = new URLSearchParams(window.location.search).get('lang');
    const l = p || localStorage.getItem('limpiapp_lang') || 'es';
    return textos[l] ? l : 'es';
  }

  function injectStyles() {
    if (document.getElementById('limpiapp-cookie-styles')) return;
    const style = document.createElement('style');
    style.id = 'limpiapp-cookie-styles';
    style.textContent = `
      #lmp-cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #ffffff;
        border-top: 2px solid #7faecb;
        box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.14);
        z-index: 99998;
        padding: 20px 24px;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        color: #24292d;
      }
      .lmp-cookie-inner {
        max-width: 1120px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }
      .lmp-cookie-text {
        flex: 1 1 540px;
      }
      .lmp-cookie-title {
        font-size: 15.5px;
        font-weight: 800;
        color: #24292d;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .lmp-cookie-desc {
        font-size: 13.5px;
        color: #475259;
        line-height: 1.5;
        margin: 0;
      }
      .lmp-cookie-desc a {
        color: #3b7b9e;
        font-weight: 700;
        text-decoration: underline;
      }
      /* SIMETRÍA ESTRICTA AEPD: MISMO TAMAÑO, ALTURA Y PESO VISUAL PARA ACEPTAR Y RECHAZAR */
      .lmp-cookie-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }
      .lmp-btn-cookie {
        min-width: 142px;
        height: 44px;
        padding: 0 18px;
        border-radius: 8px;
        font-size: 13.5px;
        font-weight: 700;
        cursor: pointer;
        border: 1.5px solid #4f585d;
        transition: all 0.2s ease;
        text-align: center;
      }
      .lmp-btn-reject,
      .lmp-btn-accept {
        background: #4f585d;
        color: #ffffff;
        border-color: #4f585d;
      }
      .lmp-btn-reject:hover,
      .lmp-btn-accept:hover {
        background: #373e42;
        border-color: #373e42;
      }
      .lmp-btn-config {
        background: #ffffff;
        color: #4f585d;
        border-color: #cbd5e1;
      }
      .lmp-btn-config:hover {
        background: #f1f5f9;
        border-color: #4f585d;
      }

      /* MODAL CONFIGURACIÓN GRANULAR */
      #lmp-cookie-modal {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(36, 41, 45, 0.65);
        z-index: 99999;
        align-items: center;
        justify-content: center;
        padding: 16px;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      .lmp-modal-card {
        background: #ffffff;
        max-width: 540px;
        width: 100%;
        border-radius: 16px;
        border: 1.5px solid #d4dfe6;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
        overflow: hidden;
      }
      .lmp-modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .lmp-modal-header h3 {
        font-size: 17px;
        font-weight: 800;
        color: #24292d;
        margin: 0;
      }
      .lmp-modal-close {
        background: none;
        border: none;
        font-size: 22px;
        color: #64748b;
        cursor: pointer;
        line-height: 1;
      }
      .lmp-modal-body {
        padding: 20px 24px;
        max-height: 65vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .lmp-cat-item {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 14px 16px;
        background: #f8fafc;
      }
      .lmp-cat-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;
      }
      .lmp-cat-title {
        font-size: 14px;
        font-weight: 700;
        color: #24292d;
      }
      .lmp-cat-badge {
        font-size: 11.5px;
        font-weight: 700;
        background: #eef6fa;
        color: #2b6cb0;
        padding: 3px 10px;
        border-radius: 12px;
      }
      .lmp-cat-desc {
        font-size: 12.5px;
        color: #475259;
        line-height: 1.45;
        margin: 0;
      }
      .lmp-modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 10px;
        background: #ffffff;
      }

      @media (max-width: 640px) {
        #lmp-cookie-banner {
          padding: 16px;
        }
        .lmp-cookie-actions {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .lmp-btn-config {
          grid-column: span 2;
        }
        .lmp-btn-cookie {
          min-width: 0;
          width: 100%;
          font-size: 13px;
        }
        .lmp-modal-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .lmp-btn-save-full {
          grid-column: span 2;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function saveConsent(prefs) {
    const record = {
      tecnicas: true,
      analiticas: !!prefs.analiticas,
      marketing: !!prefs.marketing,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) {}

    // Si el usuario rechaza analíticas/marketing, limpiar posibles cookies no técnicas
    if (!record.analiticas || !record.marketing) {
      const cookiesToClear = ['_ga', '_gid', '_gat', '_fbp'];
      const host = window.location.hostname;
      cookiesToClear.forEach(name => {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        if (host) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + host.replace(/^www\./, '') + ';';
        }
      });
    }

    const banner = document.getElementById('lmp-cookie-banner');
    const modal = document.getElementById('lmp-cookie-modal');
    if (banner) banner.style.display = 'none';
    if (modal) modal.style.display = 'none';
  }

  function buildUI() {
    injectStyles();
    const lang = getLang();
    const t = textos[lang] || textos.es;

    // 1. Banner de primera capa
    const banner = document.createElement('div');
    banner.id = 'lmp-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', t.titulo);
    banner.innerHTML = `
      <div class="lmp-cookie-inner">
        <div class="lmp-cookie-text">
          <div class="lmp-cookie-title">🍪 ${t.titulo}</div>
          <p class="lmp-cookie-desc">${t.desc}</p>
        </div>
        <div class="lmp-cookie-actions">
          <button type="button" class="lmp-btn-cookie lmp-btn-reject" id="lmpBtnRejectAll">${t.btnRechazar}</button>
          <button type="button" class="lmp-btn-cookie lmp-btn-config" id="lmpBtnOpenConfig">${t.btnConfig}</button>
          <button type="button" class="lmp-btn-cookie lmp-btn-accept" id="lmpBtnAcceptAll">${t.btnAceptar}</button>
        </div>
      </div>
    `;

    // 2. Modal de segunda capa (configuración granular)
    const modal = document.createElement('div');
    modal.id = 'lmp-cookie-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="lmp-modal-card">
        <div class="lmp-modal-header">
          <h3>🍪 ${t.modalTitulo}</h3>
          <button type="button" class="lmp-modal-close" id="lmpModalClose" aria-label="Cerrar">&times;</button>
        </div>
        <div class="lmp-modal-body">
          <div class="lmp-cat-item">
            <div class="lmp-cat-top">
              <span class="lmp-cat-title">${t.catTecTitle}</span>
              <span class="lmp-cat-badge">${t.catTecBadge}</span>
            </div>
            <p class="lmp-cat-desc">${t.catTecDesc}</p>
          </div>
          <div class="lmp-cat-item">
            <div class="lmp-cat-top">
              <label class="lmp-cat-title" for="lmpChkAna" style="cursor:pointer;">${t.catAnaTitle}</label>
              <input type="checkbox" id="lmpChkAna" style="width:18px;height:18px;accent-color:#4f585d;cursor:pointer;">
            </div>
            <p class="lmp-cat-desc">${t.catAnaDesc}</p>
          </div>
          <div class="lmp-cat-item">
            <div class="lmp-cat-top">
              <label class="lmp-cat-title" for="lmpChkMkt" style="cursor:pointer;">${t.catMktTitle}</label>
              <input type="checkbox" id="lmpChkMkt" style="width:18px;height:18px;accent-color:#4f585d;cursor:pointer;">
            </div>
            <p class="lmp-cat-desc">${t.catMktDesc}</p>
          </div>
        </div>
        <div class="lmp-modal-footer">
          <button type="button" class="lmp-btn-cookie lmp-btn-reject" id="lmpModalReject">${t.btnRechazar}</button>
          <button type="button" class="lmp-btn-cookie lmp-btn-accept" id="lmpModalAccept">${t.btnAceptar}</button>
          <button type="button" class="lmp-btn-cookie lmp-btn-config lmp-btn-save-full" id="lmpModalSave">${t.btnGuardar}</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    // Eventos
    document.getElementById('lmpBtnRejectAll').onclick = () => saveConsent({ analiticas: false, marketing: false });
    document.getElementById('lmpBtnAcceptAll').onclick = () => saveConsent({ analiticas: true, marketing: true });
    document.getElementById('lmpBtnOpenConfig').onclick = () => {
      modal.style.display = 'flex';
    };

    document.getElementById('lmpModalClose').onclick = () => {
      modal.style.display = 'none';
    };
    document.getElementById('lmpModalReject').onclick = () => saveConsent({ analiticas: false, marketing: false });
    document.getElementById('lmpModalAccept').onclick = () => saveConsent({ analiticas: true, marketing: true });
    document.getElementById('lmpModalSave').onclick = () => {
      saveConsent({
        analiticas: document.getElementById('lmpChkAna').checked,
        marketing: document.getElementById('lmpChkMkt').checked
      });
    };

    // Comprobar si ya existe decisión previa
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        banner.style.display = 'none';
        const parsed = JSON.parse(saved);
        document.getElementById('lmpChkAna').checked = !!parsed.analiticas;
        document.getElementById('lmpChkMkt').checked = !!parsed.marketing;
      }
    } catch (e) {}
  }

  // Función global para reabrir el panel desde el pie de página (Revocación RGPD)
  window.abrirConfiguracionCookies = function() {
    const modal = document.getElementById('lmp-cookie-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
