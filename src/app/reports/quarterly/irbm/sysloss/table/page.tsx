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
import { Profit } from "@/components/Tables/IRBM/Profit";
import { HeaderProps } from "@/components/Tables/IRBM/Profit";

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
    kraref: "KRA 1",
    outcome: "Impoved Operational Efficiency",
    outcomeref: "OC 3",
    output: "System Losses Reduced",
    outputref: "NHO18",
  };

  return (
    <div className="p-4">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="initial" className="space-y-4">
          <TabsList>
            <TabsTrigger value="initial">Initial</TabsTrigger>
            <TabsTrigger value="quarter">25% Complete</TabsTrigger>
            <TabsTrigger value="half">50% Complete</TabsTrigger>
            <TabsTrigger value="quarterful">75% Complete</TabsTrigger>
            <TabsTrigger value="finish">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="initial" className="space-y-4">
            <Profit value="initial" headerProps={headerProps} />
          </TabsContent>
          <TabsContent value="quarter" className="space-y-4">
            <Profit value="quarter" headerProps={headerProps} />
          </TabsContent>
          <TabsContent value="half" className="space-y-4">
            <Profit value="half" headerProps={headerProps} />
          </TabsContent>
          <TabsContent value="quarterful" className="space-y-4">
            <Profit value="quarterful" headerProps={headerProps} />
          </TabsContent>
          <TabsContent value="finish" className="space-y-4">
            <Profit value="finish" headerProps={headerProps} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TableComponent;
