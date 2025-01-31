import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/AdminDashboard/CalenderDateRangePicker";
import TeamSwitcher from "@/components/AdminDashboard/TeamSwitcher";
import { UserNav } from "@/components/AdminDashboard/UserNav";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SelectReport } from "@/components/Reports/IRBMQuarter";
import { PerformanceIndicator } from "@/components/Tables/PerformanceIndicator";
import AverageCapacityChart from "@/components/Graphs/AvgCapacity";
import TotalSystemLossesTrendChart from "@/components/Graphs/SysLossTrend";
import TransmissionLossesTrendChart from "@/components/Graphs/TransmissionLossTrend";
import DistributionLossesTrendChart from "@/components/Graphs/DistLossTrend";
import AccidentsTable from "@/components/MD/AccidentsTable";

export default function DashboardPage() {
  return (
    <>
      <div className="mx-auto h-auto w-full max-w-[1080px]">
        <Breadcrumb page="Perfomance Indicator" pageName="Yearly" />

        <PerformanceIndicator value="kkk" />

        <AverageCapacityChart />
        <TotalSystemLossesTrendChart />
        <TransmissionLossesTrendChart />
        <DistributionLossesTrendChart />
        <AccidentsTable />
      </div>
    </>
  );
}
