// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";

interface WeeklyTableProps {
  year?: string;
  
  month?: string;

  week?: string;

  currency?: string;
};

const defaultProps: WeeklyTableProps = {
  currency: "USD", // Default value for currency
};

export async function getOverDueTasksByDivision() {
  const session = await auth();

  // Check if the session or token exists
  if (!session?.access_token) {
    throw new Error("Authentication failed. No access token found.");
  }

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error("BASE_URL is not defined in environment variables");
  }

  const now = new Date();

  // Get the current year
  const year = now.getFullYear();
  
  // Get the current month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[now.getMonth()];
  const dayOfMonth = now.getDate();
  
  // Get the current week number
  const week = Math.ceil(dayOfMonth / 7);

  let url;



  if(session?.user?.role === UserRoles.ROLE_MANAGER){
    // to be changed
    url = `${baseUrl}/api/plans/overdue/division/${session?.user?.sectionId}/week/week1/month/March/year/${year}`
  }else if(session?.user?.role === UserRoles.ROLE_SENIORMANAGER){
   
    url = `${baseUrl}/api/plans/overdue/division/${session?.user?.divisionId}/week/week${week}/month/${month}/year/${year}`
  }
  else{
    // to be changed
    url = `${baseUrl}/api/plans/workplans/summary/department/${session?.user?.departmentId}`
  }

  if(session?.user.role === UserRoles.ROLE_ADMIN){
    // to be changed
url = `${baseUrl}/api/plans/workplans/summary/department/1`
  }

  try {
    console.log(url)
    ///api/teamMembers/department/{departmentId}
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store", // Prevent caching
      },
    );

    // console.log(response)

    if (response.ok) {
      const app = await response.json(); // Extract JSON data from the response

     // console.log(app)

      return app;
    } else {
      throw new Error(`Failed to department summary: ${response.statusText}`);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Uncomment these if necessary
  // revalidatePath("/dashboard/user/applications");
  // redirect("/dashboard/user/applications");
}
