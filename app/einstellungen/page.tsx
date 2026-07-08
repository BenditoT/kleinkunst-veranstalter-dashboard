import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";

export default function SettingsPage() {
  return (
    <AppShell activeItem="settings">
      <ModuleOverview moduleId="settings" />
    </AppShell>
  );
}
