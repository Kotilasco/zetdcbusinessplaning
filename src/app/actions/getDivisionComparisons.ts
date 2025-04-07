// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";


interface DivProps {

    divisionId?: string;
  
    month?: string;

    year?: string;
  
  }
  const now = new Date();

  // Get the current year
  const currentYear = now.getFullYear();
  
  // Get the current month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[now.getMonth()];
  const dayOfMonth = now.getDate();
  const defaultProps: DivProps = {
    year: currentYear, 
    month: month
  };

export async function getDivisionComparison(data: DivProps) {
    const session = await auth();

    const mergedData = {
        ...defaultProps,
        ...data,
      };

    // Check if the session or token exists
    if (!session?.access_token) {
        throw new Error("Authentication failed. No access token found.");
    }

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error("BASE_URL is not defined in environment variables");
    }

    console.log(mergedData)

     let url = `${baseUrl}/api/plans/division/budgetVsActual/year/${mergedData.year}/month/${mergedData.month}/division/${mergedData?.divisionId}`;
    
    
        if (session?.user.role === UserRoles.ROLE_SENIORMANAGER) {
            url = `${baseUrl}/api/plans/division/budgetVsActual/year/${mergedData.year}/month/${mergedData.month}/division/${session?.user?.divisionId}`;
          }

          console.log(url)

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store", // Prevent caching
        });

        if (response.ok) {
            const app = await response.json(); // Extract JSON data from the response
            console.log("comparisons:", app);
            return app;
        } else {
            throw new Error(`Failed to fetch team members: ${response.statusText}`);
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // Uncomment these if necessary
    // revalidatePath("/dashboard/user/applications");
    // redirect("/dashboard/user/applications");
}