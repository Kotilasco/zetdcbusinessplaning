//@ts-nocheck

import { useEffect, useState, useTransition } from "react";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

import React from "react";
import { useRouter } from "next/navigation";
import {
  getAllWorkPlanById,
  getAllWorkPlanByScopeId,
} from "@/app/actions/getWorkPlans";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
// import { getFiles } from "@/lib/actions/file.actions";
import FileCard from "@/components/FileCard";

 const getFiles = async (folder) => {
  try {
    if (!folder) {
      throw new Error("Folder parameter is required");
    }

    // const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/file?folder=${encodeURIComponent(folder)}`;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/file?folder=${encodeURIComponent(folder)}`;

    console.log("Fetching files from URL:", url);

    /* const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }); */
    const response = await fetch(new URL("/api/file?folder=158", process.env.NEXT_PUBLIC_SITE_URL));

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data?.documents || [];
  } catch (error) {
    console.error("Error fetching files:", error.message);
    return [];
  }
};

export default async function TaskDetails({ params }: any) {
  const data = await getAllWorkPlanById(params?.id);

  const files = await getFiles(params?.id);

  console.log(files);

  if (!data)
    return (
      <DefaultLayout>
        <div>Task not found</div>;
      </DefaultLayout>
    );

  const scope = data?.scopes[0];

  // console.log(data);

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/*  <button
        onClick={() => router.back()} // Go to the previous page
        className="mb-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        ← Back
      </button> */}
        {/* Page Header */}
        <header className="mb-6 rounded-md bg-white p-4 shadow-md">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Task Details
          </h1>
          <p className="text-sm text-gray-500">
            Analyzing and monitoring your tasks
          </p>
        </header>

        {/* Scope Section */}
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

        {/* Task Information Section */}
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

        {/* Progress Section */}
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

        {/* Team Section */}
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

        {/* files uploaded */}
        <section className="rounded-md bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Files Uploaded For the Task
          </h2>
          {files.length <= 0 ? (
            <section className="file-list mt-2">
              {files?.map((file: File, i: number) => (
                <FileCard key={i} file={file} />
              ))}
            </section>
          ) : (
            <div>
              <p className="text-gray-600">No files uploaded</p>
            </div>
          )}
        </section>
      </div>
    </DefaultLayout>
  );
}

export function CircularProgress({ percentage }) {
  const radius = 50; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const offset = circumference - (percentage / 100) * circumference; // Stroke offset for progress

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Circle */}
      <svg
        className="h-32 w-32 -rotate-90 transform"
        width="100"
        height="100"
        viewBox="0 0 120 120"
      >
        {/* Background Circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb" // Light gray background
          strokeWidth="10"
        />
        {/* Progress Circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#3b82f6" // Blue progress color
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage Text */}
      <span className="absolute text-xl font-bold text-blue-600">
        {percentage}%
      </span>
    </div>
  );
}
