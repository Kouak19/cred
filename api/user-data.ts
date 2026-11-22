import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

const isValidUserId = (value: unknown): value is string =>
  typeof value === "string" && /^[A-Za-z0-9_-]{1,120}$/.test(value);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(503).json({
      message: "La synchronisation distante n’est pas configurée sur le serveur.",
    });
  }

  const userId = req.method === "GET" ? req.query.userId : req.body?.userId;
  if (!isValidUserId(userId)) {
    return res.status(400).json({ message: "Identifiant utilisateur invalide." });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("user_data")
      .select("payload, updated_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("user-data GET error", error);
      return res.status(500).json({ message: "Impossible de charger les données du compte." });
    }

    return res.status(200).json({ payload: data?.payload ?? null, updatedAt: data?.updated_at ?? null });
  }

  if (req.method === "PUT") {
    const payload = req.body?.payload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res.status(400).json({ message: "Données de compte invalides." });
    }

    const updatedAt = new Date().toISOString();
    const { error } = await supabase.from("user_data").upsert(
      { user_id: userId, payload, updated_at: updatedAt },
      { onConflict: "user_id" },
    );

    if (error) {
      console.error("user-data PUT error", error);
      return res.status(500).json({ message: "Impossible d’enregistrer les données du compte." });
    }

    return res.status(200).json({ updatedAt });
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ message: "Méthode non autorisée." });
}
