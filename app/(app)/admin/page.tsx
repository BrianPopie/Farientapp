import { md } from "@/lib/docsSync";
import { AdminClient } from "@/components/admin/AdminClient";

export default function AdminPage() {
  const subtitle = md(
    "admin-subtitle",
    "Manage access, feature flags, and audit trails around the non-CEO roles focus. All switches below are mock-only for demo purposes."
  );

  return <AdminClient subtitle={subtitle} />;
}
