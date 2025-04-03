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
import { MONTHS, WEEKS, CURRENCY } from "@/data/constants";

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

export function WeeklyReport() {
  const [openYear, setOpenYear] = React.useState(false);
  const [openWeek, setOpenWeek] = React.useState(false);

  const [openCurrency, setOpenCurrency] = React.useState(false);

  const [openMonth, setOpenMonth] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = React.useState<string | null>(
    null,
  );
  const [selectedWeek, setSelectedWeek] = React.useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);

  const Component = dynamic(
    () => {
      if (selectedYear && selectedWeek && selectedMonth) {
        return import(`@/app/reports/weekly/table/page`);
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
      <div className="flex h-auto gap-2">
        <Popover open={openWeek} onOpenChange={setOpenWeek}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openWeek}
              className="w-[100px] justify-between"
            >
              {selectedWeek ? selectedWeek : "Select Week"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[100px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {WEEKS.map((week) => (
                    <CommandItem
                      key={week.value}
                      value={week.value}
                      onSelect={(currentValue) => {
                        setSelectedWeek(currentValue);
                        setOpenWeek(false);
                      }}
                    >
                      {week.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedWeek === week.value
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

        <Popover open={openMonth} onOpenChange={setOpenMonth}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openMonth}
              className="w-[100px] justify-between"
            >
              {selectedMonth ? selectedMonth : "Select Month"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[100px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {MONTHS.map((month) => (
                    <CommandItem
                      key={month.value}
                      value={month.value}
                      onSelect={(currentValue) => {
                        setSelectedMonth(currentValue);
                        setOpenMonth(false);
                      }}
                    >
                      {month.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedMonth === month.value
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
        <Popover open={openYear} onOpenChange={setOpenYear}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openYear}
              className="w-[100px] justify-between"
            >
              {selectedYear ? selectedYear : "Select Year"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[100px] p-0">
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
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedYear === year.toString()
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

        <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCurrency}
              className="w-[100px] justify-between"
            >
              {selectedCurrency ? selectedCurrency : "Select Currency"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[100px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {CURRENCY.map((curr) => (
                    <CommandItem
                      key={curr.value}
                      value={curr.value}
                      onSelect={(currentValue) => {
                        setSelectedCurrency(currentValue);
                        setOpenCurrency(false);
                      }}
                    >
                      {curr.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedMonth === curr.value
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
      </div>

      {selectedYear && selectedMonth && selectedWeek && (
        <Suspense fallback={<p>Loading...</p>}>
          {/* @ts-ignore */}
          <Component
            year={selectedYear}
            month={selectedMonth}
            week={selectedWeek}
            currency={selectedCurrency ?? undefined}
          />
        </Suspense>
      )}
    </>
  );
}
