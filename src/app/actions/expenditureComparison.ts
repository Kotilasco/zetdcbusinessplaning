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
  
  }

  const defaultProps: WeeklyTableProps = {
    currency: "USD", // Default value for currency
  };

export async function getWeeklyExpenditureComparison(data: WeeklyTableProps = {}) {
    const session = await auth();

    noStore();

    const mergedData = {
        ...defaultProps,
        ...data,
      };

   //console.log(mergedData)

    try {
      //  console.log("hello filtering");
        // /api/plans/expenditure/departmentId/{departmentId}/week/{week}/month/{month}/year/{year}/currency/{currency}

        let url = `${process.env.BASE_URL}/api/plans/expenditure/sectionId/${session?.user?.sectionId}/week/${mergedData.week}/month/${mergedData.month}/year/${mergedData.year}/currency/${mergedData.currency}`
        
        if(session?.user.role === UserRoles.ROLE_SENIORMANAGER){
url = `${process.env.BASE_URL}/api/plans/expenditure/departmentId/${session?.user?.departmentId}/week/${mergedData.week}/month/${mergedData.month}/year/${mergedData.year}/currency/${mergedData.currency}`
        }

        console.log(url);
        
        const response = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
            }
        );
       
        if (response.ok) {
            console.log("Successful");
            let app = await response.json(); // Extract the JSON data from the response
            console.log(app);
            return app;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    // revalidatePath("/dashboard/user/applications");
    // redirect("/dashboard/user/applications");
}