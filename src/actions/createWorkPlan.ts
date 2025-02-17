// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export type WorkPlan = {
    month: string;
    week: string;
    scope: string;
    team: string[]
}
export async function createWorkPlan(workplan: WorkPlan) {
    const session = await auth();

    console.log(session)
    noStore();
    console.log('kkkkkk hhhh')
    const wp = {
        "month": workplan.month,
        "week": workplan.week,
        "scopes": [
            {
                "details": workplan.scope,
                "assignedTeamMemberIds": []
            }
        ]
    }

    try {
        const response = await fetch(`${process.env.BASE_URL}/api/plans/create`, {
            method: "POST",
            body: JSON.stringify(wp),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error posting data");
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    revalidatePath("/reports/monthly/workplan");

    redirect("/reports/monthly/workplan");
}

