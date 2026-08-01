import { CalendarWorkspace } from "@/components/calendar/calendar-workspace";
import { AppShell } from "@/components/layout/app-shell";
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

export default async function CalendarPage() {
  const context = await getRequestOrganizationContext();
  const port = getDataPort();

  const [events, venues] = await Promise.all([
    port.listEvents(context),
    port.listVenues(context),
  ]);

  return (
    <AppShell activeItem="calendar">
      <CalendarWorkspace events={events} venues={venues} />
    </AppShell>
  );
}
