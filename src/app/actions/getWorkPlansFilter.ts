// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";


export type team = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    ecNumber: string;
    designation: string;

}

export type workPlans = {

    id: number;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    month: string;
    week: string;
    weeklyTarget: string;
    actualWorkDone: string;
    percentageComplete: number | null;
    actualExpenditure: number | null;
    percentOfBudget: number | null;
    remarks: string;
    scopes: [
        {
            details: string;
            assignedTeamMembers: team[]
        }
    ];
}

interface WeeklyTableProps {

    year?: string;
  
    month?: string;
  
    week?: string;
  
  }

export async function getAllWorkPlansFilter(data: WeeklyTableProps) {
    const session = await auth();

    noStore();

   console.log(session)

    try {
       // console.log("hello filtering");
        // /api/plans/findBy/{sectionId}/{week}/{month}/{year}

        let url = `${process.env.BASE_URL}/api/plans/findBy/sectionId/${session?.user?.sectionId}/${data.week}/${data.month}/${data.year}`
        
        if(session?.user.role === UserRoles.ROLE_SENIORMANAGER){
url = `${process.env.BASE_URL}/api/plans/findBy/division/${session?.user?.divisionId}/week/${data.week}/month/${data.month}/year/${data.year}`
//http://localhost:8080/api/plans/findBy/division/1/week/week4/month/April/year/2025
        }

        console.log(url)
        
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
       console.log(response)
        if (response.ok) {
            console.log("Successful");
            let app: workPlans = await response.json(); // Extract the JSON data from the response
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
