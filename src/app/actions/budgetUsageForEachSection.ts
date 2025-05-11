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

  departmentId: string; // Added departmentId as a prop
};

const defaultProps: WeeklyTableProps = {
  currency: "USD", // Default value for currency
};

export async function getBudgetUsageForEachSection(data: WeeklyTableProps = {}) {


  const mergedData = {
    ...defaultProps,
    ...data,
  };
  const { year, month, currency,week, departmentId } = mergedData;
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
    url = `${baseUrl}/api/plans/department/budgetUsage/year/${year}/month/${month}/currency/${currency}/departmentId/${session?.user?.departmentId}`
  }else if(session?.user?.role === UserRoles.ROLE_SENIORMANAGER){
    url = `${baseUrl}/api/plans/department/budgetUsage/year/${year}/month/${month}/currency/${currency}/departmentId/${departmentId}`
  }
  else{
    url = `${baseUrl}/api/plans/department/budgetUsage/year/${year}/month/${month}/currency/${currency}/departmentId/${departmentId}`
  }

  console.log(url)

  try {
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
      throw new Error(`Failed to budget usage: ${response.statusText}`);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

 
}