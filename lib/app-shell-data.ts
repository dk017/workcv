import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getPassStatus } from "@/lib/cv-entitlement";
import { buildLoginHref } from "@/lib/safe-redirect";

/** The signed-in user and what the app shell shows about them. Sends visitors to sign in. */
export async function requireAppUser(returnTo: string) {
  const user = await getCurrentUser();
  if (!user) redirect(buildLoginHref(returnTo));
  const pass = await getPassStatus(user.id);
  return { user, pass };
}
