import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";
import { loadModuleOverviewData } from "@/lib/data";

export default async function GemaPage() {
  const { events, venues } = await loadModuleOverviewData();

  return (
    <AppShell activeItem="gema">
      <ModuleOverview moduleId="gema" events={events} venues={venues} />
    </AppShell>
  );
}
