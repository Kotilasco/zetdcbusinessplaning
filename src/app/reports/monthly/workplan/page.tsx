//@ts-nocheck
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
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
import DefaultLayout from "@/components/Layouts/DefaultLaout";

const SHEET_SIDES = ["right"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

function WorkPlanModule() {
  const [workPlans, setWorkPlans] = useState([]);
  const [formData, setFormData] = useState({
    month: "",
    week: "",
    scope: "",
    teamMembers: [],
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
    setWorkPlans([...workPlans, formData]);
    setFormData({ month: "", week: "", scope: "", teamMembers: [] });
  };

  console.log(workPlans);

  return (
    <DefaultLayout>
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Work Plan Module</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-black text-white">
          <tr>
            <th className="border p-2">Month</th>
            <th className="border p-2">Week</th>
            <th className="border p-2">Scope</th>
            <th className="border p-2">Team Members</th>
          </tr>
        </thead>
        <tbody>
          {workPlans.map((plan, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{plan.month}</td>
              <td className="border p-2">{plan.week}</td>
              <td className="border p-2">{plan.scope}</td>
              <td className="border p-2">{plan.teamMembers.join(" - ")}</td>
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
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Add Work plan</SheetTitle>
                <SheetDescription>
                  Add a work plan for a particular month
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="mb-6 grid gap-4 py-4">
                <div>
                  <label className="block font-medium">Month</label>
                  <input
                    type="text"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Week</label>
                  <input
                    type="text"
                    name="week"
                    value={formData.week}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Scope</label>
                  <input
                    type="text"
                    name="scope"
                    value={formData.scope}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Team Member</label>
                  {/* <input
                    type="text"
                    name="teamMember"
                    value={formData.teamMember}
                    onChange={handleChange}
                    className="w-full rounded border p-2"
                    required
                  /> */}

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
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white"
                >
                  Add Work Plan
                </button>
              </form>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" hidden>
                    Save changes
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
    </DefaultLayout>
  );
}

export default WorkPlanModule;
