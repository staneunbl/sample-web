"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "../../components/ui/button";
import {
  ChevronsUpDown,
  Filter,
  InfoIcon,
  Loader,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";

export interface UsersItem {
  UserId: number;
  UserCode: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Sex: "Male" | "Female" | "Other";
  Role: string;
  DateOfBirth?: string;   // ISO format
  Email?: string;
  PhoneNumber?: string;
  Status?: "Active" | "Inactive" | "Suspended";
}

export const usersData: UsersItem[] = [
  {
    UserId: 1,
    UserCode: "USR001",
    FirstName: "Juan",
    MiddleName: "Dela",
    LastName: "Cruz",
    Sex: "Male",
    Role: "Admin",
    DateOfBirth: "1990-05-21",
    Email: "juan.cruz@example.com",
    PhoneNumber: "09171234567",
    Status: "Active",
  },
  {
    UserId: 2,
    UserCode: "USR002",
    FirstName: "Maria",
    LastName: "Santos",
    Sex: "Female",
    Role: "Manager",
    DateOfBirth: "1988-11-10",
    Email: "maria.santos@example.com",
    PhoneNumber: "09181234567",
    Status: "Active",
  },
  {
    UserId: 3,
    UserCode: "USR003",
    FirstName: "Carlo",
    LastName: "Reyes",
    Sex: "Male",
    Role: "Staff",
    DateOfBirth: "1995-03-15",
    Email: "carlo.reyes@example.com",
    PhoneNumber: "09201234567",
    Status: "Inactive",
  },
  {
    UserId: 4,
    UserCode: "USR004",
    FirstName: "Angela",
    MiddleName: "Lopez",
    LastName: "Torres",
    Sex: "Female",
    Role: "Reader",
    DateOfBirth: "2000-07-05",
    Email: "angela.torres@example.com",
    PhoneNumber: "09351234567",
    Status: "Suspended",
  },
];

export const usersColumns: ColumnDef<UsersItem>[] = [
  {
    accessorKey: "UserId",
    header: "ID",
    cell: ({ row }) => <span>{row.getValue("UserId")}</span>,
  },
  {
    accessorKey: "UserCode",
    header: "Code",
    cell: ({ row }) => <span>{row.getValue("UserCode")}</span>,
  },
  {
    accessorFn: (row) => `${row.FirstName} ${row.MiddleName || ""} ${row.LastName}`,
    id: "FullName",
    header: "Agent Name",
    cell: ({ row }) => {
      const fullName = row.getValue("FullName") as string;
      const firstLetter = fullName.charAt(0).toUpperCase();
      const gender = row.original.Sex;

      const bgColor =
        gender === "Male"
          ? "bg-blue-200"
          : gender === "Female"
            ? "bg-red-200"
            : "bg-gray-200";

      return (
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center text-gray-600 text-xs font-medium`}>
            {firstLetter}
          </div>
          <div className="text-xs font-semibold ml-1">{fullName.toLocaleUpperCase()}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "Sex",
    header: "Sex",
    cell: ({ row }) => <span>{row.getValue("Sex")}</span>,
  },
  {
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }) => <span>{row.getValue("Role")}</span>,
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("Email") ?? "-"}</span>,
  },
  {
    accessorKey: "PhoneNumber",
    header: "Phone",
    cell: ({ row }) => <span>{row.getValue("PhoneNumber") ?? "-"}</span>,
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      const color =
        status === "Active"
          ? "text-green-600"
          : status === "Inactive"
          ? "text-gray-500"
          : "text-red-600";
      return <span className={color}>{status}</span>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const users = row.original;

      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-4 w-4 p-0 sm:h-4 sm:w-4">
                <span className="sr-only">Open menu</span>
                {/* Smaller icon */}
                <MoreHorizontal className="h-1.5 w-1.5 sm:h-2 sm:w-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs sm:text-sm">
              <DropdownMenuItem asChild className="text-xs sm:text-sm">
                {/* <Link href={`/home/crew/details?id=${crew.CrewCode}`}>
                  <IdCard className="mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  View Crew Details
                </Link> */}
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setAgents] = useState<UsersItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 400);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const res = await getUsers();
//         setUsers(res.data);
//       } catch (err: any) {
//         setError(err.message || "Failed to fetch agents");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

  const regex = new RegExp(debouncedSearch, "i");

  const filteredUsers = usersData.filter((user) => {
    const fullName = `${user.FirstName} ${user.MiddleName || ""} ${user.LastName}`;
    return (
      regex.test(fullName) ||
      regex.test(user.UserCode.toString())
    );
  });

  if (error) return <p>Error: {error}</p>

  return (
    <>
      <div className="h-full w-full overflow-hidden">
        <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Hide scrollbar for all scrollable elements in the component */
        .overflow-y-auto::-webkit-scrollbar,
        .overflow-auto::-webkit-scrollbar,
        .overflow-scroll::-webkit-scrollbar {
          display: none;
        }

        .overflow-y-auto,
        .overflow-auto,
        .overflow-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        <div className="h-full overflow-hidden">
          <div className="p-2 sm:py-0 flex flex-col space-y-4 sm:space-y-4 h-full">
            <div className="flex flex-col space-y-5 sm:space-y-5 min-h-full">
              <div className="space-y-0.5">
                <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
                <p className="text-sm text-muted-foreground">
                  List of all users.
                </p>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="relative rounded-lg">
                    <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-7 text-xs sm:text-sm h-8 w-90"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                {/* <div>
                  <Select>
                    <SelectTrigger className="h-8 px-3 sm:px-4 text-xs sm:text-sm flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All agents</SelectItem>
                      <SelectItem value="verified">Active</SelectItem>
                      <SelectItem value="pending">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-40 gap-2 text-muted-foreground">
                  <Loader className="h-5 w-5 animate-spin" />
                  <p className="text-sm">Loading users data...</p>
                </div>
              // ) : filteredAgents.length === 0 ? (
              //   <div className="flex justify-center items-center h-40">
              //     <p className="text-muted-foreground">No results found.</p>
              //   </div>
              ) : (
                <div className="bg-white rounded-md pb-3">
                  <DataTable columns={usersColumns} pageSize={10} data={filteredUsers} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
