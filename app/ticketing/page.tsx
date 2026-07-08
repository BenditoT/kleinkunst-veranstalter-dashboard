import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";

export default function TicketingPage() {
  return (
    <AppShell activeItem="ticketing">
      <ModuleOverview moduleId="ticketing" />
    </AppShell>
  );
}
