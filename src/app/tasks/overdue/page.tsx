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

export default async function DivisionInfo({ params }: any) {
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
      <div className="p-4 space-y-8">
        {Object.entries(groupedPlans).map(([sectionId, sectionPlans]) => {
          const section = sectionDetails[sectionId] || {};
          const allStatuses = ["IN_PROGRESS", "COMPLETED", "PENDING", "CANCELLED"];

          // Aggregate task counts for statuses
          const completeData = allStatuses.map((status) => {
            const taskCount = sectionPlans.filter((plan) =>
              plan.scopes.some((scope) => scope.status === status)
            ).length;
            return { status, taskCount };
          });

          return (
            <div key={sectionId} className="space-y-4">
              <h2 className="text-lg font-bold text-blue-500">
                Section: {section?.name || `Section ID ${sectionId}`}
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {completeData.map(({ status, taskCount }) => (
                  <Card key={status}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{status}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{taskCount}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <h1 className="text-md mt-4 text-center font-bold uppercase text-blue-400">
                  Tasks
                </h1>
                <TaskPage id={sectionId} />
              </div>

              <div>
                <h1 className="text-md mt-4 text-center font-bold uppercase text-blue-400">
                  Overdue Tasks
                </h1>
                <OverdueTask id={sectionId} />
              </div>
            </div>
          );
        })}
      </div>
    </DefaultLayout>
  );
}
