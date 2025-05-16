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

  category?: string; // Added category property
};

const defaultProps: WeeklyTableProps = {
  currency: "USD", // Default value for currency
  category: "IN_PROGRESS", // Default value for category
};

export async function getDepartmentWorkSummary() {
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
    url = `${baseUrl}/api/plans/workplans/summary/section/${session?.user?.sectionId}/week/week${week}/month/${month}/year/${year}`
  }else if(session?.user?.role === UserRoles.ROLE_SENIORMANAGER){
    // changes to be made
    url = `${baseUrl}/api/plans/workplans/summary/section/${session?.user?.divisionId}/week/${week}/month/${month}/year/${year}`
  }
  else{
    url = `${baseUrl}/api/plans/workplans/summary/department/${session?.user?.departmentId}`
  }

  if(session?.user.role === UserRoles.ROLE_ADMIN){
url = `${baseUrl}/api/plans/workplans/summary/department/1`
  }

  console.log(url)
  console.log(session?.user?.role)

  try {
    console.log("Fetching summary...");
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

export async function getTaskDetailsForCategory(data: WeeklyTableProps = {}) {


  const mergedData = {
    ...defaultProps,
    ...data,
  };
  const { year, month, currency,week } = mergedData;
  //console.log(mergedData)

  const session = await auth();

  // Check if the session or token exists
  if (!session?.access_token) {
    throw new Error("Authentication failed. No access token found.");
  }

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error("BASE_URL is not defined in environment variables");
  }

  //console.log(session);

  let url;

  if(session?.user?.role === UserRoles.ROLE_MANAGER){
    url = `${baseUrl}/api/plans/workplans/summary/section/${session?.user?.sectionId}`
  }else if(session?.user?.role === UserRoles.ROLE_SENIORMANAGER){
    url = `${baseUrl}/api/plans/division-summary/division/${session?.user?.divisionId}/month/${month}/year/${year}/currency/${currency}`
  }
  else{
    url = `${baseUrl}/api/plans/workplans/summary/department/${session?.user?.departmentId}`
  }

  if(session?.user.role === UserRoles.ROLE_ADMIN){
url = `${baseUrl}/api/plans/workplans/summary/department/1`
  }

  //console.log(url)

  try {
   // console.log("Fetching summary...");
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

    //console.log(response)

    if (response.ok) {
      const app = await response.json(); // Extract JSON data from the response

   //   console.log(app)

      return app;
    } else {
      throw new Error(`Failed to division summary: ${response.statusText}`);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

 
}