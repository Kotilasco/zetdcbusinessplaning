"use client";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CardWrapper } from "./CardWrapper";
import { fetchByPjob, fetchRate, icsVerification } from "@/actions/ics";
import { IcsVerificationSchema } from "@/schema";
import { useRouter } from "next/navigation";

const references = [
  { label: "National Id", value: "id" },
  { label: "Passport Number", value: "passport" },
  { label: "Company Reg Number", value: "comreg" },
  { label: "Vehicle Reg Number", value: "reg" },
  { label: "other", value: "other" },
] as const;

export function ComboboxForm() {
  const form = useForm<z.infer<typeof IcsVerificationSchema>>({
    resolver: zodResolver(IcsVerificationSchema),
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = (values: z.infer<typeof IcsVerificationSchema>) => {
    console.log("k");
    setError("");
    setSuccess("");

    console.log(values);
    startTransition(() => {
      fetchByPjob(values?.pjob).then((data) => {
        console.log(data);
        /* setError(data?.error);
        setSuccess(data?.success);

        if (data?.success) {
          // Perform redirect here
          router.push(data?.redirect);
        } */
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Verify Details"
      backButtonLabel={`Already have an account`}
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="pjob"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pjob Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter pjob number"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the Pjob reference number
                </FormDescription>
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
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? references.find(
                              (reference) => reference.value === field.value
                            )?.label
                          : "Select Reference"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 pt-1">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
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
                <FormLabel>Pjob Number</FormLabel>
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
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
