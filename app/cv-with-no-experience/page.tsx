import { GenericMarketingPage, metadataFor } from "@/components/generic-page";
import { pages } from "@/lib/pages";

export const metadata = metadataFor(pages.noExperience);

export default function Page() {
  return <GenericMarketingPage config={pages.noExperience} />;
}
