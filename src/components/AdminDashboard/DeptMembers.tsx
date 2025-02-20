//@ts-nocheck

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { getAllWorkPlans } from "@/actions/getWorkPlans";
import Link from "next/link";
import { getMembersBySectionId } from "@/actions/getTeamMembers";

export async function Members() {
  const members = (await getMembersByDepartmentId()) || [];

  console.log(members);

  return (
    <div className="space-y-8">
      {members?.length > 0 ? (
        members.map((member) => (
          <div className="flex items-center" key={member.id}>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {member.firstname} {member.lastname}
              </p>
              <p className="text-sm text-muted-foreground">{members.email}</p>
            </div>
            <div className="ml-auto font-medium">
              <Button>View</Button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/03.png" alt="Avatar" />
            <AvatarFallback>NO</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">No members</p>
            <p className="text-sm text-muted-foreground">Create member</p>
          </div>
          <div className="ml-auto font-medium">
            <Link href="/">
              <Button size={"sm"}>Create</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
