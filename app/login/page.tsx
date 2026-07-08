import { AuthCard, AuthInput, AuthLink, AuthSubmit } from "@/components/auth/auth-card";

export default function LoginPage() {
  return (
    <AuthCard
      title="Anmelden"
      description="Melde dich mit E-Mail und Passwort an. OAuth und Magic Link werden ueber den Auth-Adapter angebunden."
      footer={
        <>
          Noch kein Konto? <AuthLink href="/register">Organisation registrieren</AuthLink>
        </>
      }
    >
      <form className="grid gap-4">
        <AuthInput label="E-Mail" name="email" type="email" />
        <AuthInput label="Passwort" name="password" type="password" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            Angemeldet bleiben
          </label>
          <AuthLink href="/forgot-password">Passwort vergessen</AuthLink>
        </div>
        <AuthSubmit>Einloggen</AuthSubmit>
      </form>
    </AuthCard>
  );
}
