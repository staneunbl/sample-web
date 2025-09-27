"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export interface SubItem {
  label: string
  href: string
  active: boolean
}

export interface RouteItem {
  label: string
  icon?: React.ElementType
  href: string
  active: boolean
  subItems?: SubItem[]
}

export interface SidebarGroupData {
  label: string
  routes: RouteItem[]
}

interface NavMainProps {
  groups: SidebarGroupData[]
}

export function NavMain({ groups }: NavMainProps) {
  return (
    <SidebarGroup>
      {groups.map((group) => (
        <div key={group.label} className="mb-4">
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {group.routes.map((route) =>
              route.subItems && route.subItems.length > 0 ? (
                // Routes with sub-items
                <Collapsible
                  key={route.label}
                  defaultOpen={route.active || false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={route.label}>
                        {route.icon && <route.icon className="w-4 h-4 mr-2" />}
                        <span>{route.label}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {route.subItems.map((sub) => (
                          <SidebarMenuSubItem key={sub.label}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={sub.href}
                                className={sub.active ? "font-semibold" : ""}
                              >
                                {sub.label}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                // Routes without sub-items
                <SidebarMenuItem key={route.label}>
                  <SidebarMenuButton asChild tooltip={route.label}>
                    <Link
                      href={route.href}
                      className={route.active ? "font-semibold" : ""}
                    >
                      {route.icon && <route.icon className="w-4 h-4 mr-2" />}
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </div>
      ))}
    </SidebarGroup>
  )
}
