"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { RegistrationFaultSchema } from "@/schema";
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
import { register } from "@/app/actions/register";
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

const references = [
  { label: "National Id", value: "id" },
  { label: "Passport Number", value: "passport" },
  { label: "Company Reg Number", value: "comreg" },
  { label: "Vehicle Reg Number", value: "reg" },
  { label: "other", value: "other" },
] as const;

function FaultForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof RegistrationFaultSchema>>({
    resolver: zodResolver(RegistrationFaultSchema),
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      faultNo: "",
      reference: "other",
      referenceNo: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegistrationFaultSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
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
          <div className="lg:flex lg:flex-row lg:justify-between lg:space-x-5">
            <div className="w-full lg:w-1/2">
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
            </div>
            <div className="w-full lg:w-1/2">
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
            </div>
          </div>
          <FormField
            control={form.control}
            name="faultNo"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fault Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter fault number"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is the fault number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reference"
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
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? references.find(
                              (reference) => reference.value === field.value,
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
                        <CommandEmpty>No Reference type selected.</CommandEmpty>
                        <CommandGroup>
                          {references.map((reference) => (
                            <CommandItem
                              value={reference.label}
                              key={reference.value}
                              onSelect={() => {
                                form.setValue("reference", reference.value);
                              }}
                            >
                              {reference.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  reference.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
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
                  This is the reference you used on application
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenceNo"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter reference number"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the reference number you used
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full">
          Create an account
        </Button>

        <div className="mx-auto mt-2 flex w-full items-center justify-center ">
          <h1 className="text-sm font-normal text-black underline">
            <Link href={"/auth/login"}>Already have an account?</Link>
          </h1>
        </div>
      </form>
    </Form>
  );
}

export default FaultForm;
