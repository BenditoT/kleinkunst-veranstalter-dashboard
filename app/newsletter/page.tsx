import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";
import { loadModuleOverviewData } from "@/lib/data";

export default async function NewsletterPage() {
  const { events, venues } = await loadModuleOverviewData();

  return (
    <AppShell activeItem="newsletter">
      <ModuleOverview moduleId="newsletter" events={events} venues={venues} />
    </AppShell>
  );
}
