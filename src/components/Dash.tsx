import { Metadata } from "next";
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
import { MainNav } from "@/components/AdminDashboard/MainNav";
import { Overview } from "@/components/AdminDashboard/Overview";
import { RecentActivities } from "@/components/AdminDashboard/RecentActivities";
import { Search } from "@/components/AdminDashboard/Search";
import TeamSwitcher from "@/components/AdminDashboard/TeamSwitcher";
import { UserNav } from "@/components/AdminDashboard/UserNav";
import { ComboboxForm } from "./auth/Reference";
import RegForm from "./auth/regfrom";
import UserCreationForm from "./auth/user-creation";
import { currentRole } from "@/lib/auth";
import { UserRoles } from "@/next-auth.d";
import { Departments } from "./AdminDashboard/Departments";
import DepartmentCreationForm from "./AdminDashboard/DepartmentCreationForm";
import MemberCreationForm from "./auth/member-creation";
import { hasPermission } from "@/permissions";
import MemberCreationByManagerForm from "./auth/member-creation-by-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Members } from "./AdminDashboard/Members";
import { getAllWorkPlansBySection } from "@/app/actions/getWorkPlansBySection";
import { processTaskData } from "@/lib/utils/processData";

// Simulate a server-side data fetch (replace with your actual fetch logic)
async function fetchRevenueData() {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { totalRevenue: "$45,231.08", growth: "+20.000%" };
}

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Customer Supplied Materials Scheme System's dashboard.",
};

const rev = await getAllWorkPlansBySection();

const revenueData = processTaskData(rev);

function SkeletonLoader() {
  return (
    <div>
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

async function RevenueData({
  revenueDataPromise,
}: {
  revenueDataPromise: Promise<{
    totalRevenue: string;
    growth: string;
    statusCounts: { [key: string]: number };
  }>;
}) {
  console.log(revenueData);
  return (
    <div>
      <div className="text-2xl font-bold">{revenueData.totalExpenditure}</div>
      <p className="text-xs text-muted-foreground">Total expenditure</p>
    </div>
  );
}

export default async function DashboardPage() {
  const role = await currentRole();
  const revenueDataPromise = fetchRevenueData();

  return (
    <>
      <div className=" flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="hidden md:block"></div>

            <MainNav className="mx-6" />

            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="hidden items-center justify-between space-y-2 md:flex">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Print Report</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4 px-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              {role && hasPermission([role], "create:member") && (
                <TabsTrigger value="create">Create Team Member</TabsTrigger>
              )}
              {role && hasPermission([role], "create:user") && (
                <TabsTrigger value="user">Create User</TabsTrigger>
              )}
              {role && hasPermission([role], "create:teammember") && (
                <TabsTrigger value="teammember">Team Member</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subscriptions
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div> */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>
                      {role && hasPermission([role], "create:department") && (
                        <p>Create Department</p>
                      )}
                      {role && hasPermission([role], "view:members") && (
                        <p>Section Team Members</p>
                      )}

                      {role && hasPermission([role], "view:deptmembers") && (
                        <p>Department Team Members</p>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {role && hasPermission([role], "create:department") && (
                      <DepartmentCreationForm />
                    )}
                    {role && hasPermission([role], "view:members") && (
                      <Members />
                    )}
                    {role && hasPermission([role], "view:deptmembers") && (
                      <Members />
                    )}
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>
                      The current recent activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivities />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Expenditure
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<SkeletonLoader />}>
                      {/* Fetch and display actual data */}
                      <RevenueData revenueDataPromise={revenueDataPromise} />
                    </Suspense>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Overdue Tasks
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      +{revenueData?.overdueCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Number of tasks past the due date
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      IN PROGRESS
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.4" />
                      <path d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {revenueData?.statusCounts["IN_PROGRESS"] || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Number of tasks currently being worked on
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {revenueData?.statusCounts["COMPLETED"] || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Number of completed tasks
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                {role && hasPermission([role], "view:department") && (
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Departments</CardTitle>
                      <CardDescription>The departments present</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Departments />
                    </CardContent>
                  </Card>
                )}

                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>
                      The current recent activities actioned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivities />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="create" className="space-y-4">
              <div className="grid gap-4 ">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Member Creation</CardTitle>
                    <CardDescription>Creating a team member</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <MemberCreationForm />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="user" className="space-y-4">
              <div className="grid gap-4 ">
                <Card>
                  <CardHeader>
                    <CardTitle>User Creation</CardTitle>
                    <CardDescription>
                      Creating an account for a user
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <UserCreationForm />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="teammember" className="space-y-4">
              <div className="grid gap-4 ">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Member Creation</CardTitle>
                    <CardDescription>Creating your team member</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <MemberCreationByManagerForm />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
