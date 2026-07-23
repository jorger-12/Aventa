import {
  RequireAuth,
  RequireRole,
  RequireVerifiedEmail,
} from "@/components/auth";

import DashboardHome from "@/components/vendor-dashboard/DashboardHome";

const VENDOR_ROLES = ["vendor", "admin"] as const;

export default function VendorDashboardPage() {
  return (
    <RequireAuth>
      <RequireVerifiedEmail>
        <RequireRole allowedRoles={VENDOR_ROLES}>
          <DashboardHome />
        </RequireRole>
      </RequireVerifiedEmail>
    </RequireAuth>
  );
}
