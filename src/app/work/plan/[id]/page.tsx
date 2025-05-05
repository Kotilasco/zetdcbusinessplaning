//@ts-nocheck

"use client";

import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { getAllWorkPlanById } from "@/app/actions/getWorkPlans";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import FileCard from "@/components/FileCard";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { getFiles } from "@/lib/actions/file.actions";

export default function TaskDetails({ params }) {
  const [data, setData] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workPlanData = await getAllWorkPlanById(params?.id);
        const filesData = await getFiles(params?.id);
        setData(workPlanData);
        setFiles(filesData?.documents || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params?.id]);
  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-gray-300"></div>
          <div className="mb-8 h-32 w-full animate-pulse rounded-md bg-gray-300"></div>
          <div className="mb-8 grid gap-4 lg:grid-cols-2">
            <div className="h-32 w-full animate-pulse rounded-md bg-gray-300"></div>
            <div className="h-32 w-full animate-pulse rounded-md bg-gray-300"></div>
          </div>
          <div className="mb-8 h-32 w-full animate-pulse rounded-md bg-gray-300"></div>
          <div className="h-32 w-full animate-pulse rounded-md bg-gray-300"></div>
        </div>
      </DefaultLayout>
    );
  }

  if (!data) {
    return (
      <DefaultLayout>
        <div>Task not found</div>
      </DefaultLayout>
    );
  }

  const scope = data?.scopes[0];

  console.log(files);

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="mb-6 rounded-md bg-white p-4 shadow-md">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Task Details
          </h1>
          <p className="text-sm text-gray-500">
            Analyzing and monitoring your tasks
          </p>
        </header>
        <section className="mb-8 rounded-md bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Scope Details
          </h2>
          <p className="text-gray-600">
            <strong>Status:</strong> {scope?.status}
          </p>
          <p className="text-gray-600">
            <strong>Details:</strong> {scope?.details}
          </p>
          <p className="text-gray-600">
            <strong>Start Date:</strong>{" "}
            {new Date(scope?.startDate).toDateString()}
          </p>
          <p className="text-gray-600">
            <strong>Target Completion Date:</strong>{" "}
            {new Date(scope?.targetCompletionDate).toDateString()}
          </p>
        </section>
        <section className="mb-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-md bg-white p-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-gray-700">
              General Information
            </h2>
            <p className="text-gray-600">
              <strong>Month:</strong> {data?.month}
            </p>
            <p className="text-gray-600">
              <strong>Week:</strong> {data?.week}
            </p>
            <p className="text-gray-600">
              <strong>Year:</strong> {data?.year}
            </p>
          </div>
          <div className="rounded-md bg-white p-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-gray-700">
              Expenditure
            </h2>
            <p className="text-gray-600">
              <strong>Actual Expenditure:</strong> ${data?.actualExpenditure}
            </p>
            <div className="mt-2 h-3 w-full rounded-lg bg-gray-200">
              <div
                className="h-3 rounded-lg bg-blue-600"
                style={{ width: `${data?.percentOfBudget || 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {parseFloat((data?.percentOfBudget || 0).toFixed(2))}% of Budget
              Used
            </p>
          </div>
        </section>
        <section className="mb-8 rounded-md bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Progress</h2>
          <div className="relative">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
              <CircularProgress
                percentage={parseFloat(
                  (data.percentageComplete || 0).toFixed(2),
                )}
              />
            </div>
            <p className="mt-2 text-center font-bold text-gray-800">
              {parseFloat((data.percentageComplete || 0).toFixed(2))}%
            </p>
            <p className="text-center text-sm text-gray-500">Task Completion</p>
          </div>
        </section>
        <section className="rounded-md bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Team Members
          </h2>
          {scope?.assignedTeamMembers?.map((member) => (
            <div key={member.id} className="flex flex-col space-y-2 ">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <p className="text-gray-600">
                  <strong>Name:</strong> {member?.firstname} {member?.lastname}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {member?.email}
                </p>
                <p className="text-gray-600">
                  <strong>EcNumber:</strong> {member?.ecNumber}
                </p>
              </div>
              <p className="mx-auto">
                <Button>
                  <Link href={`/team/members/${member.id}`}>View</Link>
                </Button>
              </p>
              <Separator className="my-2" />
            </div>
          ))}
        </section>
        <section className="rounded-md bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Files Uploaded For the Task
          </h2>
          {files.length <= 0 ? (
            <div>
              <p className="text-gray-600">No files uploaded</p>
            </div>
          ) : (
            <section className="file-list mt-2">
              {files.length > 0 ? (
                files?.map((file, i) => <FileCard key={i} file={file} />)
              ) : (
                <p className="text-gray-600">No files uploaded</p>
              )}
            </section>
          )}
        </section>
      </div>
    </DefaultLayout>
  );
}
export function CircularProgress({ percentage }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="h-32 w-32 -rotate-90 transform"
        width="100"
        height="100"
        viewBox="0 0 120 120"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center text-2xl font-bold text-gray-700">
        {percentage}%
      </div>
    </div>
  );
}
