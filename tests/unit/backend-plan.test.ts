import { describe, expect, it } from "vitest";

import {
  SUPABASE_MIGRATION_EARLIEST_DATE,
  resolveBackendPlan,
} from "../../lib/config/backend";

describe("Backend provider plan", () => {
  it("uses Google Cloud as the prepared default provider", () => {
    const plan = resolveBackendPlan({});

    expect(plan.activeProvider).toBe("google-cloud");
    expect(plan.database).toBe("cloud-sql-postgres");
    expect(plan.auth).toBe("identity-platform");
    expect(plan.storage).toBe("cloud-storage");
  });

  it("keeps Supabase migration scheduled no earlier than 2026-07-24", () => {
    expect(SUPABASE_MIGRATION_EARLIEST_DATE).toBe("2026-07-24");

    const plan = resolveBackendPlan({ BACKEND_PROVIDER: "supabase" });

    expect(plan.activeProvider).toBe("supabase");
    expect(plan.migrationStatus).toBe("scheduled");
    expect(plan.supabaseMigrationEarliestDate).toBe("2026-07-24");
  });
});
