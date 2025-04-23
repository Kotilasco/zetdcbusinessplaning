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
import { getOverdueTasksByDepartment } from "@/app/actions/getOverdueTasksByDepartment";
import { getOverDueTasksByDivision } from "@/app/actions/getOverduePlansByDivision";
import DivisionOverdueTask from "../DivisionOverdueTasks";

export default async function DivisionInfo({ params }: any) {
  console.log(params);
  const allStatuses = ["IN_PROGRESS", "COMPLETED", "PENDING", "CANCELLED"];

  // Colors for the Pie Chart
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61"];
  const data = await getOverDueTasksByDivision();

  console.log(data);

  return (
    <DefaultLayout>
      <div className="space-y-8 p-4">
        <DivisionOverdueTask />
      </div>
    </DefaultLayout>
  );
}
