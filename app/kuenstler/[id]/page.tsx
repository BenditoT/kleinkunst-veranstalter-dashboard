import { notFound } from "next/navigation";

import { ArtistDetail } from "@/components/artists/artist-detail";
import { AppShell } from "@/components/layout/app-shell";
import { getDataPort, getRequestOrganizationContext } from "@/lib/data";

type ArtistDetailPageProps = {
  params: {
    id: string;
  };
};

// Statischer Export: die Detailseiten werden zur Buildzeit für die
// Demo-Organisation vorgerendert. Der Kontext kommt aus dem Datenport
// (O3), nicht mehr aus einem Direktimport der Demodaten (S2).
export async function generateStaticParams() {
  const context = await getRequestOrganizationContext();
  const artists = await getDataPort().listArtists(context);

  return artists.map((artist) => ({ id: artist.id }));
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const context = await getRequestOrganizationContext();
  const port = getDataPort();

  const [artist, events, venues] = await Promise.all([
    port.getArtistById(context, params.id),
    port.listEvents(context),
    port.listVenues(context),
  ]);

  if (!artist) {
    notFound();
  }

  return (
    <AppShell activeItem="artists">
      <ArtistDetail artist={artist} events={events} venues={venues} />
    </AppShell>
  );
}
