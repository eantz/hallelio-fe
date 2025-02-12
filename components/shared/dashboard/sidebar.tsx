import Link from "next/link";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader } from "../../ui/sidebar";
import { Users } from "lucide-react";
import { Suspense} from "react";
import { SidebarUser } from "./sidebar-user";
import { getActiveUser } from "@/actions/user";

export function DashboardSidebar() {
  const activeUser = getActiveUser()

  return (
    <Sidebar>
      <SidebarHeader>
        <Suspense fallback="loading...">
          <SidebarUser activeUser={activeUser} />
        </Suspense>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="user-menu">
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/user"><Users /> User Management</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}