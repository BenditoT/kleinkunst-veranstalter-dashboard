import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";
import { loadModuleOverviewData } from "@/lib/data";

export default async function SettingsPage() {
  const { events, venues } = await loadModuleOverviewData();

  return (
    <AppShell activeItem="settings">
      <ModuleOverview moduleId="settings" events={events} venues={venues} />
    </AppShell>
  );
}
