import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { VenueDetail } from "@/components/venues/venue-detail";
import { sampleVenues } from "@/lib/domain/sample-data";

type VenueDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return sampleVenues.map((venue) => ({
    id: venue.id,
  }));
}

export default function VenueDetailPage({ params }: VenueDetailPageProps) {
  const venue = sampleVenues.find((item) => item.id === params.id);

  if (!venue) {
    notFound();
  }

  return (
    <AppShell activeItem="venues">
      <VenueDetail venue={venue} />
    </AppShell>
  );
}
