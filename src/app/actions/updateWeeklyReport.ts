// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { FormSchema } from "@/app/reports/weekly/reporting/page";


export type WorkPlan = {
    month: string;
    week: string;
    scope: string;
    team: string[]
}
export async function updateWeeklyReport(workplan: z.infer<typeof FormSchema> & { reportId: number }) {
    const session = await auth();

    console.log(session)
    noStore();
    console.log(workplan)

    const data = {
        "weeklyTarget": workplan.weeklyTarget,
        "actualWorkDone": workplan.actualWorkDone,
        "percentageComplete": workplan.percentageComplete,
        "actualExpenditure": workplan.actualExpenditure,
        "percentOfBudget": workplan.budgetPercentage,
        "remarks": workplan.remarks,
      }

    try {
        const response = await fetch(`${process.env.BASE_URL}/api/plans/update/${workplan.reportId}`, {
            method: "PUT",
            body: JSON.stringify(data),
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

    revalidatePath("/reports/weekly");

    redirect("/reports/weekly");
}

