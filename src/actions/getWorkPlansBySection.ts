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

export async function getAllWorkPlansBySection(data: WeeklyTableProps) {
    const session = await auth();

    noStore();

    console.log(session)

    try {
        console.log("hello filtering");
        // /api/plans/findBy/departmentId/{departmentId}

        let url = `${process.env.BASE_URL}/api/plans/findBy/sectionId/${session?.user?.sectionId}`

        if(session?.user.role === UserRoles.ROLE_SENIORMANAGER){
            url = `${process.env.BASE_URL}/api/plans/findBy/departmentId/${session?.user?.departmentId}`
                    }
       
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
