import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";

export default function VenuesPage() {
  return (
    <AppShell activeItem="venues">
      <ModuleOverview moduleId="venues" />
    </AppShell>
  );
}
