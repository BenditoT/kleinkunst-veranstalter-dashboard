import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";

export default function FinancePage() {
  return (
    <AppShell activeItem="finance">
      <ModuleOverview moduleId="finance" />
    </AppShell>
  );
}
