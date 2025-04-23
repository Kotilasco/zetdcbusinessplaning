"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import TableComponent from "./IRBM";
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
import { MONTHS, QUARTERS } from "@/data/constants";

/* interface Report {
  value: string;
  label: string;
} */

const years = Array.from({ length: 5 }, (_, i) => 2023 + i); // Generate years from 1990 to current year

/* const quarters: Report[] = [
  { value: "q1", label: "Q1" },
  { value: "q2", label: "Q2" },
  { value: "q3", label: "Q3" },
  { value: "q4", label: "Q4" },
]; */

interface SelectReportProps {
  type: string;
  table?: string;
}

const STATUSES = [
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "RE_SCHEDULED", label: "Re-Scheduled" }
];

export function YearlyReport() {
  const [openYear, setOpenYear] = React.useState(false);
  const [openQuarter, setOpenQuarter] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);

  const [selectedYear, setSelectedYear] = React.useState<string | null>(null);
  const [selectedQuarter, setSelectedQuarter] = React.useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);

  const Component = dynamic(
    () => {
      if (selectedYear && selectedQuarter && selectedStatus) {
        return import(`@/app/reports/yearly/table/page`);
      } else {
        return Promise.resolve(() => null);
      }
    },
    {
      loading: () => <p>Loading...</p>,
      ssr: false,
    }
  );

  return (
    <>
      <div className="flex h-auto gap-2">
        {/* Quarter Dropdown */}
        <Popover open={openQuarter} onOpenChange={setOpenQuarter}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openQuarter}
              className="w-[150px] justify-between"
            >
              {selectedQuarter ? selectedQuarter : "Select Quarter"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {QUARTERS.map((quarter) => (
                    <CommandItem
                      key={quarter.value}
                      value={quarter.value}
                      onSelect={(currentValue) => {
                        setSelectedQuarter(currentValue);
                        setOpenQuarter(false);
                      }}
                    >
                      {quarter.label}
                      <Check className={cn(
                        "ml-auto",
                        selectedQuarter === quarter.value ? "opacity-100" : "opacity-0"
                      )} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Year Dropdown */}
        <Popover open={openYear} onOpenChange={setOpenYear}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openYear}
              className="w-[150px] justify-between"
            >
              {selectedYear ? selectedYear : "Select Year"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {years.map((year) => (
                    <CommandItem
                      key={year}
                      value={year.toString()}
                      onSelect={(currentValue) => {
                        setSelectedYear(currentValue);
                        setOpenYear(false);
                      }}
                    >
                      {year}
                      <Check className={cn(
                        "ml-auto",
                        selectedYear === year.toString() ? "opacity-100" : "opacity-0"
                      )} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Status Dropdown */}
        <Popover open={openStatus} onOpenChange={setOpenStatus}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStatus}
              className="w-[150px] justify-between"
            >
              {selectedStatus ? selectedStatus : "Select Status"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {STATUSES.map((status) => (
                    <CommandItem
                      key={status.value}
                      value={status.value}
                      onSelect={(currentValue) => {
                        setSelectedStatus(currentValue);
                        setOpenStatus(false);
                      }}
                    >
                      {status.label}
                      <Check className={cn(
                        "ml-auto",
                        selectedStatus === status.value ? "opacity-100" : "opacity-0"
                      )} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedYear && selectedQuarter && selectedStatus && (
        <Suspense fallback={<p>Loading...</p>}>
          {/* @ts-ignore */}
          <Component
            year={selectedYear}
            quarter={selectedQuarter}
            status={selectedStatus}
          />
        </Suspense>
      )}
    </>
  );
}
