//@ts-nocheck

"use client";

import React, { useEffect, useState, useTransition } from "react";
import * as z from "zod";
import { MemberCreationSchema } from "@/schema";
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
import { createUser, register } from "@/actions/register";
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
import { getDepartments } from "@/actions/getDepartments";
import { createMember } from "@/actions/createMember";

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

function MemberCreationForm() {
  const [isPending, startTransition] = useTransition();
  const [departments, setDepartments] = useState(null);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof MemberCreationSchema>>({
    resolver: zodResolver(MemberCreationSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      designation: "",
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getDepartments();

        setDepartments(response);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submitted]);

  function onSubmit(values: z.infer<typeof MemberCreationSchema>) {
    startTransition(async () => {
      console.log("kkkk");
      await createMember(values)
        .then((res) => {
          console.log(res);
          form.reset();
          setSubmitted((prev) => !prev);
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
          {departments != null && departments.length > 0 && (
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Department</FormLabel>
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
                            ? departments.find(
                                (department) => department.id === field.value,
                              )?.name
                            : "Select Department"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 pt-2">
                      <Command>
                        <CommandInput placeholder="Search department..." />
                        <CommandList>
                          <CommandEmpty>No department selected.</CommandEmpty>
                          <CommandGroup>
                            {departments.map((department) => (
                              <CommandItem
                                value={department.id}
                                key={department.id}
                                onSelect={() => {
                                  form.setValue("department", department.id); // Set department ID
                                  form.setValue("section", ""); // Reset section on department change
                                }}
                              >
                                {department.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    department.id === field.value
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
                    This is the department of the user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch("department") && (
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => {
                const selectedDepartmentId = form.watch("department");
                const sections =
                  departments.find(
                    (department) => department.id === selectedDepartmentId,
                  )?.assignedSections || []; // Get sections for the selected department

                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Section</FormLabel>
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
                              ? sections.find(
                                  (section) => section.id === field.value,
                                )?.name
                              : "Select Section"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 pt-2">
                        <Command>
                          <CommandInput placeholder="Search section..." />
                          <CommandList>
                            <CommandEmpty>No section selected.</CommandEmpty>
                            <CommandGroup>
                              {sections.map((section) => (
                                <CommandItem
                                  value={section.id}
                                  key={section.id}
                                  onSelect={() => {
                                    form.setValue("section", section.id); // Set section ID
                                  }}
                                >
                                  {section.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      section.id === field.value
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
                      This is the section within the selected department
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
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

export default MemberCreationForm;
