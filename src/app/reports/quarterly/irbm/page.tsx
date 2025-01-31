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

export default function DashboardPage() {
  return (
    <>
      <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between p-4 text-lg font-bold capitalize">
        <h1>IRBM QUARTERLY REPORT</h1>
      </div>
      <div className="mt-4 flex-col md:flex">
        <div className="border-b">
          <div className="h-auto w-full items-center px-4">
            <TeamSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
