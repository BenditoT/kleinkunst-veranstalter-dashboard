import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";

export default function ArtistsPage() {
  return (
    <AppShell activeItem="artists">
      <ModuleOverview moduleId="artists" />
    </AppShell>
  );
}
