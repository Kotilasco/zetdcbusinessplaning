"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the groups and their pages
const groups = [
  {
    label: "DEPARTMENTAL PROFILE DATA",
    teams: [
      {
        label: "Departmental Profile",
        value: "dprofile",
      },
      {
        label: "Expenditure Performance (by Quarter)",
        value: "exp",
      },
      {
        label: "Human Resources Position",
        value: "hrp",
      },
    ],
  },
  {
    label: "NON-HOMOGENOUS (NON-ROUTINE/NON-RECURRENT) OUTPUTs",
    teams: [
      {
        label: "PoE - POWER AVAILABILITY INCREASED",
        value: "pav",
      },
      {
        label: "PoE - POWER DEMAND REDUCED",
        value: "pdr",
      },
      {
        label: "PoE - IMPROVED QUALITY OF POWER SUPPLY",
        value: "qps",
      },
      {
        label: "PoE - Number of clients connected increased",
        value: "ncc",
      },
      {
        label: "PoE - % Of revenue under prepaid increased from 40% to 54%",
        value: "revinc",
      },
      {
        label: "PoE - Revenue increased and profitability realized",
        value: "profit",
      },
      {
        label: "PoE - System Losses Reduced",
        value: "sysloss",
      },
      {
        label: "PoE - ACCIDENTS REDUCED",
        value: "accidents",
      },
      {
        label: "PoE - UTILISATION OF ICT SYSTEMS IMPROVED",
        value: "ict",
      },
      {
        label: "PoE - CLIENT SATISFACTION IMPROVED",
        value: "client",
      },
      {
        label: "GCG - EMPLOYEE SATISFACTION IMPROVED",
        value: "emp",
      },
    ],
  },
  {
    label: "HOMOGENOUS (ROUTINE/RECURRENT) OUTPUTs",
    teams: [
      {
        label: "PoE - TRANSMISSION MAINTENANCE COMBINED",
        value: "trans",
      },
      {
        label: "PoE - RTM EAST MAINTENCE",
        value: "rtm",
      },
      {
        label: "PoE - DISTRIBUTION REGIONS",
        value: "dist",
      },
      {
        label: "PoE - HARARE REGION",
        value: "hre",
      },
      {
        label: "PoE - EASTERN REGION",
        value: "east",
      },
      {
        label: "PoE - SOUTHERN REGION",
        value: "southern",
      },
      {
        label: "PoE - NOTHERN REGION",
        value: "nothern",
      },
      {
        label: "PoE - WESTERN REGION",
        value: "western",
      },
      {
        label: "PoE - Number of clients connected",
        value: "nncc",
      },
      {
        label: "PoE - IMPORT ARREARS REDUCED",
        value: "iar",
      },
      {
        label: "PoE - ZPC ARREARS REDUCED",
        value: "zpc",
      },
      {
        label: "PoE - IPP ARREARS REDUCED",
        value: "ipp",
      },
      {
        label: "PoE - TRANSMISSION REGIONS",
        value: "transreg",
      },
      {
        label: "PoE - Public awareness campaigns on vandalism increased: Distribution  Regions",
        value: "distreg",
      },
      {
        label: "PoE - Impoved Client Service - Power increased",
        value: "nicspav",
      },
      {
        label: "PoE - Power increased",
        value: "npai",
      },
      {
        label: "PoE - Power availability increased 2",
        value: "npav",
      },
      {
        label: "PoE - Systems Losses Reduced",
        value: "nsysloss",
      },
      {
        label: "GCG - Adherence to standards, engineering instructions, safety rules, procedures, distribution code, grid code, and supply code",
        value: "grid",
      },
    ],
  },
];

type Team = (typeof groups)[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [PageComponent, setPageComponent] =
    React.useState<React.ReactNode>(null);

  // Ref to scroll to the rendered page
  const pageRef = React.useRef<HTMLDivElement | null>(null);

  // Function to dynamically load the page
  const loadPage = async (pageValue: string) => {
    try {
      // Dynamically import the page based on the value
      const page = await import(
        `@/app/reports/quarterly/irbm/${pageValue}/page`
      );
      setPageComponent(<page.default />); // Set the page component

      // Scroll to the dynamically rendered content
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Delay to ensure rendering completes
    } catch (error) {
      console.error("Failed to load page:", error);
      setPageComponent(
        <div className="text-red-500">
          Error: The selected page could not be loaded.
        </div>,
      );
    }
  };

  return (
    <div className="h-auto w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a table"
            className={cn("w-full justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={"/images/logo/zetdc.png"}
                alt="ZC"
                className="grayscale"
              />
              <AvatarFallback>ZC</AvatarFallback>
            </Avatar>
            {selectedTeam ? selectedTeam.label : "Select a table..."}
            <ChevronsUpDown className="ml-auto text-white opacity-50 hover:text-accent-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <Command>
            <CommandInput placeholder="Select team..." />
            <CommandList>
              <CommandEmpty>No table found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team); // Update selected team
                        loadPage(team.value); // Load the appropriate page
                        setOpen(false); // Close the popover
                      }}
                      className="relative text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedTeam?.value === team.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>

      {/* Dynamically Rendered Page */}
      <div
        ref={pageRef} // Add ref to scroll to this section
        className="mt-6 h-auto rounded-md border bg-gray-50 p-4"
      >
        {PageComponent ? (
          <div>
            <h2 className="mb-4 text-lg font-bold">{selectedTeam?.label}</h2>
            {PageComponent}
          </div>
        ) : (
          <div className="text-gray-500">Select a report to view it.</div>
        )}
      </div>
    </div>
  );
}
