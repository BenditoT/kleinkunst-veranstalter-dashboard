import { AuthCard, AuthInput, AuthLink, AuthSubmit } from "@/components/auth/auth-card";
import { DemoAuthForm } from "@/components/auth/demo-auth-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Organisation registrieren"
      description="Lege die erste Organisation und den Owner-Zugang fuer dein Veranstalter-Team an."
      footer={
        <>
          Schon registriert? <AuthLink href="/login">Zum Login</AuthLink>
        </>
      }
    >
      <DemoAuthForm successMessage="Registrierung wurde in der Demo vorgemerkt. Die produktive Anlage schreibt spaeter in Cloud SQL.">
        <AuthInput label="Organisationsname" name="organizationName" />
        <AuthInput label="Vorname" name="firstName" />
        <AuthInput label="E-Mail" name="email" type="email" />
        <AuthInput label="Passwort" name="password" type="password" />
        <AuthSubmit>Registrierung vorbereiten</AuthSubmit>
      </DemoAuthForm>
    </AuthCard>
  );
}
