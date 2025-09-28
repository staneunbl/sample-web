"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Please enter password.",
  }),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    //console.log("Login values:", values);

    // TODO: Replace with API call
    setTimeout(() => {
      setLoading(false);
      alert("Logged in!");
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your username and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel
                            className={`${
                              fieldState.error ? "text-red-500" : ""
                            }`}
                          >
                            Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="text"
                                placeholder="m@example.com"
                                {...field}
                                className={` ${
                                  fieldState.error
                                    ? "border-red-500 ring-red-500 focus-visible:ring-red-200 focus-visible:border-red-500"
                                    : ""
                                }`}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                    <div className="grid gap-3 space-y-3">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                            <FormLabel className={`${fieldState.error ? "text-red-500" : ""}`}>
                                Password
                            </FormLabel>
                            <a href="#" className="text-sm underline-offset-4 hover:underline">
                                Forgot your password?
                            </a>
                            </div>
                            <FormControl>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                {...field}
                                className={`${
                                fieldState.error
                                    ? "border-red-500 ring-red-500 focus-visible:ring-red-200 focus-visible:border-red-500"
                                    : ""
                                }`}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="bg-primary w-full">
                        Login
                    </Button>
                    </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
