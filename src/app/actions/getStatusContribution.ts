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

  status: string; // Added status property

  departmentId?: string; // Added category property
};

const defaultProps: WeeklyTableProps = {
  status: "IN_PROGRESS", // Default value for category
};


export async function getStatusContribution(data: WeeklyTableProps = {}) {


  const mergedData = {
    ...defaultProps,
    ...data,
  };
  const { year, month, departmentId, status } = mergedData;
  //console.log(mergedData)

  let stat = status?.toUpperCase() || "IN_PROGRESS"; // Default to "IN_PROGRESS" if status is not provided

  if(stat == "IN PROGRESS"){
    stat = "IN_PROGRESS"
  }

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
    url = `${baseUrl}/api/plans/department/statusContribution/year/${year}/month/${month}/status/${stat}/departmentId/${departmentId}`
  }else if(session?.user?.role === UserRoles.ROLE_SENIORMANAGER){
    url = `${baseUrl}/api/plans/department/statusContribution/year/${year}/month/${month}/status/${stat}/departmentId/${departmentId}`
  }
  else{
    url = `${baseUrl}/api/plans/department/statusContribution/year/${year}/month/${month}/status/${stat}/departmentId/${departmentId}`
  }

  if(session?.user.role === UserRoles.ROLE_ADMIN){
url = `${baseUrl}/api/plans/department/statusContribution/year/${year}/month/${month}/status/${stat}/departmentId/${departmentId}`
  }

  console.log(url);

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
      throw new Error(`Failed to department status contribution summary: ${response.statusText}`);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

 
}