import { useSession } from "next-auth/react";

import { useGetTeam } from "@/lib/swr/use-team";
import { CustomUser } from "@/lib/types";

/**
 * Returns whether the current user is an Admin of the active team.
 * Relies on `useGetTeam()` (SWR-cached) so it won't cause extra fetches
 * when the team data is already loaded on a settings page.
 */
export function useIsAdmin() {
  const { data: session, status } = useSession();
  const { team, loading: teamLoading } = useGetTeam();

  const sessionLoading = status === "loading";
  const loading = teamLoading || sessionLoading;

  const user = session?.user as CustomUser;
  const userId = user?.id;
  const userEmail = user?.email;

  const AUTHORIZED_EMAILS = process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS || "";
  const isAuthorizedAdmin = userEmail && AUTHORIZED_EMAILS.split(",").includes(userEmail);

  const isAdmin = !loading && (
    isAuthorizedAdmin ||
    !!team?.users?.some(
      (u) => u.userId === userId && u.role === "ADMIN",
    )
  );

  return { isAdmin, loading };
}
