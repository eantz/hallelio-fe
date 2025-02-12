'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { use } from "react";
import { Shell, ChevronsUpDown, LogOut } from "lucide-react";
import Link from "next/link";
import { ResponseObject } from "@/lib/http";

export function SidebarUser({activeUser} : {activeUser: Promise<ResponseObject>}) {
  const currentUser = use(activeUser)

  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Shell className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {currentUser.data?.name}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side={isMobile ? "bottom" : "right"}
          sideOffset={4}
        >
          <DropdownMenuItem
            key={currentUser.data?.id}
            className="gap-2 p-2 flex"
          >
            <Link href="/logout" className="flex flex-row gap-2 w-full text-red-600">
              <div className="size-6 flex items-center justify-center rounded-sm border">
                <LogOut className="size-4 shrink-0" />
              </div>
              <div className="flex size-6 grow items-center">
                <span>Logout</span>
              </div>
              
            </Link>
            
          </DropdownMenuItem>
        </DropdownMenuContent>
        
      </DropdownMenu>
      
    </SidebarMenu>
  )
}