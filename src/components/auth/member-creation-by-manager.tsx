//@ts-nocheck

"use client";

import React, { useEffect, useState, useTransition } from "react";
import * as z from "zod";
import { MemberCreationSchema, MemberCreationSchemaByManager } from "@/schema";
import { CardWrapper } from "./CardWrapper";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createUser, register } from "@/app/actions/register";
import { ComboboxForm } from "./Reference";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { getDepartments } from "@/app/actions/getDepartments";
import {
  createMember,
  createMemberByManager,
} from "@/app/actions/createMember";

const roles = [
  { label: "department MANAGER", value: "departmentMANAGER" },
  { label: "GENERAL MANAGER", value: "GENERALMANAGER" },
  { label: "MANAGING DIRECTOR", value: "MANAGINGDIRECTOR" },
  { label: "STORES PERSON", value: "STORESCLERK" },
  { label: "PROJECT ENGINEER", value: "PROJECTENGINEER" },
] as const;

const depart = [
  { label: "NO department", value: "NO_department" },
  { label: "EAST", value: "EAST" },
  { label: "NORTH", value: "NORTH" },
  { label: "SOUTH", value: "SOUTH" },
] as const;

function MemberCreationByManagerForm() {
  const [isPending, startTransition] = useTransition();
  const [departments, setDepartments] = useState(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof MemberCreationSchemaByManager>>({
    resolver: zodResolver(MemberCreationSchemaByManager),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      designation: "",
    },
  });

  function onSubmit(values: z.infer<typeof MemberCreationSchemaByManager>) {
    startTransition(async () => {
      await createMemberByManager(values)
        .then((res) => {
          // console.log(res);
          form.reset();
        })
        .catch((err) => {
          toast({
            title: "Error posting",
            description: err?.message,
          });
          throw new Error(err.message);
        });
    });
  }

  return (
    <Form {...form}>
      <form
        className="h-[95%] w-full space-y-4 bg-white p-5  lg:mt-2 lg:h-[70%]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <div className="lg:flex lg:flex-row lg:justify-between lg:space-x-5">
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="First Name"
                        type="name"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Last Name"
                        type="name"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="johndoe@gmail.com"
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
            name="ecnum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EC Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ZE125688"
                    type="text"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="System Developer"
                    type="text"
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
          Create Member
        </Button>
      </form>
    </Form>
  );
}

export default MemberCreationByManagerForm;
