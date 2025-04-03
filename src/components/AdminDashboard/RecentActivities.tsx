//@ts-nocheck

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { getAllWorkPlans } from "@/app/actions/getWorkPlans";
import Link from "next/link";
import { getAllWorkPlansBySection } from "@/app/actions/getWorkPlansBySection";
import { auth, signOut } from "@/auth";
import { UserRoles } from "@/next-auth.d";

export async function RecentActivities() {
  const session = await auth();
  let activities = [];
  if (session?.user.role == UserRoles.ROLE_ADMIN) {
    activities = await getAllWorkPlans();
  } else {
    activities = await getAllWorkPlansBySection();
  }

  // console.log(activities);
  //activities = activities.slice(0, 5);
  // Assuming activities is an array of objects with a field "updatedAt"
  activities = activities
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {activities?.length > 0 ? (
        activities.map((activity) => (
          <div className="flex items-center" key={activity.id}>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.scopes?.map((scope) => scope.details).join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.scopes
                  ?.flatMap((scope) =>
                    scope.assignedTeamMembers?.map(
                      (member) => member.firstname + " " + member.lastname,
                    ),
                  )
                  .join(" - ")}
              </p>
            </div>
            <div className="ml-auto font-medium">
              <Button>
                <Link href={`/work/plan/${activity.id}`}>View</Link>
              </Button>
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
            <p className="text-sm font-medium leading-none">
              No recent activities
            </p>
            <p className="text-sm text-muted-foreground">
              Head to workplans to create one
            </p>
          </div>
          <div className="ml-auto font-medium">
            <Link href="/reports/monthly/workplan">
              <Button size={"sm"}>Create</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
