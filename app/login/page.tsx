import { AuthCard, AuthInput, AuthLink, AuthSubmit } from "@/components/auth/auth-card";
import { CredentialsAuthForm } from "@/components/auth/credentials-auth-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Anmelden"
      description="Melde dich mit E-Mail und Passwort an. Die Anmeldung läuft über den Auth-Port; der lokale Adapter lässt sich später gegen Identity Platform tauschen."
      footer={
        <>
          Noch kein Konto? <AuthLink href="/register">Organisation registrieren</AuthLink>
        </>
      }
    >
      <CredentialsAuthForm
        endpoint="/api/auth/login"
        redirectOnSuccess
        demoSuccessMessage="Login wurde in der Demo vorbereitet. Produktiv nutzt diese App später Identity Platform oder den gewählten Auth-Adapter."
      >
        <AuthInput label="E-Mail" name="email" type="email" autoComplete="username" />
        <AuthInput label="Passwort" name="password" type="password" autoComplete="current-password" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            Angemeldet bleiben
          </label>
          <AuthLink href="/forgot-password">Passwort vergessen</AuthLink>
        </div>
        <AuthSubmit>Einloggen</AuthSubmit>
      </CredentialsAuthForm>
    </AuthCard>
  );
}
