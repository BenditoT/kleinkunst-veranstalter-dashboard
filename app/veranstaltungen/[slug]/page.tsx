import { notFound } from "next/navigation";

import { EventDetail } from "@/components/events/event-detail";
import { AppShell } from "@/components/layout/app-shell";
import { sampleEvents } from "@/lib/domain/sample-data";

type EventDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return sampleEvents.map((event) => ({
    slug: event.slug,
  }));
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const event = sampleEvents.find((item) => item.slug === params.slug);

  if (!event) {
    notFound();
  }

  return (
    <AppShell activeItem="events">
      <EventDetail event={event} />
    </AppShell>
  );
}
