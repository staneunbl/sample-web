import { House, LayoutDashboard, TabletSmartphone, UserCheck2, Users2 } from "lucide-react";

interface SubItem {
  label: string
  href: string
  active: boolean
  allowedUserTypes: number[]
}

interface RouteItem {
  label: string
  icon: React.ElementType
  href: string
  active: boolean
  allowedUserTypes: number[]
  subItems?: SubItem[]
}

interface SidebarGroupData {
  label: string
  routes: RouteItem[]
}

export const getHomeRoutes = (pathname: string, userType: number): SidebarGroupData[] => {
  const allGroups: SidebarGroupData[] = [
    {
      label: "Main",
      routes: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
          active: pathname === "/dashboard",
          allowedUserTypes: [1, 3, 4, 5]
        },
        {
          label: "Users List",
          icon: Users2,
          href: "/users",
          active: pathname === "/users",
          allowedUserTypes: [1, 3, 4, 5],
          subItems: [
            {
              label: "All Users",
              href: "/users",
              active: pathname === "/users",
              allowedUserTypes: [1, 3, 4, 5]
            },
            {
              label: "Managers", // for testing only
              href: "/users/managers",
              active: pathname === "/users/managers",
              allowedUserTypes: [1, 3, 4, 5]
            },
            {
              label: "Executives", // for testing only
              href: "/users/executives",
              active: pathname === "/users/executives",
              allowedUserTypes: [1, 3, 4, 5]
            },
          ],
        },
      ],
    },
      {
      label: "For Approvals", // for testing only
      routes: [
        {
          label: "Users Registrations",
          icon: UserCheck2,
          href: "/users-registrations",
          active: pathname.startsWith("/users-registratios"),
          allowedUserTypes: [1, 3, 4, 5],
        },
      ],
    },
  ]

  // Filter routes and subItems by userType
  return allGroups
    .map((group) => ({
      ...group,
      routes: group.routes
         .filter((route) => route.allowedUserTypes.includes(userType))
        .map((route) => ({
          ...route,
          subItems: route.subItems?.filter((sub) =>
            sub.allowedUserTypes.includes(userType)
          ),
        })),
    }))
    .filter((group) => group.routes.length > 0) // drop empty groups
}
