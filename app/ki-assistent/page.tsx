import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";
import { loadModuleOverviewData } from "@/lib/data";

export default async function AiPage() {
  const { events, venues } = await loadModuleOverviewData();

  return (
    <AppShell activeItem="ai">
      <ModuleOverview moduleId="ai" events={events} venues={venues} />
    </AppShell>
  );
}
