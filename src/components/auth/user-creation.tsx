"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { RegistrationSchema, UserCreationSchema } from "@/schema";
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
import { createUser, register, registration } from "@/actions/register";
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
import { districtRevalidations } from "@/actions/userApplications";

const roles = [
  { label: "DISTRICT MANAGER", value: "DISTRICTMANAGER" },
  { label: "GENERAL MANAGER", value: "GENERALMANAGER" },
  { label: "MANAGING DIRECTOR", value: "MANAGINGDIRECTOR" },
  { label: "STORES PERSON", value: "STORESCLERK" },
  { label: "PROJECT ENGINEER", value: "PROJECTENGINEER" },
] as const;

const districts = [
  { label: "NO DISTRICT", value: "NO_DISTRICT" },
  { label: "EAST", value: "EAST" },
  { label: "NORTH", value: "NORTH" },
  { label: "SOUTH", value: "SOUTH" },
  { label: "CHINHOYI", value: "CHINHOYI" },
  { label: "BINDURA", value: "BINDURA" },
  { label: "KADOMA", value: "KADOMA" },
  { label: "MARONDERA", value: "MARONDERA" },
  { label: "HARARE", value: "HARARE" },
  { label: "GWERU", value: "GWERU" },
  { label: "KWEKWE", value: "KWEKWE" },
  { label: "MUTARE", value: "MUTARE" },
  { label: "MANICALAND", value: "MANICALAND" },
  { label: "BULAWAYO", value: "BULAWAYO" },
  { label: "BULAWAYO_WEST", value: "BULAWAYO_WEST" },
  { label: "BULAWAYO_EAST", value: "BULAWAYO_EAST" },
  { label: "GWANDA", value: "GWANDA" },
] as const;

function UserCreationForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof UserCreationSchema>>({
    resolver: zodResolver(UserCreationSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      district: "EAST",
      role: "MANAGING DIRECTOR",
    },
  });

  const onSubmit = (values: z.infer<typeof UserCreationSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createUser(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        console.log(data);
      });
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 w-full bg-white lg:mt-2 p-5  h-[95%] lg:h-[70%]"
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
          {/*  <div className="lg:flex lg:flex-row lg:justify-between lg:space-x-5">
            <div className="w-full lg:w-1/2"> */}
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
          {/*   </div> */}
          {/*   <div className="w-full lg:w-1/2">
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
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </div> */}
          {/*  </div> */}

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Reference</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? districts.find(
                              (district) => district.value === field.value
                            )?.label
                          : "Select Reference"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 pt-2">
                    <Command>
                      <CommandInput placeholder="Search reference type..." />
                      <CommandList>
                        <CommandEmpty>No district selected.</CommandEmpty>
                        <CommandGroup>
                          {districts.map((district) => (
                            <CommandItem
                              value={district.label}
                              key={district.value}
                              onSelect={() => {
                                form.setValue("district", district.value);
                              }}
                            >
                              {district.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  district.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the district of the user
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Reference</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? roles.find((role) => role.value === field.value)
                              ?.label
                          : "Select Role"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 pt-2">
                    <Command>
                      <CommandInput placeholder="Search reference type..." />
                      <CommandList>
                        <CommandEmpty>No role selected.</CommandEmpty>
                        <CommandGroup>
                          {roles.map((role) => (
                            <CommandItem
                              value={role.label}
                              key={role.value}
                              onSelect={() => {
                                form.setValue("role", role.value);
                              }}
                            >
                              {role.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  role.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>This is the role of the user</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full">
          Create
        </Button>
      </form>
    </Form>
  );
}

export default UserCreationForm;
