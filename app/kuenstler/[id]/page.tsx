import { notFound } from "next/navigation";

import { ArtistDetail } from "@/components/artists/artist-detail";
import { AppShell } from "@/components/layout/app-shell";
import { sampleArtists } from "@/lib/domain/sample-data";

type ArtistDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return sampleArtists.map((artist) => ({
    id: artist.id,
  }));
}

export default function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const artist = sampleArtists.find((item) => item.id === params.id);

  if (!artist) {
    notFound();
  }

  return (
    <AppShell activeItem="artists">
      <ArtistDetail artist={artist} />
    </AppShell>
  );
}
