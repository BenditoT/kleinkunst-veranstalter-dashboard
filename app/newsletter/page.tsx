import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";

export default function NewsletterPage() {
  return (
    <AppShell activeItem="newsletter">
      <ModuleOverview moduleId="newsletter" />
    </AppShell>
  );
}
