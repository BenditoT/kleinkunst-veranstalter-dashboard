import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { VenueDetail } from "@/components/venues/venue-detail";
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

type VenueDetailPageProps = {
  params: {
    id: string;
  };
};

// Statischer Export: die Detailseiten werden zur Buildzeit für die
// Demo-Organisation vorgerendert. Der Kontext kommt aus dem Datenport
// (O3), nicht mehr aus einem Direktimport der Demodaten (S2).
export async function generateStaticParams() {
  const context = await getRequestOrganizationContext();
  const venues = await getDataPort().listVenues(context);

  return venues.map((venue) => ({ id: venue.id }));
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const context = await getRequestOrganizationContext();
  const port = getDataPort();

  const [venue, events] = await Promise.all([
    port.getVenueById(context, params.id),
    port.listEvents(context),
  ]);

  if (!venue) {
    notFound();
  }

  return (
    <AppShell activeItem="venues">
      <VenueDetail venue={venue} events={events} />
    </AppShell>
  );
}
