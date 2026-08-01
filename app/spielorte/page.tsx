import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";
import { loadModuleOverviewData } from "@/lib/data";

export default async function VenuesPage() {
  const { events, venues } = await loadModuleOverviewData();

  return (
    <AppShell activeItem="venues">
      <ModuleOverview moduleId="venues" events={events} venues={venues} />
    </AppShell>
  );
}
