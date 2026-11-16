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

const logoSvg = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 93.285 20.51"
        className="h-8 w-auto"
        role="img"
        aria-label="Crédit Agricole"
        fillRule="evenodd"
      >
        <g fillRule="nonzero" stroke="none">
      <path d="M.28 18.093h27v2.417h-27zM17.448 4.955l1.822 4.56 3.22-1.693-2.8-6.176h-4.057L9.937 12.279s2.804-.098 4.6-1.43c.444-.267 1.728-3.62 2.9-5.883z" fill="#006c50" />
      <path d="M22.5 7.815l-3.22 1.688c-2.755 1.413-5.372 2.666-6.78 3.048-3.715 1.07-8.242 1.7-9.87.27-1.528-1.355 2-7.043 8.682-8.3a5.73 5.73 0 011.715-.173c.577.029-.458-1.946-.813-2.346a1.66 1.66 0 00-1.715-.644C9.055 1.458 2.901 3.086.475 8.21c-1.333 2.915.444 5.856 1.608 6.705.542.395 4.04 3.528 12.126.373a85.87 85.87 0 0015.107-7.954V4.055L22.5 7.805z" fill="#009597" />
      <path d="M20.42 12.477l1.37 3.32a1.13 1.13 0 001 .64h3.715l-2.782-5.732-3.3 1.773z" fill="#006c50" />
      <path d="M29.307 2.795l-5.243 2.808c-.89.36-1.253-.116-1.364-.284a11.615 11.615 0 01-.706-1.777 1.96 1.96 0 00.804-.09c.622-.17 6.483-3.457 6.51-3.452z" fill="#ed1c24" />
      <path d="M37.205 3.789a4.82 4.82 0 012.798.89l-.627.807a3.35 3.35 0 00-2.089-.729c-1.48 0-2.635.926-2.635 2.27 0 1.344 1.156 2.27 2.635 2.27a3.63 3.63 0 002.208-.756l.627.814a5.14 5.14 0 01-2.917.926c-2.035 0-3.954-1.204-3.954-3.256 0-2.052 1.92-3.232 3.954-3.232zm4.253.098h3.4c1.58 0 2.862.638 2.862 2.035 0 1.075-.8 1.64-1.858 1.882l2.055 2.374H46.34l-1.865-2.187H42.8v2.164h-1.357zm3.3 3.1c.95 0 1.56-.393 1.56-1.075 0-.682-.583-1.017-1.567-1.017h-1.947v2.106zm4.45 1.357V3.878h5.684v1.017h-4.338v1.516h3.98v.963h-3.98v.97c0 .546.258.807.787.807h3.676v1.017H51.02c-1.146-.014-1.8-.685-1.8-1.825zm4.33-6.26l-1.04 1.102H51.35l.8-1.102zm3.086 1.794h2.835c2.42 0 4.036 1.255 4.036 3.137 0 1.882-1.615 3.14-4.035 3.14h-2.835zm2.923 5.274c1.526 0 2.547-.85 2.547-2.126 0-1.276-1.017-2.143-2.547-2.143H57.97v4.27zm5.372-5.274h1.357v6.277H64.92zm2.683 1.004V3.875h6.17v1.017h-2.4v5.263h-1.357V4.881zM38.66 16.778h-3.463l-.753 1.513h-1.357l3.256-6.277H37.7l3.256 6.277h-1.543zm-.495-.98l-1.238-2.493-1.234 2.493zm7.16-3.9a4.86 4.86 0 012.798.885l-.644.83a3.39 3.39 0 00-2.092-.726c-1.48 0-2.635.906-2.635 2.252 0 1.346 1.017 2.286 2.6 2.286a3.303 3.303 0 001.777-.485v-1.215h-1.892v-.96h3.235V17.4a5.39 5.39 0 01-3.174.987c-2.374 0-3.937-1.397-3.937-3.256 0-2.052 1.92-3.235 3.975-3.235zm4.833.105h3.4c1.577 0 2.86.638 2.86 2.035 0 1.078-.8 1.64-1.855 1.886l2.035 2.374H55.02l-1.865-2.187h-1.68v2.187H50.12zm3.307 3.113c.95 0 1.56-.393 1.56-1.075 0-.682-.583-1.017-1.57-1.017h-1.947v2.106zm4.667-3.113h1.357v6.277h-1.36zm6.817-.105a4.846 4.846 0 012.798.885l-.627.83a3.37 3.37 0 00-2.089-.726c-1.48 0-2.635.922-2.635 2.27 0 1.348 1.156 2.27 2.635 2.27.8-.002 1.574-.27 2.204-.76l.63.817a5.12 5.12 0 01-2.917.922c-2.035 0-3.954-1.2-3.954-3.256s1.92-3.252 3.954-3.252zm3.402 3.246c0-1.777 1.648-3.246 3.97-3.246s3.97 1.468 3.97 3.246-1.648 3.246-3.97 3.246-3.97-1.472-3.97-3.246zm1.397 0c0 1.265 1.048 2.27 2.574 2.27 1.526 0 2.574-1.017 2.574-2.27 0-1.253-1.048-2.27-2.574-2.27-1.526 0-2.577 1.004-2.577 2.27zm7.797-3.14H78.9v5.274h4v1.017h-5.348zm6.176 4.466v-4.465h5.694v1.017h-4.34v1.516h3.98v.977h-3.988v.967a.7.7 0 00.79.807h3.676v1.017h-3.998c-1.15-.024-1.814-.695-1.814-1.835zm9.564.926" fill="#006c50" />
        </g>
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
  const date = new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#f3f7f5;color:#18332c;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased">
    <div style="padding:32px 16px">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dceae5;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,78,58,.08)">
        <div style="height:6px;background:#e3313d"></div>
        <div style="padding:28px 32px;background:#006b4f">
          <img src="cid:ca-logo" width="220" height="58" alt="Crédit Agricole France" style="display:block;width:220px;height:58px;border:0" />
        </div>
        <div style="padding:32px">
          <div style="display:inline-block;padding:7px 11px;border-radius:999px;background:#eaf6f1;color:#006b4f;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase">Opération confirmée</div>
          <h1 style="margin:18px 0 10px;color:#153a30;font-size:26px;line-height:1.2">Votre virement a bien été enregistré</h1>
          <p style="margin:0;color:#5d746c;font-size:15px;line-height:1.7">Bonjour ${safeFirstName} ${safeLastName},</p>
          <p style="margin:12px 0 26px;color:#5d746c;font-size:15px;line-height:1.7">Nous vous confirmons la prise en compte de votre opération depuis votre espace bancaire Crédit Agricole France.</p>

          <div style="padding:22px;border:1px solid #dceae5;border-radius:14px;background:#fbfdfc">
            <div style="margin-bottom:14px;color:#006b4f;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Détails de l’opération</div>
            <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Montant</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#153a30;text-align:right;font-size:18px;font-weight:700">${formattedAmount}</td></tr>
              <tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Libellé</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#153a30;text-align:right;font-weight:600">${safeLabel}</td></tr>
              <tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">IBAN bénéficiaire</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#153a30;text-align:right;font-weight:600;word-break:break-all">${safeIban}</td></tr>
              <tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Code banque</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#153a30;text-align:right;font-weight:600">${safeBankCode}</td></tr>
              <tr><td style="padding:11px 0;color:#7１８５７e">Code SWIFT / BIC</td><td style="padding:１１px ０;color:#１５３a３０;text-align:right;font-weight:6００">${safeSwift}</td></tr>
            </table>
          </div>

          <div style="margin-top:24px;padding:16px 18px;border-left:4px solid #e3313d;background:#fff7f7;border-radius:8px;color:#735157;font-size:13px;line-height:1.6">
            <strong style="color:#5b2931">Rappel de sécurité</strong><br />
            Le Crédit Agricole France ne vous demandera jamais votre code personnel ou vos codes de validation par email. En cas de doute, contactez directement votre agence.
          </div>
          <p style="margin:24px 0 0;color:#91a29c;font-size:12px;line-height:1.6">Opération enregistrée le ${escapeHtml(date)}. Cet email est généré automatiquement, merci de ne pas y répondre.</p>
        </div>
        <div style="padding:22px 32px;background:#f5faf8;border-top:1px solid #e3efeb;color:#71857e;font-size:12px;line-height:1.7">
          <strong style="color:#006b4f">Crédit Agricole France</strong><br />
          Votre banque, à vos côtés.<br />
          Pour toute question, contactez votre agence ou connectez-vous à votre espace bancaire sécurisé.
        </div>
      </div>
      <p style="max-width:640px;margin:16px auto 0;text-align:center;color:#a0afaa;font-size:11px">© 2026 Crédit Agricole France · Message confidentiel</p>
    </div>
  </body>
</html>`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée." });
  }

  const { firstName, lastName, iban, swift, bankCode, amount, email, label } = req.body ?? {};
  const transferAmount = Number(amount);
  // Les deux formats sont acceptés : noms SMTP standards et noms déjà créés dans Vercel.
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
        "Votre virement a bien été enregistré depuis votre espace Crédit Agricole France.",
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
