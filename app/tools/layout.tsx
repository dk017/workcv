import { ToolBreadcrumbs } from "@/components/tool-breadcrumbs";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolBreadcrumbs />
      {children}
    </>
  );
}
