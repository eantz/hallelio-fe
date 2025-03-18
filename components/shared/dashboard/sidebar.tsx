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
import { Calendar1, IdCard, Users } from "lucide-react";
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
              <SidebarMenuItem key="member-menu">
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/member"><IdCard /> Member Management</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="event-menu">
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/event"><Calendar1 /> Event Schedules</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}