import { AuthCard, AuthInput, AuthLink, AuthSubmit } from "@/components/auth/auth-card";
import { CredentialsAuthForm } from "@/components/auth/credentials-auth-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Passwort zurücksetzen"
      description="Sende einen Reset-Link an die hinterlegte E-Mail-Adresse."
      footer={
        <>
          Wieder eingefallen? <AuthLink href="/login">Zurück zum Login</AuthLink>
        </>
      }
    >
      <CredentialsAuthForm
        endpoint="/api/auth/password-reset"
        demoSuccessMessage="Reset-Link wurde in der Demo simuliert. Produktiv versendet der Auth-Adapter die E-Mail."
      >
        <AuthInput label="E-Mail" name="email" type="email" autoComplete="username" />
        <AuthSubmit>Reset-Link senden</AuthSubmit>
      </CredentialsAuthForm>
    </AuthCard>
  );
}
