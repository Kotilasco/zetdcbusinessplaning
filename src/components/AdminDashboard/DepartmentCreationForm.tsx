"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { DepartmentCreationSchema } from "@/schema";
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
import { createDepartment } from "@/actions/createDepartment";

function DepartmentCreationForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [sections, setSections] = useState([""]); // Initialize with one section
  const form = useForm({
    resolver: zodResolver(DepartmentCreationSchema),
    defaultValues: {
      name: "",
      sections: [""],
    },
  });

  const addSection = () => {
    setSections([...sections, ""]);
  };
  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleSectionChange = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index] = value;
    setSections(newSections);
  };

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const onSubmit = (values: z.infer<typeof DepartmentCreationSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createDepartment(values).then((data) => {
        console.log(data);
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Department Name"
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
          {sections.map((section, index) => (
            <div
              key={index}
              className="lg:flex lg:flex-row lg:justify-between lg:space-x-5"
            >
              <div className="w-full lg:w-1/2">
                <FormField
                  control={form.control}
                  name={`sections.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section {index + 1}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Section ${index + 1}`}
                          type="text"
                          onChange={(e) => {
                            field.onChange(e);
                            handleSectionChange(index, e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button type="button" onClick={addSection}>
            Add Section
          </Button>
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

export default DepartmentCreationForm;
