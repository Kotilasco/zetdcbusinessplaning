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

import { Overview } from "@/components/AdminDashboard/Overview";
import { RecentSales } from "@/components/AdminDashboard/RecentActivities";

interface TableComponentProps {
  value: any;
}

const TableComponent: React.FC<TableComponentProps> = ({ value }) => {
  // Table data

  console.log(value);

  const data = [
    {
      outputStage: "1",
      description: "Output not commenced",
      startDate: "",
      finishDate: "",
      expenditure: "",
      responsibility: "",
    },
    {
      outputStage: "2",
      description: "Preparatory Actions",
      startDate: "",
      finishDate: "",
      expenditure: "",
      responsibility: "",
    },
    {
      outputStage: "Act 1",
      description: "CT Upgrades",
      startDate: "",
      finishDate: "",
      expenditure: "",
      responsibility: "Harare Region",
    },
    {
      outputStage: "Act 2",
      description:
        "Relocate 20MVA, 88KV Txf from Hwange Local to Vic Falls 88kv Sub",
      startDate: "January 2018",
      finishDate: "",
      expenditure: "USD 100 000",
      responsibility: "Regional Transmission West",
    },
    {
      outputStage: "Act 3",
      description:
        "Replace Ncema-Mzinyathini ‘H’ wood poles with steel monopole towers",
      startDate: "January 2015",
      finishDate: "",
      expenditure: "USD 300 000",
      responsibility: "Regional Transmission West",
    },
    {
      outputStage: "Act 4",
      description: "Commission ZIMPLATS 40MW Solar Plant",
      startDate: "Jan 2024",
      finishDate: "",
      expenditure: "",
      responsibility: "SMETO",
    },
    {
      outputStage: "Act 5",
      description: "Commission T&D Solar 40MW Plant",
      startDate: "Jan 2024",
      finishDate: "",
      expenditure: "",
      responsibility: "SMETO",
    },
    {
      outputStage: "Act 5",
      description: "Commission T&D Solar 40MW Plant",
      startDate: "Jan 2024",
      finishDate: "",
      expenditure: "",
      responsibility: "SMETO",
    },
  ];

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
            <Overview value="initial" />
          </TabsContent>
          <TabsContent value="quarter" className="space-y-4">
            <Overview value="quarter" />
          </TabsContent>
          <TabsContent value="half" className="space-y-4">
            <Overview value="half" />
          </TabsContent>
          <TabsContent value="quarterful" className="space-y-4">
            <Overview value="quarterful" />
          </TabsContent>
          <TabsContent value="finish" className="space-y-4">
            <Overview value="finish" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TableComponent;
