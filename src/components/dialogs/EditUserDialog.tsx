"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Pencil, Plus } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  UpdateUserPayload,
  addUsers,
  UsersItem,
  updateUser,
} from "@/services/users/users.api";
import { toast } from "@/hooks/use-toast";
import { formatDateForInput } from "@/hooks/use-formattedDate";

const userSchema = z.object({
  FirstName: z.string().min(1, "First name is required"),
  MiddleName: z.string().optional(),
  LastName: z.string().min(1, "Last name is required"),
  Sex: z.enum(["Male", "Female"]),
  Role: z.string().nonempty("Please select a role"),
  DateOfBirth: z.string().nonempty("Date of Birth is required"),
  Email: z.string().nonempty("Email is required").email("Invalid email"),
  PhoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(11, "Phone number cannot exceed 11 digits"),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserDialog {
  open: boolean;
  selectedUser: UsersItem;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newUser: UsersItem) => void;
}

export function EditUserDialog({
  open,
  selectedUser,
  onOpenChange,
  onSuccess,
}: EditUserDialog) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      FirstName: "",
      MiddleName: "",
      LastName: "",
      Sex: undefined,
      Role: "",
      DateOfBirth: "",
      Email: "",
      PhoneNumber: "",
    },
  });

  const { reset, formState } = form;
  const { isSubmitting } = formState;

  const roleOptions = [
    { label: "System Admin", value: 1 },
    { label: "Payroll Admin", value: 3 },
    { label: "Payroll Staff", value: 4 },
    { label: "Accounting Staff", value: 5 },
  ];

  const sexOptions = ["Male", "Female"];

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        FirstName: selectedUser.FirstName || "",
        MiddleName: selectedUser.MiddleName || "",
        LastName: selectedUser.LastName || "",
        Sex: selectedUser.Sex || "",
        Role: selectedUser.Role || "",
        DateOfBirth: formatDateForInput(selectedUser.DateOfBirth),
        Email: selectedUser.Email || "",
        PhoneNumber: selectedUser.PhoneNumber || "",
      });
    }
  }, [selectedUser, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      const payload: UpdateUserPayload = {
        _id: selectedUser?._id,
        UserId: selectedUser?.UserId,
        UserCode: selectedUser?.UserCode || "",
        FirstName: data.FirstName,
        LastName: data.LastName,
        MiddleName: data.MiddleName || "",
        Sex: data.Sex,
        Role: data.Role,
        Email: data.Email,
        PhoneNumber: data.PhoneNumber || "",
        DateOfBirth: new Date(data.DateOfBirth).toISOString(),
      };

      const response = await updateUser(payload);

      if (response && response.success) {
        const newUser: UsersItem = {
          _id: selectedUser._id,
          Status: "Active",
          Archived: false,
          ...payload,
        };

        onSuccess(newUser);

        toast({
          title: "User Edited",
          description: "The user has been successfully edited.",
          variant: "success",
        });

        onOpenChange(false);
        reset();
      } else {
        console.error("Error response from API:", response);
        toast({
          title: "Error",
          description: response?.message || "Failed to create user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Exception while creating user:", error);
      toast({
        title: "Error",
        description: "Something went wrong while creating the user.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-10">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-primary">
            Edit User
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="FirstName"
              render={({ field }) => (
                <FormItem className="w-full gap-2 mt-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="LastName"
              render={({ field }) => (
                <FormItem className="w-full gap-2 mt-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="MiddleName"
              render={({ field }) => (
                <FormItem className="w-full gap-2 mt-1">
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem className="w-full mt-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              {/* Role */}
              <FormField
                control={form.control}
                name="Role"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full gap-2 mt-1">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)} // keep it string
                        value={field.value} // already a string
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full rounded-md h-10 gap-2",
                            fieldState.invalid
                              ? "border-red-500 focus:ring-red-500"
                              : "border-[#E0E0E0]"
                          )}
                        >
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.label}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sex */}
              <FormField
                control={form.control}
                name="Sex"
                render={({ field }) => (
                  <FormItem className="w-full gap-2 mt-1">
                    <FormLabel>Sex</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full rounded-md h-10 gap-2 border-[#E0E0E0]">
                          <SelectValue placeholder="Select Sex" />
                        </SelectTrigger>
                        <SelectContent>
                          {sexOptions.map((sex) => (
                            <SelectItem key={sex} value={sex}>
                              {sex}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="DateOfBirth"
                render={({ field }) => (
                  <FormItem className="w-full gap-2 mt-1">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="PhoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full gap-2 mt-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Editing..."
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit User
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
