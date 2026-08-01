import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";
import { loadModuleOverviewData } from "@/lib/data";

export default async function FinancePage() {
  const { events, venues } = await loadModuleOverviewData();

  return (
    <AppShell activeItem="finance">
      <ModuleOverview moduleId="finance" events={events} venues={venues} />
    </AppShell>
  );
}
