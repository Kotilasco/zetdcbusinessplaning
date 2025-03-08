//@ts-nocheck

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { getAllWorkPlans } from "@/app/actions/getWorkPlans";
import Link from "next/link";
import {
  getMembersByDepartmentId,
  getMembersBySectionId,
} from "@/app/actions/getTeamMembers";
import { auth, signOut } from "@/auth";
import { UserRoles } from "@/next-auth.d";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Donut from "../Donut";

export async function Members() {
  const session = await auth();
  let members = [];
  if (session?.user.role == UserRoles.ROLE_SENIORMANAGER) {
    members = (await getMembersByDepartmentId()) || [];
  } else {
    members = await getMembersBySectionId();
  }

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
              {/* <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">View</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] rounded-lg bg-white p-4 shadow-lg">
                  <div className="grid gap-4 ">
                    <Donut data={member.id} />
                  </div>
                </PopoverContent>
              </Popover> */}

              <div className="ml-auto font-medium">
                <Link href={`/team/members/${member.id}`}>
                  <Button>View</Button>
                </Link>
              </div>
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
