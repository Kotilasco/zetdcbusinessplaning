//@ts-nocheck
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusIcon } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

const SHEET_SIDES = ["right"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

function WeeklyReport() {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    activity: "",
    weeklyTarget: "",
    actualWorkDone: "",
    teamMembers: "",
    percentageComplete: "",
    actualExpenditure: "",
    budgetPercentage: "",
    remarks: "",
  });

  /* const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }; */

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === "select-multiple") {
      // Handle multi-select logic for teamMembers
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      // Handle other input fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const teamMembers = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "Diana" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setReports([...reports, formData]);
    setFormData({
      activity: "",
      weeklyTarget: "",
      actualWorkDone: "",
      teamMembers: [],
      percentageComplete: "",
      actualExpenditure: "",
      budgetPercentage: "",
      remarks: "",
    });
  };

  return (
    <DefaultLayout>
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Weekly Reporting Module</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-black text-white">
          <tr>
            <th className="border p-2">Activity</th>
            <th className="border p-2">Weekly Target</th>
            <th className="border p-2">Actual Work Done</th>
            <th className="border p-2">Team Members</th>
            <th className="border p-2">Percentage Complete</th>
            <th className="border p-2">Actual Expenditure</th>
            <th className="border p-2">% of Budget</th>
            <th className="border p-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{report.activity}</td>
              <td className="border p-2">{report.weeklyTarget}</td>
              <td className="border p-2">{report.actualWorkDone}</td>
              <td className="border p-2">{report.teamMembers.join(" - ")}</td>
              <td className="border p-2">{report.percentageComplete}</td>
              <td className="border p-2">{report.actualExpenditure}</td>
              <td className="border p-2">{report.budgetPercentage}</td>
              <td className="border p-2">{report.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid grid-cols-2 gap-2">
        {SHEET_SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild className="mt-5 w-24">
              <Button variant="default" size={"sm"} className="">
                Add <PlusIcon size={10} />
              </Button>
            </SheetTrigger>
            <SheetContent side={side} className="max-h-screen overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add Weekly Activity</SheetTitle>
                <SheetDescription>
                  Make changes to your activities here
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="mb-6 h-[50%] space-y-1 ">
                <div>
                  <label className="block font-medium">Activity</label>
                  <input
                    type="text"
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Weekly Target</label>
                  <input
                    type="number"
                    name="weeklyTarget"
                    value={formData.weeklyTarget}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Actual Work Done</label>
                  <input
                    type="number"
                    name="actualWorkDone"
                    value={formData.actualWorkDone}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">
                    Team Members Involved
                  </label>
                  <select
                    name="teamMembers" // Use the same name as in `formData`
                    value={formData.teamMembers} // Bind selected values
                    onChange={handleChange}
                    multiple // Enable multi-select
                    className="w-full rounded border p-2"
                    required
                  >
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium">
                    Percentage Complete
                  </label>
                  <input
                    type="number"
                    name="percentageComplete"
                    value={formData.percentageComplete}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">
                    Actual Expenditure
                  </label>
                  <input
                    type="number"
                    name="actualExpenditure"
                    value={formData.actualExpenditure}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">% of Budget</label>
                  <input
                    type="number"
                    name="budgetPercentage"
                    value={formData.budgetPercentage}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                  />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
    </DefaultLayout>
  );
}

export default WeeklyReport;
