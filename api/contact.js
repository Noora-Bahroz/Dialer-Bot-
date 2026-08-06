import nodemailer from 'nodemailer';

const CONTACT_TO = process.env.CONTACT_TO || 'itsuzairnaseer@gmail.com';const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return json(res, 400, { ok: false, error: 'Invalid request body.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return json(res, 400, { ok: false, error: 'Invalid request body.' });
  }

  // Honeypot — bots fill this; humans never see it
  if (body.website) {
    return json(res, 200, { ok: true });
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const company = String(body.company || '').trim();
  const reason = String(body.reason || '').trim();
  const message = String(body.message || '').trim();

  if (!name || name.length > 120) {
    return json(res, 400, { ok: false, error: 'Please enter your name.' });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return json(res, 400, { ok: false, error: 'Please enter a valid email.' });
  }
  if (!message || message.length < 5 || message.length > 5000) {
    return json(res, 400, { ok: false, error: 'Please enter a short message.' });
  }
  if (company.length > 200 || reason.length > 200) {
    return json(res, 400, { ok: false, error: 'One of the fields is too long.' });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass || !from) {
    console.error('[contact] Missing SMTP env vars');
    return json(res, 503, {
      ok: false,
      error: 'Mail is not configured yet. Try WhatsApp or email us directly.',
    });
  }

  const text = [
    'New Dialer Bot contact form submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company / floor: ${company}` : null,
    reason ? `Reason: ${reason}` : null,
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family:Manrope,Segoe UI,sans-serif;line-height:1.5;color:#1e322d">
      <p style="margin:0 0 12px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#5a746c">Dialer Bot · Contact</p>
      <h2 style="margin:0 0 16px;font-size:20px">New brief from ${escapeHtml(name)}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:6px 0;color:#5a746c;width:140px">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${company ? `<tr><td style="padding:6px 0;color:#5a746c">Company</td><td style="padding:6px 0">${escapeHtml(company)}</td></tr>` : ''}
        ${reason ? `<tr><td style="padding:6px 0;color:#5a746c">Reason</td><td style="padding:6px 0">${escapeHtml(reason)}</td></tr>` : ''}
      </table>
      <div style="margin-top:18px;padding:14px 16px;border-radius:12px;background:#f4f7f5;border:1px solid #d7e2dc;white-space:pre-wrap">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Dialer Bot" <${from}>`,
      to: CONTACT_TO,
      replyTo: `${name} <${email}>`,
      subject: `Dialer Bot brief: ${reason || 'Contact'} — ${name}`,
      text,
      html,
    });

    return json(res, 200, { ok: true });
  } catch (err) {
    console.error('[contact] SMTP send failed', err);
    return json(res, 502, {
      ok: false,
      error: 'Could not send right now. Try again or WhatsApp us.',
    });
  }
}
