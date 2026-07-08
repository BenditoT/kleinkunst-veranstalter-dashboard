import { AuthCard, AuthInput, AuthLink, AuthSubmit } from "@/components/auth/auth-card";
import { DemoAuthForm } from "@/components/auth/demo-auth-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Passwort zuruecksetzen"
      description="Sende einen Reset-Link an die hinterlegte E-Mail-Adresse."
      footer={
        <>
          Wieder eingefallen? <AuthLink href="/login">Zurueck zum Login</AuthLink>
        </>
      }
    >
      <DemoAuthForm successMessage="Reset-Link wurde in der Demo simuliert. Produktiv versendet der Auth-Adapter die E-Mail.">
        <AuthInput label="E-Mail" name="email" type="email" />
        <AuthSubmit>Reset-Link senden</AuthSubmit>
      </DemoAuthForm>
    </AuthCard>
  );
}
