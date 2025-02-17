//@ts-nocheck

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MONTHS } from "@/data/constants";

function WorkPlanModule() {
  const [workPlans, setWorkPlans] = useState([]);
  const [formData, setFormData] = useState({
    month: "",
    week: "",
    scope: "",
    teamMembers: [],
  });

  const [selectedMembers, setSelectedMembers] = useState([]);

  const teamMembers = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "Diana" },
  ];

  const handleToggleMember = (memberName) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(memberName)
        ? prevSelected.filter((name) => name !== memberName)
        : [...prevSelected, memberName],
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setWorkPlans([...workPlans, { ...formData, teamMembers: selectedMembers }]);
    setFormData({ month: "", week: "", scope: "", teamMembers: [] });
    setSelectedMembers([]);
  };

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Work Plan Module</h1>

        {/* Work Plan Table */}
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
                <td className="border p-2">{plan.teamMembers.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Work Plan Sheet */}
        <div className="mt-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" className="mt-5">
                Add Work Plan <PlusIcon size={16} className="ml-2" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Add Work Plan</SheetTitle>
                <SheetDescription>
                  Add a work plan for a particular month.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="mb-6 grid gap-4 py-4">
                {/* Month Input */}
                <div>
                  <Label htmlFor="month" className="font-medium">
                    Month
                  </Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Month</SelectLabel>
                        {MONTHS.map((month) => (
                          <SelectItem value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    id="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    placeholder="Enter month"
                    required
                  />
                </div>

                {/* Week Input */}
                <div>
                  <Label htmlFor="week" className="font-medium">
                    Week
                  </Label>
                  <Input
                    id="week"
                    name="week"
                    value={formData.week}
                    onChange={handleChange}
                    placeholder="Enter week"
                    required
                  />
                </div>

                {/* Scope Input */}
                <div>
                  <Label htmlFor="scope" className="font-medium">
                    Scope
                  </Label>
                  <Input
                    id="scope"
                    name="scope"
                    value={formData.scope}
                    onChange={handleChange}
                    placeholder="Enter scope"
                    required
                  />
                </div>

                {/* Team Members Multi-Select */}
                <div>
                  <Label htmlFor="teamMembers" className="font-medium">
                    Team Members
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex w-full items-center justify-between rounded border p-2">
                        {selectedMembers.length > 0
                          ? selectedMembers.join(", ")
                          : "Select team members"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="rounded border bg-white p-4 shadow-md"
                    >
                      <div className="flex flex-col space-y-2">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`member-${member.id}`}
                              checked={selectedMembers.includes(member.name)}
                              onCheckedChange={() =>
                                handleToggleMember(member.name)
                              }
                            />
                            <label
                              htmlFor={`member-${member.id}`}
                              className="text-sm"
                            >
                              {member.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="default">
                  Add Work Plan
                </Button>
              </form>
              <SheetFooter>
                <SheetClose asChild>
                  <Button hidden>Save Changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default WorkPlanModule;
