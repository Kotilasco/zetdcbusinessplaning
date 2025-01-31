"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RecentSales } from "@/components/AdminDashboard/RecentSales";
import { Trans } from "@/components/Tables/IRBM/Trans";
import { HeaderProps } from "@/components/Tables/IRBM/Trans";

interface TableComponentProps {
  value: any;
  year: string;
  quarter: string;
  table?: string;
}

const TableComponent: React.FC<TableComponentProps> = ({ year, quarter }) => {
  // Table data

  const headerProps: HeaderProps = {
    kra: "Provision of Electricity",
    kraref: "PROG 2",
    outcome: "Impoved Quality Of Power Supply",
    outcomeref: "OC2.2",
    output:
      "Number of faults reduced, duration of faults reduced: Harare Region",
    outputref: "HMO",
  };

  return (
    <div className="p-4">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Trans value="initial" headerProps={headerProps} />
      </div>
    </div>
  );
};

export default TableComponent;
