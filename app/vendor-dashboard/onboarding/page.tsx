import {
  RequireAuth,
  RequireRole,
  RequireVerifiedEmail,
} from "@/components/auth";

import VendorOnboarding from "./VendorOnboarding";

export default function VendorOnboardingPage() {
  return (
    <RequireAuth>
      <RequireVerifiedEmail>
        <RequireRole allowedRoles={["vendor"]}>
          <VendorOnboarding />
        </RequireRole>
      </RequireVerifiedEmail>
    </RequireAuth>
  );
}
