"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { LoginSchema } from "@/schema";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { login } from "@/app/actions/login";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const { update } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);

        console.log("success");
        console.log(success);
        if (data?.success) {
          window.location.href = "/"; // Navigate to a dashboard or another page
        }
      });
    });
  };

  /*  let labelA = `Don't have an account`; */
  let labelA = "";
  let backBtn = "/auth/register";
  if (error?.includes("Please")) {
    labelA = "Change password?";
    backBtn = "/auth/change-password";
  }

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-white">
      {/* GIF Section (Left) */}
      <div className="hidden h-full w-1/4 grid-cols-1 gap-4 p-6 md:grid">
        <video
          src="/assets/gifs/gif1.mp4"
          autoPlay
          loop
          muted
          className="h-1/2 w-full object-contain"
        />
        <video
          src="/assets/gifs/gif2.mp4"
          autoPlay
          loop
          muted
          className="h-1/2 w-full object-contain"
        />
      </div>

      {/* Login Form Section (Center) */}
      {/*   <div
        className="flex h-full w-2/4 items-center justify-center p-6"
        style={{
          backgroundImage: "url(/images/logo/bgimagedark.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CardWrapper
          headerLabel="Welcome"
          backButtonLabel={labelA}
          backButtonHref={backBtn}
        >
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john@doe.com"
                          className="placeholder:text-gray-50"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Password"
                          className="placeholder:text-slate-100"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </div> */}

      <div
        className="relative flex h-full w-2/4 items-center justify-center overflow-hidden rounded-md p-6"
        style={{
          backgroundImage: "url(/images/logo/bgimagedark.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* White Smoke Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-white opacity-20"></div>

        <CardWrapper
          headerLabel="Welcome"
          backButtonLabel={labelA}
          backButtonHref={backBtn}
        >
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john@doe.com"
                          className="placeholder:text-gray-300"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Password"
                          className="placeholder:text-gray-300"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </div>

      {/* GIF Section (Right) */}
      <div className="hidden h-full w-1/4 grid-cols-1 gap-4 p-6 md:grid">
        <video
          src="/assets/gifs/gif3.mp4"
          autoPlay
          loop
          muted
          className="h-1/2 w-full object-contain"
        />
        <video
          src="/assets/gifs/gif4.mp4"
          autoPlay
          loop
          muted
          className="h-1/2 w-full object-contain"
        />
      </div>
    </div>
  );
}
