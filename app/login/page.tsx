import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/app/login/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { safeInternalRedirect } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to WorkCV with a one-time email code before opening the CV editor.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const user = await getCurrentUser();
  const next = safeInternalRedirect(searchParams.next);

  if (user) redirect(next);

  return <LoginForm initialNext={next} />;
}
