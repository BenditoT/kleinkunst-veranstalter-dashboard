import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";

export default function GemaPage() {
  return (
    <AppShell activeItem="gema">
      <ModuleOverview moduleId="gema" />
    </AppShell>
  );
}
