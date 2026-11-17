import "dotenv/config";
import express from "express";
import { createServer } from "http";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : smtpPort === 465;

const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="82" viewBox="0 0 360 82"><rect width="360" height="82" rx="12" fill="#fff"/><circle cx="40" cy="41" r="29" fill="#eaf6f1"/><path d="M18 58h44v4H18zM43 20l5 13 10-5-8-16h-9L31 38c6-.2 10-1.6 14-4.8.7-.4 2.3-4.6 4-9.2z" fill="#006b4f"/><path d="M49 31l-9 5c-7 3.6-14 6.7-19 7.6-9 2-17 2.5-15 .4 2-2.2 7-12.8 19-15 2-.4 4-.4 5-.1 1.5.1-1.2-4.6-2.2-5.8-1.2-1.2-2.6-1.5-4.5-1C13 24.1 5 28.2 3 36c-1.2 3.3.9 6.5 2.3 7.5 1 .7 5.2 4.2 15 .5 7.4-2.8 17-8.6 27.7-13.7V26l-4 2.5z" fill="#009597"/><path d="M44 48l4 10h11l-8-16-7 6z" fill="#006b4f"/><path d="M63 16L49 23c-2 .5-3-.3-3.4-.8-.7-1.1-1.2-3-1.7-4.3 1 0 1.6-.1 2.1-.3C48 17 63 10 63 10z" fill="#e3313d"/><text x="86" y="43" fill="#006b4f" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700">Crédit Agricole</text><text x="88" y="63" fill="#71857e" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="700" letter-spacing="2.4">FRANCE</text></svg>`;

const createEmailHtml = ({ firstName, lastName, iban, swift, bankCode, amount, label }: { firstName: string; lastName: string; iban: string; swift: string; bankCode: string; amount: number; label?: string }) => `<!doctype html><html lang="fr"><body style="margin:0;background:#f2f6f4;color:#18332c;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f6f4"><tr><td style="padding:30px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:650px;margin:auto;background:#fff;border:1px solid #dceae5;border-radius:18px;overflow:hidden"><tr><td style="height:6px;background:#e3313d"></td></tr><tr><td style="padding:25px 30px;border-bottom:1px solid #edf3f0"><img src="cid:ca-logo" width="260" alt="Crédit Agricole France" style="display:block;width:260px;height:auto;border:0"></td></tr><tr><td style="padding:34px 30px"><div style="display:inline-block;padding:7px 11px;border-radius:999px;background:#eaf6f1;color:#006b4f;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Opération confirmée</div><h1 style="margin:18px 0 10px;color:#153a30;font-size:27px;line-height:1.2">Votre virement a bien été enregistré</h1><p style="color:#526b62;font-size:15px;line-height:1.7">Bonjour ${escapeHtml(firstName)} ${escapeHtml(lastName)},</p><p style="color:#526b62;font-size:15px;line-height:1.7">Nous vous confirmons la prise en compte de votre opération depuis votre espace bancaire sécurisé.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:25px;border:1px solid #dceae5;border-radius:14px;background:#fbfdfc"><tr><td style="padding:20px;color:#006b4f;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Détails de l’opération</td></tr><tr><td style="padding:0 20px 18px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px"><tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Montant</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#006b4f;text-align:right;font-size:19px;font-weight:700">${escapeHtml(formatCurrency(amount))}</td></tr><tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Libellé</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;text-align:right;font-weight:600">${escapeHtml(label || "Virement")}</td></tr><tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">IBAN bénéficiaire</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;text-align:right;font-weight:600;word-break:break-all">${escapeHtml(iban)}</td></tr><tr><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;color:#71857e">Code banque</td><td style="padding:11px 0;border-bottom:1px solid #e8f0ed;text-align:right;font-weight:600">${escapeHtml(bankCode)}</td></tr><tr><td style="padding:11px 0;color:#71857e">Code SWIFT / BIC</td><td style="padding:11px 0;text-align:right;font-weight:600">${escapeHtml(swift)}</td></tr></table></td></tr></table><div style="margin-top:23px;padding:14px 16px;border-left:4px solid #e3313d;background:#fff7f7;border-radius:8px;color:#735157;font-size:13px;line-height:1.6"><strong style="color:#5b2931">Rappel de sécurité</strong><br>Ne communiquez jamais votre code personnel ou vos codes de validation par email.</div><p style="margin-top:23px;color:#91a29c;font-size:12px;line-height:1.6">Cet email est généré automatiquement, merci de ne pas y répondre.</p></td></tr><tr><td style="padding:21px 30px;background:#f5faf8;border-top:1px solid #e3efeb;color:#71857e;font-size:12px;line-height:1.7"><strong style="color:#006b4f">Crédit Agricole France</strong><br>Votre banque, à vos côtés.</td></tr></table></td></tr></table></body></html>`;

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "32kb" }));

  app.post("/api/send-transfer-confirmation", async (req, res) => {
    const { firstName, lastName, iban, swift, bankCode, amount, email, label } = req.body ?? {};
    const transferAmount = Number(amount);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const fromAddress = process.env.SMTP_FROM || smtpUser;

    if (!firstName || !lastName || !iban || !swift || !bankCode || !email || !Number.isFinite(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: "Les informations du virement sont incomplètes." });
    }

    if (!smtpUser || !smtpPassword || !fromAddress) {
      return res.status(503).json({
        message: "Le service email n’est pas configuré. Renseignez SMTP_USER, SMTP_PASSWORD et SMTP_FROM.",
      });
    }

    try {
      await smtpTransporter.sendMail({
        from: `Groupe Crédit Agricole <${fromAddress}>`,
        to: email,
        subject: "Confirmation de votre virement",
        text: [
          `Bonjour ${firstName} ${lastName},`,
          "",
          "Votre virement a été effectué avec succès.",
          `Montant : ${formatCurrency(transferAmount)}`,
          `IBAN destinataire : ${iban}`,
          `Code Swift / BIC : ${swift}`,
          `Code banque : ${bankCode}`,
          `Libellé : ${label || "Virement"}`,
          "",
          "Merci de votre confiance.",
          "Groupe Crédit Agricole",
        ].join("\n"),
        html: createEmailHtml({ firstName, lastName, iban, swift, bankCode, amount: transferAmount, label }),
        attachments: [{ filename: "credit-agricole-france-logo.svg", content: logoSvg, contentType: "image/svg+xml", cid: "ca-logo" }],
      });
      return res.json({ success: true });
    } catch (error) {
      console.error("SMTP transfer confirmation error:", error);
      return res.status(502).json({ message: "L’email de confirmation n’a pas pu être envoyé." });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
