"use client";

import * as React from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { Suspense } from "react";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import TableComponent from "@/app/reports/monthly/Departmental";

const reports = [
  {
    value: "irbm",

    label: "IRBM",
  },

  {
    value: "md",

    label: "MD's Brief",
  },
  {
    value: "performance",

    label: "Perfomance Indicator",
  },
];

interface SelectReportProps {
  type: string;
}

export function SelectReport({ type }: SelectReportProps) {
  const [open, setOpen] = React.useState(false);

  const [value, setValue] = React.useState("");

  const Component = dynamic(
    () => {
      if (value) {
        return import(`@/app/reports/${type}/${value}/page.tsx`);
      } else {
        return Promise.resolve(() => null);
      }
    },
    {
      loading: () => <p>Loading...</p>,

      ssr: false,
    },
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? reports.find((report) => report.value === value)?.label
              : "Select report..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search report..." className="h-9" />
            <CommandList>
              <CommandEmpty>No report selected.</CommandEmpty>
              <CommandGroup>
                {reports.map((report) => (
                  <CommandItem
                    key={report.value}
                    value={report.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);

                      setOpen(false);
                    }}
                  >
                    {report.label}
                    <Check
                      className={cn(
                        "ml-auto",

                        value === report.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <Suspense fallback={<p>Loading...</p>}>
          <Component />
        </Suspense>
      )}
    </>
  );
}
