
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


export default function DashboardPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-[1080px] h-auto">
        <Breadcrumb page="IRBM" pageName="Quarterly" />
        
        <SelectReport type='irbm'  />
        
      </div>
    </>
  );
}
