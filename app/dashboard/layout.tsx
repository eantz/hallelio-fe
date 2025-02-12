import { DashboardSidebar } from "@/components/shared/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <section>
      <SidebarProvider>
        <DashboardSidebar />
      </SidebarProvider>
      {children}
    </section>
  );
}
