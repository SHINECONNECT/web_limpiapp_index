// /api/account/sync-state.js
const VALID_PLANS = {
  cliente_basico: { role: 'client', priceEur: 7.99, monthlyContactLimit: 3 },
  cliente_premium: { role: 'client', priceEur: 14.99, monthlyContactLimit: null },
  pro_basico: { role: 'professional', priceEur: 7.99, monthlyContactLimit: 2 },
  pro_premium: { role: 'professional', priceEur: 14.99, monthlyContactLimit: null }
};

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return acc;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    acc[key] = val;
    return acc;
  }, {});
}

// Sustituir estas funciones auxiliares por tu consulta real a base de datos / sesión
async function resolveAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = bearerToken || cookies.limpiapp_session || null;

  if (!sessionToken) return null;

  // Ejemplo orientativo: validar sessionToken en tu BD o store de sesiones
  // const session = await db.sessions.findByToken(sessionToken);
  // if (!session || session.expiresAt < Date.now()) return null;
  // return await db.users.findById(session.userId);
  return null;
}

async function getSubscriptionAndUsage(userId) {
  // Ejemplo orientativo: leer suscripción única (Stripe / tienda móvil) y contador mensual
  // const sub = await db.subscriptions.findActiveByUserId(userId);
  // const usage = await db.monthlyUsage.findCurrentMonth(userId);
  return {
    activePlanCode: null,
    subscriptionStatus: 'none', // 'active' | 'trialing' | 'past_due' | 'canceled' | 'none'
    billingSource: 'stripe_web', // 'stripe_web' | 'apple_iap' | 'google_play' | 'promo_quota'
    contactsUsedThisMonth: 0,
    migratedToApp: false
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Vary', 'Cookie, Authorization');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await resolveAuthenticatedUser(req);

    if (!user) {
      return res.status(200).json({
        authenticated: false,
        userId: null,
        role: null,
        activePlanCode: null,
        subscriptionStatus: 'none',
        billingSource: null,
        contactsUsedThisMonth: 0,
        monthlyContactLimit: null,
        migratedToApp: false
      });
    }

    const state = await getSubscriptionAndUsage(user.id);
    const planMeta = state.activePlanCode ? VALID_PLANS[state.activePlanCode] : null;
    const contactsUsed = Number(state.contactsUsedThisMonth || 0);
    const contactLimit = planMeta ? planMeta.monthlyContactLimit : null;
    const remainingContacts =
      typeof contactLimit === 'number' ? Math.max(0, contactLimit - contactsUsed) : null;

    return res.status(200).json({
      authenticated: true,
      userId: user.id,
      role: user.role || (planMeta ? planMeta.role : null),
      activePlanCode: state.activePlanCode || null,
      subscriptionStatus: state.subscriptionStatus || 'none',
      billingSource: state.billingSource || 'stripe_web',
      contactsUsedThisMonth: contactsUsed,
      monthlyContactLimit: contactLimit,
      remainingContactsThisMonth: remainingContacts,
      migratedToApp: Boolean(state.migratedToApp)
    });
  } catch (err) {
    console.error('Error en /api/account/sync-state:', err);
    return res.status(500).json({ error: 'Internal sync state error' });
  }
}
