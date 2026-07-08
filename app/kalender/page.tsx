import { CalendarWorkspace } from "@/components/calendar/calendar-workspace";
import { AppShell } from "@/components/layout/app-shell";

export default function CalendarPage() {
  return (
    <AppShell activeItem="calendar">
      <CalendarWorkspace />
    </AppShell>
  );
}
