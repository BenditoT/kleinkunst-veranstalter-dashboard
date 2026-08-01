import { AuthCard, AuthInput, AuthLink, AuthSubmit } from "@/components/auth/auth-card";
import { CredentialsAuthForm } from "@/components/auth/credentials-auth-form";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password-policy";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Organisation registrieren"
      description={`Lege die erste Organisation und den Owner-Zugang für dein Veranstalter-Team an. Das Passwort braucht mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`}
      footer={
        <>
          Schon registriert? <AuthLink href="/login">Zum Login</AuthLink>
        </>
      }
    >
      <CredentialsAuthForm
        endpoint="/api/auth/register"
        enforcePasswordPolicy
        demoSuccessMessage="Registrierung wurde in der Demo vorgemerkt. Die produktive Anlage schreibt später in Cloud SQL."
      >
        <AuthInput label="Organisationsname" name="organizationName" />
        <AuthInput label="Vorname" name="firstName" autoComplete="given-name" />
        <AuthInput label="E-Mail" name="email" type="email" autoComplete="username" />
        <AuthInput
          label="Passwort"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
        />
        <AuthSubmit>Registrierung vorbereiten</AuthSubmit>
      </CredentialsAuthForm>
    </AuthCard>
  );
}
