import { AuthCard, AuthInput, AuthLink, AuthSubmit } from "@/components/auth/auth-card";

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
      <form className="grid gap-4">
        <AuthInput label="E-Mail" name="email" type="email" />
        <AuthSubmit>Reset-Link senden</AuthSubmit>
      </form>
    </AuthCard>
  );
}
