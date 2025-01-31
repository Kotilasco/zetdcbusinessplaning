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
import { REVINC } from "@/components/Tables/IRBM/REVINC";

interface TableComponentProps {
  value: any;
  year: string;
  quarter: string;
  table?: string;
}

const TableComponent: React.FC<TableComponentProps> = ({ year, quarter }) => {
  // Table data

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
            <REVINC value="initial" />
          </TabsContent>
          <TabsContent value="quarter" className="space-y-4">
            <REVINC value="quarter" />
          </TabsContent>
          <TabsContent value="half" className="space-y-4">
            <REVINC value="half" />
          </TabsContent>
          <TabsContent value="quarterful" className="space-y-4">
            <REVINC value="quarterful" />
          </TabsContent>
          <TabsContent value="finish" className="space-y-4">
            <REVINC value="finish" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TableComponent;
