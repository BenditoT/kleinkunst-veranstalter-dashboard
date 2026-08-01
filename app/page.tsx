import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { AppShell } from "@/components/layout/app-shell";
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

export default async function Home() {
  const context = await getRequestOrganizationContext();
  const port = getDataPort();

  const [events, venues, artists, tasks] = await Promise.all([
    port.listEvents(context),
    port.listVenues(context),
    port.listArtists(context),
    port.listTasks(context),
  ]);

  return (
    <AppShell activeItem="dashboard">
      <DashboardHome events={events} venues={venues} artists={artists} tasks={tasks} />
    </AppShell>
  );
}
