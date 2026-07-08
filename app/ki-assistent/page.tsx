import { AppShell } from "@/components/layout/app-shell";
import { ModuleOverview } from "@/components/modules/module-overview";

export default function AiPage() {
  return (
    <AppShell activeItem="ai">
      <ModuleOverview moduleId="ai" />
    </AppShell>
  );
}
