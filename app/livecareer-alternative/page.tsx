import { GenericMarketingPage, metadataFor } from "@/components/generic-page";
import { pages } from "@/lib/pages";

export const metadata = metadataFor(pages.livecareer);

export default function Page() {
  return <GenericMarketingPage config={pages.livecareer} />;
}
