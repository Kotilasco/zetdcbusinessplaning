//@ts-nocheck

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { gettaskedGroupedByStatusForMember } from "@/app/actions/taskgroupedbystatus";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaskDataVisualization from "@/components/TaskVisualization";
import TaskPage from "@/app/tasks/TaskPage";
import { getMemberById } from "@/app/actions/getTeamMembers";
import OverdueTask from "@/app/tasks/OverdueTasks";

export default async function MemberInfo({ params }: any) {
  const allStatuses = ["IN_PROGRESS", "COMPLETED", "PENDING", "CANCELLED"];

  // Colors for the Pie Chart
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61"];
  const data = await gettaskedGroupedByStatusForMember(params?.id);
  const member = await getMemberById(params?.id);

  console.log(data);

  const completeData = allStatuses.map((status) => {
    const found = data.find((item) => item.status === status);
    return found ? found : { taskCount: 0, status };
  });

  console.log(data);

  return (
    <DefaultLayout>
      <div className="p-4">
        <div className="mb-4 flex flex-col items-start md:flex-row md:space-x-4">
          <h1 className="text-xl font-bold">Information for: </h1>
          <p className="text-xl font-bold">
            {member?.firstname} {member?.lastname}
          </p>
        </div>
        <div className="mb-5 flex items-center justify-between space-y-2">
          <p className="text-lg text-muted-foreground">
            Email: <span className="font-semibold">{member?.email}</span>
          </p>
          <p className="text-lg text-muted-foreground ">
            Ec Number: <span className="font-semibold">{member?.ecNumber}</span>
          </p>
          <p className="text-lg text-muted-foreground">
            Designation:{" "}
            <span className="font-semibold">{member?.designation}</span>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
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
              <div className="text-2xl font-bold">
                {completeData.find((item) => item.status === "IN_PROGRESS")
                  ?.taskCount || 0}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
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
              <div className="text-2xl font-bold">
                {completeData.find((item) => item.status === "COMPLETED")
                  ?.taskCount || 0}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Tasks
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
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {" "}
                {completeData.find((item) => item.status === "PENDING")
                  ?.taskCount || 0}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
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
              <div className="text-2xl font-bold">
                {" "}
                {completeData.find((item) => item.status === "CANCELLED")
                  ?.taskCount || 0}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
        </div>
        <div className="">
          <h1 className="text-md mt-4 text-center font-bold uppercase text-blue-400">
            Tasks
          </h1>
          <TaskPage id={params?.id} />
        </div>

        <div className="">
          <h1 className="text-md mt-4 text-center font-bold uppercase text-blue-400">
            Overdue Tasks
          </h1>
          <OverdueTask id={params?.id} />
        </div>
      </div>
    </DefaultLayout>
  );
}
