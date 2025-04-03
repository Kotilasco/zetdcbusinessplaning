import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "./components/user-nav";
import { taskSchema } from "./data/schema";
import { getScopesForMemberById } from "@/app/actions/getTeamMembers";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getTasks(id: any) {
  /* const data = await fs.readFile(
    path.join(process.cwd(), "src/app/tasks/data/tasks.json"),
  ); */
  console.log("kkllllkkk");
  // console.log(id);

  const data = await getScopesForMemberById(id?.id);

  if (!data) {
    throw new Error("Failed to fetch tasks data from API");
  }
  const transformedData = data?.map((task: any) => {
    let priority = "low"; // Default priority

    // Assign priority based on the status
    switch (task.status) {
      case "IN_PROGRESS":
      case "OVERDUE":
        priority = "high";
        break;
      case "PENDING":
        priority = "medium";
        break;
      case "CANCELLED":
      case "COMPLETED":
        priority = "low";
        break;
      default:
        priority = "low"; // Fallback priority
    }

    return {
      id: task.id?.toString() || "N/A",
      title: task.details || "No title provided",
      status: task?.status?.toLowerCase() || "in_progress", // Convert status to lowercase
      label: "documentation", // Static value (can be dynamic if needed)
      priority, // Use the calculated priority
    };
  });

  console.log(transformedData);
  return z.array(taskSchema).parse(transformedData);
}

export default async function TaskPage(id: number) {
  const tasks = await getTasks(id);

  return (
    <>
      <div className="hidden h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
