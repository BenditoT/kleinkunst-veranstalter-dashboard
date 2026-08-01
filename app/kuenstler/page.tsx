import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";
import { loadModuleOverviewData } from "@/lib/data";

export default async function ArtistsPage() {
  const { events, venues } = await loadModuleOverviewData();

  return (
    <AppShell activeItem="artists">
      <ModuleOverview moduleId="artists" events={events} venues={venues} />
    </AppShell>
  );
}
