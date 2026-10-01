import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Globe2, HelpCircle, Lock, Shield, User } from "lucide-react";
import { useLocation } from "wouter";
import { AUTH_SESSION_KEY, AUTH_USER_KEY, findDefaultUser, loadRemoteUser } from "../data/defaultUsers";

function MarocLogo({ inverse = false }: { inverse?: boolean }) {
  const textColor = inverse ? "text-white" : "text-[#006b4f]";
  const mutedColor = inverse ? "text-white/65" : "text-[#5f746d]";

  return (
    <div className="flex items-center gap-3" aria-label="Crédit Agricole du Maroc">
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
      </svg>
      
    </div>
  );
}

export default function Login() {
  const [identifiant, setIdentifiant] = useState("");
  const [codePersonnel, setCodePersonnel] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifiant || !codePersonnel) return;

    const baseUser = findDefaultUser(identifiant.trim(), codePersonnel.trim());
    if (!baseUser) {
      setError("Identifiant ou code personnel incorrect.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const user = await loadRemoteUser(baseUser);
      sessionStorage.setItem(AUTH_SESSION_KEY, "true");
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      setLocation("/");
    } catch (remoteError) {
      console.error("Erreur Supabase lors de la connexion :", remoteError);
      setError("Impossible de charger vos données. Vérifiez la configuration Supabase.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f1] text-[#17352e] lg:grid lg:grid-cols-[minmax(360px,0.92fr)_minmax(520px,1.08fr)]">
      {/* Morocco brand panel */}
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#006b4f] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute -right-36 -top-36 h-[34rem] w-[34rem] rounded-full border-[70px] border-white/[0.05]" />
        <div className="absolute -bottom-48 -left-36 h-[30rem] w-[30rem] rounded-full border-[52px] border-white/[0.06]" />
        <div className="absolute bottom-24 right-14 h-36 w-36 rounded-full bg-[#e30613]/15 blur-3xl" />

        <div className="relative">
          <MarocLogo inverse />
          <div className="mt-16 max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f2c84b]">Banque en ligne</p>
            <h1 className="mt-5 font-[Poppins] text-4xl font-semibold leading-[1.12] tracking-[-0.04em] xl:text-5xl">
              Votre banque,<br />
              <span className="text-[#b8e2c1]">à vos côtés.</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
              Accédez simplement à vos comptes, vos cartes et vos opérations depuis votre espace sécurisé Crédit Agricole du Maroc.
            </p>
          </div>
        </div>

        <div className="relative space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3.5 backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Shield size={18} className="text-[#f2c84b]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Connexion protégée</p>
              <p className="mt-0.5 text-xs text-white/55">Vos données sont traitées de manière confidentielle.</p>
            </div>
          </div>
          <p className="text-xs text-white/40">© 2026 Crédit Agricole du Maroc · Tous droits réservés</p>
        </div>
      </aside>

      {/* Login panel */}
      <main className="flex min-h-screen flex-col bg-white">
        <header className="flex items-center justify-between border-b border-[#e8eeea] px-5 py-5 sm:px-10 lg:px-14">
          <div className="lg:hidden">
            <MarocLogo />
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-[#5f746d] sm:flex">
            
          </div>
          <button type="button" aria-label="Aide" className="ml-auto rounded-full p-2 text-[#5f746d] transition-colors hover:bg-[#eff7f2] hover:text-[#006b4f]">
            <HelpCircle size={21} />
          </button>
        </header>

        <div className="flex flex-1 items-start justify-center px-5 py-10 sm:px-10 sm:py-14 lg:items-center lg:px-14 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-[31rem]">
            <div className="mb-9">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#edf7f1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#087d61]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e30613]" /> Espace client
              </div>
              <h2 className="font-[Poppins] text-3xl font-semibold tracking-[-0.04em] text-[#17352e] sm:text-[2.15rem]">Bienvenue dans votre espace</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#6f8079]">Connectez-vous pour consulter vos comptes et piloter vos opérations en toute sécurité.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="identifiant" className="ml-1 text-sm font-semibold text-[#35544b]">Identifiant client</label>
                <div className="group relative">
                  <User size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8ca19a] transition-colors group-focus-within:text-[#078261]" />
                  <input
                    id="identifiant"
                    type="text"
                    value={identifiant}
                    onChange={(e) => setIdentifiant(e.target.value)}
                    placeholder="Saisissez votre identifiant"
                    className="w-full rounded-xl border border-[#dce7e1] bg-[#fbfdfb] py-4 pl-12 pr-4 text-sm text-[#17352e] outline-none transition-all placeholder:text-[#9aaba4] focus:border-[#159b79] focus:bg-white focus:ring-4 focus:ring-[#159b79]/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="code-personnel" className="ml-1 text-sm font-semibold text-[#35544b]">Code personnel</label>
                <div className="group relative">
                  <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8ca19a] transition-colors group-focus-within:text-[#078261]" />
                  <input
                    id="code-personnel"
                    type={showCode ? "text" : "password"}
                    value={codePersonnel}
                    onChange={(e) => setCodePersonnel(e.target.value)}
                    placeholder="Saisissez votre code personnel"
                    className="w-full rounded-xl border border-[#dce7e1] bg-[#fbfdfb] py-4 pl-12 pr-12 text-sm text-[#17352e] outline-none transition-all placeholder:text-[#9aaba4] focus:border-[#159b79] focus:bg-white focus:ring-4 focus:ring-[#159b79]/10"
                    required
                  />
                  <button type="button" onClick={() => setShowCode(!showCode)} aria-label={showCode ? "Masquer le code personnel" : "Afficher le code personnel"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8ca19a] transition-colors hover:bg-[#edf7f1] hover:text-[#078261]">
                    {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#6f8079]">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#cbdad3] accent-[#078261]" />
                  Se souvenir de moi
                </label>
                <button type="button" className="text-xs font-semibold text-[#078261] transition-colors hover:text-[#005d47] hover:underline">Identifiants oubliés ?</button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !identifiant || !codePersonnel}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgba(0,107,79,0.8)] transition-all active:scale-[0.99] ${
                  isLoading || !identifiant || !codePersonnel ? "cursor-not-allowed bg-[#b9cbc3]" : "bg-[#006b4f] hover:bg-[#005d47]"
                }`}
              >
                {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <>Se connecter <ArrowRight size={18} /></>}
              </button>
            </form>

            {error && (
              <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" /> {error}
              </p>
            )}

            <div className="mt-9 flex items-start gap-3 rounded-2xl border border-[#dbece0] bg-[#f3faf5] p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dcefe2] text-[#087d61]"><CheckCircle2 size={17} /></div>
              <div>
                <p className="text-sm font-semibold text-[#245c4c]">Votre sécurité est notre priorité</p>
                <p className="mt-1 text-xs leading-5 text-[#5f8072]">Ne communiquez jamais votre code personnel. Crédit Agricole France ne vous le demandera jamais par email ou par téléphone.</p>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-[#a0afa9]">Besoin d’aide ? Contactez votre agence Crédit Agricole de France.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );

}
