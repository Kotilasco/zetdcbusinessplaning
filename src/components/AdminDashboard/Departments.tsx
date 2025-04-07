//@ts-nocheck

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { getDepartments } from "@/app/actions/getDepartments";
import { getDepartmentsByDivisionId } from "@/app/actions/getDepartmentsByDivisionId";
import Link from "next/link";

export async function Departments() {
  const departments = (await getDepartmentsByDivisionId()) || [];

  console.log(departments);

  return (
    <div className="space-y-8">
      {departments !== null ? (
        departments.assignedDepartments.map((department) => (
          <div className="flex items-center" key={department.id}>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {department.name}
              </p>
            </div>

            <div className="ml-auto font-medium">
              <Link href={`/department/${department.id}`}>
                <Button>View</Button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center">
          <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
            <AvatarImage src="/avatars/02.png" alt="Avatar" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Jackson Lee</p>
            <p className="text-sm text-muted-foreground">
              jackson.lee@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">+$39.00</div>
        </div>
      )}
    </div>
  );
}
