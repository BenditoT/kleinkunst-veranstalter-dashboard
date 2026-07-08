import { EventFormScreen } from "@/components/events/event-form-screen";
import { AppShell } from "@/components/layout/app-shell";

export default function NewEventPage() {
  return (
    <AppShell activeItem="events">
      <EventFormScreen />
    </AppShell>
  );
}
