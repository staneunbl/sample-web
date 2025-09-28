"use client";

import { UsersItem } from "@/services/users/users.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerOverlay,
  DrawerPortal,
} from "@/components/ui/drawer";

interface ViewUserDrawerProps {
  selectedUser: UsersItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewUserDrawer({
  selectedUser,
  open,
  onOpenChange,
}: ViewUserDrawerProps) {
  if (!selectedUser) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerPortal>
        <DrawerOverlay className="bg-black/40" />
        <DrawerContent className="w-96">
          <DrawerHeader className="flex flex-col items-center mt-5">
            {/* Avatar */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold text-gray-700
            ${selectedUser.Sex === "Male" ? "bg-blue-200" : "bg-pink-200"}`}
            >
              {selectedUser.FirstName.charAt(0)}
              {selectedUser.LastName.charAt(0)}
            </div>

            {/* Name and Code */}
            <div className="flex flex-col items-center text-center">
              <DrawerTitle className="text-lg font-semibold">
                {`${selectedUser.FirstName} ${selectedUser.LastName}`}
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground">
                User Code: {selectedUser.UserCode}
              </DrawerDescription>
            </div>
          </DrawerHeader>

          <div className="p-6 space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <Badge
                variant={
                  selectedUser.Status === "Active" ? "success" : "destructive"
                }
              >
                {selectedUser.Status}
              </Badge>
            </div>

            {/* User Info */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">User Code:</span>
                <span>{selectedUser.UserCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Full Name:</span>
                <span>{`${selectedUser.FirstName} ${
                  selectedUser.MiddleName || ""
                } ${selectedUser.LastName}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sex:</span>
                <span>{selectedUser.Sex}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span>{selectedUser.Role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date of Birth:</span>
                <span>{selectedUser.DateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{selectedUser.Email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone Number:</span>
                <span>{selectedUser.PhoneNumber}</span>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
