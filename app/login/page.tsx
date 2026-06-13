import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/app/login/LoginForm";
import { getCurrentUser } from "@/lib/auth";

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
  const next =
    typeof searchParams.next === "string" && searchParams.next.startsWith("/")
      ? searchParams.next
      : "/editor";

  if (user) redirect(next);

  return <LoginForm initialNext={next} />;
}
