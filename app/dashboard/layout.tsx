import { DashboardSidebar } from "@/components/shared/dashboard/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <section>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="p-4">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}
