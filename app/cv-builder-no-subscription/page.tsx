import { permanentRedirect } from "next/navigation";

export default function LegacyCvBuilderRedirectPage() {
  permanentRedirect("/cv-builder-no-subscription-uk");
}
