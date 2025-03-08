// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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


export async function getAllWorkPlans() {
    console.log("kkkkkkssssdddd")
    const session = await auth();

    console.log(session)

    noStore();

    try {
        console.log("hello");
        const response = await fetch(
            `${process.env.BASE_URL}/api/plans/findAll`,
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
            let app: workPlans = await response.json(); // Extract the JSON data from the response
           // console.log(app);
            return app;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    // revalidatePath("/dashboard/user/applications");
    // redirect("/dashboard/user/applications");
}


export async function getAllWorkPlanByScopeId(scopeId: any) {
    const session = await auth();

    console.log(scopeId)

    noStore();

    try {
        console.log("hello");
        const response = await fetch(
            `${process.env.BASE_URL}/api/plans/scopes/${scopeId}/workplan`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
            }
        );
        if (response.ok) {
            // console.log("Successful");
            let app = await response.json(); // Extract the JSON data from the response
           // console.log(app);
            return app;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    // revalidatePath("/dashboard/user/applications");
    // redirect("/dashboard/user/applications");
}

export async function getAllWorkPlanById(workPlanId: any) {
    const session = await auth();

    noStore();

    try {
        console.log("hello");
        const response = await fetch(
            `${process.env.BASE_URL}/api/plans/findById/${workPlanId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
            }
        );
        if (response.ok) {
            // console.log("Successful");
            let app = await response.json(); // Extract the JSON data from the response
           // console.log(app);
            return app;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    // revalidatePath("/dashboard/user/applications");
    // redirect("/dashboard/user/applications");
}

export async function getWorkPlanByScopeId(scopeId: any) {
    const session = await auth();

    console.log(scopeId)

    noStore();

    try {
        console.log("hello");
        const response = await fetch(
            `${process.env.BASE_URL}/api/plans/scopes/status/${scopeId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
            }
        );
        if (response.ok) {
            // console.log("Successful");
            let app = await response.json(); // Extract the JSON data from the response
           // console.log(app);
            return app;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    // revalidatePath("/dashboard/user/applications");
    // redirect("/dashboard/user/applications");
}