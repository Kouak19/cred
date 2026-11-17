import "dotenv/config";
import nodemailer from "nodemailer";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

// SVG embarqué en pièce jointe CID : il reste net quelle que soit la résolution de l’écran.
const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="82" viewBox="0 0 360 82" role="img" aria-labelledby="title desc">
  <title id="title">Crédit Agricole France</title>
  <desc id="desc">Logo Crédit Agricole France</desc>
  <rect width="360" height="82" rx="12" fill="#ffffff"/>
  <g transform="translate(12 10)">
    <path d="M2 53h72v7H2z" fill="#006b4f"/>
    <path d="M49 12l6 15 11-6-9-18H43L24 37c8-.3 14-2.1 19-6.2.8-.5 3-6.1 6-12.8z" fill="#006b4f"/>
    <path d="M57 25l-11 6c-9 4.7-18 9-23 10.3-12 3.5-27 5.7-20.8.7C7.4 37.5 14 19 31 15.8c2.3-.4 5-.6 6-.3 2 .1-1.6-6.4-2.8-7.7-1.3-1.5-3.3-2-5.9-1.5C18 8.5 5 13.8 1 24.4c-2.2 4.8.7 10.1 2.6 11.5 1 .7 7 6.1 20.8.6C35 32.7 49 24.9 62 18.5V12l-5 3.3z" fill="#009597"/>
    <path d="M50 40l4.7 11.3c.4 1 1.4 1.7 2.8 1.7h12.8l-9.5-19.5L50 40z" fill="#006b4f"/>
    <path d="M78 7L60 16.7c-3 .8-4.3-.2-4.7-.8-1-1.5-1.7-4.5-2.4-6.1 1.5 0 2.2-.2 2.8-.4C57.8 8.8 78 0 78 0z" fill="#e3313d"/>
  </g>
  <text x="102" y="42" fill="#006b4f" font-family="Arial,Helvetica,sans-serif" font-size="25" font-weight="700">Crédit Agricole</text>
  <text x="104" y="63" fill="#71857e" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="700" letter-spacing="2.4">FRANCE</text>
</svg>`;

const createEmailHtml = ({
  firstName,
  lastName,
  iban,
  swift,
  bankCode,
  amount,
  label,
}: {
  firstName: string;
  lastName: string;
  iban: string;
  swift: string;
  bankCode: string;
  amount: number;
  label?: string;
}) => {
  const safeFirstName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeIban = escapeHtml(iban);
  const safeSwift = escapeHtml(swift);
  const safeBankCode = escapeHtml(bankCode);
  const safeLabel = escapeHtml(label || "Virement");
  const formattedAmount = escapeHtml(formatCurrency(amount));
  const date = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  return `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;background:#f2f6f4;color:#18332c;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">Votre virement a bien été enregistré dans votre espace bancaire.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f2f6f4">
      <tr><td style="padding:30px 14px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:650px;margin:0 auto;background:#ffffff;border:1px solid #dceae5;border-radius:18px;overflow:hidden">
          <tr><td style="height:6px;background:#e3313d;font-size:0;line-height:0">&nbsp;</td></tr>
          <tr><td style="padding:25px 30px 22px;background:#ffffff;border-bottom:1px solid #edf3f0">
            <img src="cid:ca-logo" width="360" height="82" alt="Crédit Agricole France" style="display:block;width:260px;height:auto;border:0;outline:none;text-decoration:none">
          </td></tr>
          <tr><td style="padding:34px 30px 30px">
            <div style="display:inline-block;padding:7px 11px;border-radius:999px;background:#eaf6f1;color:#006b4f;font-size:11px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase">Opération confirmée</div>
            <h1 style="margin:18px 0 10px;color:#153a30;font-size:27px;line-height:1.22;font-weight:700">Votre virement a bien été enregistré</h1>
            <p style="margin:0;color:#526b62;font-size:15px;line-height:1.7">Bonjour ${safeFirstName} ${safeLastName},</p>
            <p style="margin:11px 0 27px;color:#526b62;font-size:15px;line-height:1.7">Nous vous confirmons la prise en compte de votre opération depuis votre espace bancaire sécurisé.</p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #dceae5;border-radius:14px;background:#fbfdfc">
              <tr><td style="padding:20px 20px 9px;color:#006b4f;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Détails de l’opération</td></tr>
              <tr><td style="padding:0 20px 18px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:14px">
                  <tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Montant</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#006b4f;text-align:right;font-size:19px;font-weight:700">${formattedAmount}</td></tr>
                  <tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Libellé</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#153a30;text-align:right;font-weight:600;word-break:break-word">${safeLabel}</td></tr>
                  <tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">IBAN bénéficiaire</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#153a30;text-align:right;font-weight:600;word-break:break-all">${safeIban}</td></tr>
                  <tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Code banque</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#153a30;text-align:right;font-weight:600">${safeBankCode}</td></tr>
                  <tr><td style="padding:11px 0;color:#71857e">Code SWIFT / BIC</td><td style="padding:11px 0;color:#153a30;text-align:right;font-weight:600">${safeSwift}</td></tr>
                </table>
              </td></tr>
            </table>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:23px;border-left:4px solid #e3313d;background:#fff7f7;border-radius:8px">
              <tr><td style="padding:14px 16px;color:#735157;font-size:13px;line-height:1.6"><strong style="color:#5b2931">Rappel de sécurité</strong><br>Ne communiquez jamais votre code personnel ou vos codes de validation par email. En cas de doute, contactez directement votre agence.</td></tr>
            </table>
            <p style="margin:23px 0 0;color:#91a29c;font-size:12px;line-height:1.6">Opération enregistrée le ${escapeHtml(date)}.<br>Cet email est généré automatiquement, merci de ne pas y répondre.</p>
          </td></tr>
          <tr><td style="padding:21px 30px;background:#f5faf8;border-top:1px solid #e3efeb;color:#71857e;font-size:12px;line-height:1.7"><strong style="color:#006b4f">Crédit Agricole France</strong><br>Votre banque, à vos côtés.<br>Pour toute question, connectez-vous à votre espace bancaire sécurisé.</td></tr>
        </table>
        <p style="max-width:650px;margin:15px auto 0;text-align:center;color:#a0afaa;font-size:11px">© 2026 Crédit Agricole France · Message confidentiel</p>
      </td></tr>
    </table>
  </body>
