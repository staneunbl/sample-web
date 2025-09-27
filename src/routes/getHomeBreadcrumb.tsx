import Link from "next/link";
import { ChevronRight as ChevronRightIcon } from "lucide-react";
import { getHomeRoutes } from "./homeRoutes";

export const getHomeBreadcrumb = (pathname: string) => {
  const userType = 1;
  const routeGroups = getHomeRoutes(pathname, userType ?? 0);  
  const cleanPath = pathname?.split("?")[0] ?? "";
  //console.log(pathname);

  const match = (
    base: string,
    baseLabel: string,
    currentLabel?: string
  ) => (
    <div className="flex items-center">
      <Link href={base} className="hover:text-foreground">
        {baseLabel}
      </Link>
      <div className="mx-2 h-4 w-px bg-muted-foreground" />
      <span className="">
        {currentLabel ?? pathname.split("/").pop()?.replace(/_/g, " ")}
      </span>
    </div>
  );

  // Special case
  //if (pathname.startsWith("/home/user/details")) {return match("/home/user", "Users List", "Users Details");}

  // Loop through groups & items
  for (const group of routeGroups) {
    for (const item of group.routes ?? []) {
      if (item.href === cleanPath) {
        return <span className="text-[#121212]">{item.label}</span>;
      }

      if (item.subItems) {
        const sub = item.subItems.find((s) => s.href === cleanPath);
        if (sub) {
          return (
            <div className="flex items-center">
              <span className="text-muted">{item.label}</span>
              <ChevronRightIcon className="h-3 w-3 mx-2 text-muted-foreground" />
              <span className="text-muted-foreground">{sub.label}</span>
            </div>
          );
        }
      }
    }
  }

  // Fallback
  return <span className="text-primary">Home</span>;
};
