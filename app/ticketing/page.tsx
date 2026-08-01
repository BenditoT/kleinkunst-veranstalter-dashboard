import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";
import { loadModuleOverviewData } from "@/lib/data";

export default async function TicketingPage() {
  const { events, venues } = await loadModuleOverviewData();

  return (
    <AppShell activeItem="ticketing">
      <ModuleOverview moduleId="ticketing" events={events} venues={venues} />
    </AppShell>
  );
}