</html>`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée." });
  }

  const { firstName, lastName, iban, swift, bankCode, amount, email, label } = req.body ?? {};
  const transferAmount = Number(amount);
  const smtpUser = process.env.SMTP_USER || process.env["EMAIL_USER"] || process.env["UTILISATEUR_EMAIL"];
  const smtpPassword = process.env.SMTP_PASSWORD || process.env["EMAIL_PASS"];
  const fromAddress = process.env.SMTP_FROM || process.env["EMAIL_FROM"] || smtpUser;
  const smtpHost = process.env.SMTP_HOST || process.env["EMAIL_HOST"] || process.env["HÔTE_DE_MAIL"] || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || process.env["EMAIL_PORT"] || process.env["PORT_EMAIL"] || 465);
  const smtpSecureValue = process.env.SMTP_SECURE || process.env["EMAIL_SECURE"] || process.env["EMAIL_SÉCURISÉ"];
  const smtpSecure = smtpSecureValue ? smtpSecureValue === "true" : smtpPort === 465;

  if (!firstName || !lastName || !iban || !swift || !bankCode || !email || !Number.isFinite(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ message: "Les informations du virement sont incomplètes." });
  }

  if (!smtpUser || !smtpPassword || !fromAddress) {
    return res.status(503).json({
      message: "Le service email n’est pas configuré. Vérifiez EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS et EMAIL_FROM dans Vercel.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPassword },
  });

  try {
    await transporter.sendMail({
      from: `Crédit Agricole France <${fromAddress}>`,
      to: email,
      subject: "Confirmation de votre virement — Crédit Agricole France",
      text: [
        `Bonjour ${firstName} ${lastName},`,
        "",
        "Votre virement a bien été enregistré depuis votre espace bancaire sécurisé.",
        `Montant : ${formatCurrency(transferAmount)}`,
        `IBAN bénéficiaire : ${iban}`,
        `Code Swift / BIC : ${swift}`,
        `Code banque : ${bankCode}`,
        `Libellé : ${label || "Virement"}`,
        "",
        "Ne communiquez jamais vos codes personnels par email.",
        "Crédit Agricole France — Votre banque, à vos côtés.",
      ].join("\n"),
      html: createEmailHtml({ firstName, lastName, iban, swift, bankCode, amount: transferAmount, label }),
      attachments: [{ filename: "credit-agricole-france-logo.svg", content: logoSvg, contentType: "image/svg+xml", cid: "ca-logo" }],
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMTP transfer confirmation error:", error);
    return res.status(502).json({ message: "L’email de confirmation n’a pas pu être envoyé." });
  }
}
