"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "../../components/ui/button";
import {
  Archive,
  Eye,
  Filter,
  Loader,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash,
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
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { archiveUser, deleteUser, getUsers, reactivateUser, UsersItem } from "@/services/users/users.api";
import { AddUserDialog } from "../dialogs/AddUserDialog";
import { EditUserDialog } from "../dialogs/EditUserDialog";
import ViewUserDrawer from "../dialogs/ViewUserDrawer";

interface ActionDialogProps {
  _id: string;
  itemId: number;
  actionType: "archive" | "reactivate" | "delete";
  onConfirm: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
}

function ActionDialog({
  _id,
  itemId,
  actionType,
  onConfirm,
  open,
  onOpenChange,
  itemName,
}: ActionDialogProps) {

  const actionLabels = {
    archive: "Archive",
    reactivate: "Reactivate",
    delete: "Delete",
  };

  const actionColors = {
    archive: "bg-yellow-500 hover:bg-yellow-600",
    reactivate: "bg-green-500 hover:bg-green-600",
    delete: "bg-red-500 hover:bg-red-600",
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to {actionType ? actionLabels[actionType].toLowerCase() : ""}{" "}
            {itemName ? `"${itemName}" "${itemId}"` : `item with ID ${itemId}`}? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={`text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 ${actionColors[actionType]}`}
            onClick={() => onConfirm(_id)}
          >
            {actionLabels[actionType]}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UsersItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<"archive" | "reactivate" | "delete" | null>(null);
  const [open, setOpen] = useState(false);
  const [editselectedUserDialogOpen, setEditselectedUserDialogOpen] = useState(false);
  const [addselectedUserDialogOpen, setAddselectedUserDialogOpen] = useState(false);
  const [viewselectedUserDrawerOpen, setViewselectedUserDrawerOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(1, 50);
      setUsers(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const regex = new RegExp(debouncedSearch, "i");

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.FirstName} ${user.MiddleName || ""} ${user.LastName}`.replace(/\s+/g, ' ').trim();
    return (
      regex.test(fullName) ||
      regex.test(user.UserCode?.toString() || "")
    );
  });

  const usersColumns: ColumnDef<UsersItem>[] = [
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
      header: "Full Name",
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
            <div
              className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center text-gray-600 text-xs font-medium pointer-events-none`}
            >
              {firstLetter}
            </div>
            <div
              className="text-xs font-semibold ml-1 underline cursor-pointer pointer-events-auto"
              onClick={() => {
                setSelectedUser(row.original);
                setViewselectedUserDrawerOpen(true);
              }}
            >
              {fullName.toLocaleUpperCase()}
            </div>
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
        let status = row.getValue("Status") as string;

        let variant: "success" | "warning" | "destructive" | "outline" = "outline";
        if (status === "Active") {
          variant = "success";
        } else if (status === "Inactive") {
          variant = "warning";
        } else if (status === "Archived") {
          variant = "warning";
        } else if (status === "Suspended") {
          variant = "destructive";
        } else if (!status) {
          variant = "outline";
        }
        return <Badge variant={variant}>{status ?? ""}</Badge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const user = row.original;
        const isArchivedUser = row.original.Archived;

        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-xs"
                  onClick={() => {
                    setSelectedUser(row.original);
                    setEditselectedUserDialogOpen(true);
                  }}
                >
                  <Pencil className="mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isArchivedUser ? (
                  <DropdownMenuItem
                    className="text-xs text-green-700"
                    onClick={() => {
                      setSelectedUser(row.original);
                      setActionType("reactivate");
                      setOpen(true);
                    }}
                  >
                    <RotateCcw className="text-green-600 mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    Reactivate User
                  </DropdownMenuItem>
                ): (  
                  <DropdownMenuItem
                    className="text-xs"
                    variant="archive"
                    onClick={() => {
                      setSelectedUser(row.original);
                      setActionType("archive");
                      setOpen(true);
                    }}
                  >
                    <Archive className="text-warning mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    Archive User
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-xs"
                  variant="destructive"
                  onClick={() => {
                    setSelectedUser(row.original);
                    setActionType("delete");
                    setOpen(true);
                  }}
                >
                  <Trash className="text-destructive mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const handleArchive = async (_id: string) => {
    try {
      await archiveUser(_id);
      toast({
        title: "Archived!",
        variant: "success",
        description: "The user has been successfully archived.",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error archiving user:", error);
      toast({
        title: "Error!",
        variant: "destructive",
        description: "There was an error archiving the user.",
      });
    }
  };

  const handleReactivate = async (_id: string) => {
    try {
      await reactivateUser(_id);
      toast({
        title: "Reactivated!!",
        variant: "success",
        description: "The user has been successfully reactivated.",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error reactivating user:", error);
      toast({
        title: "Error!",
        variant: "destructive",
        description: "There was an error reactivated the user.",
      });
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await deleteUser(_id);
      toast({
        title: "Deleted!",
        variant: "success",
        description: "The user has been successfully deleted.",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error!",
        variant: "destructive",
        description: "There was an error deleting the user.",
      });
    }
  };

  const handleEditSubmit = (updatedUser: UsersItem) => {
    setUsers((prevUsers) => {
      return prevUsers.map((user) =>
        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
      );
    });

    toast({
      title: "User Updated",
      description: `${updatedUser.FirstName} ${updatedUser.LastName} has been updated successfully.`,
      variant: "success",
    });
  };


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
            <div className="flex flex-col space-y-5 sm:space-y-4 min-h-full">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
                  <p className="text-sm text-muted-foreground">List of all users.</p>
                </div>
                {/* Add Button */}
                <Button
                  className="w-auto text-sm pointer-events-auto"
                  onClick={() => setAddselectedUserDialogOpen(true)}
                >
                  <Plus className="mr-1" /> Add New User
                </Button>
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
                <div>
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
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-40 gap-2 text-muted-foreground">
                  <Loader className="h-5 w-5 animate-spin" />
                  <p className="text-sm">Loading users data...</p>
                </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-muted-foreground">No results found.</p>
                  </div>
              ) : (
                <div className="bg-white rounded-md pb-3">
                  <DataTable columns={usersColumns} pageSize={10} data={filteredUsers} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddUserDialog
        open={addselectedUserDialogOpen}
        onOpenChange={setAddselectedUserDialogOpen}
        onSuccess={(newUser: UsersItem) => {
          setUsers((prev) => [...prev, newUser]);
        }}
      />

      {selectedUser && editselectedUserDialogOpen && (
        <EditUserDialog
          open={editselectedUserDialogOpen}
          selectedUser={selectedUser}
          onOpenChange={setEditselectedUserDialogOpen}
          onSuccess={handleEditSubmit}
        />
      )}

      {selectedUser && viewselectedUserDrawerOpen && (
        <ViewUserDrawer
          open={viewselectedUserDrawerOpen}
          selectedUser={selectedUser}
          onOpenChange={setViewselectedUserDrawerOpen}
        />
      )}

      <ActionDialog
        _id={selectedUser?._id}
        itemId={selectedUser?.UserId ?? 0}
        itemName={selectedUser?.FirstName + " " + selectedUser?.LastName}
        actionType={actionType!}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async (_id: string) => {
          if (actionType === "archive") await handleArchive(_id);
          if (actionType === "reactivate") await handleReactivate(_id);
          if (actionType === "delete") await handleDelete(_id);
          setOpen(false);
        }}
      />
    </>
  );
}
