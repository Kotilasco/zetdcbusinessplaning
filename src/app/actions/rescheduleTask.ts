// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { MemberCreationSchema, MemberCreationSchemaByManager } from "@/schema";


export type ReschedulePlan = 
    {
        details?: string,
        status?: IN_PROGRESS,
        targetCompletionDate?: Date,
        actualCompletionDate?: Date
      }
export async function rescheduleThePlan(data: ReschedulePlan, scopeId: number) {
    const session = await auth();

    //console.log(session)
    noStore();
    console.log('kkkkkk hhhh')
    console.log(data, scopeId)


    try {
        ///api/teamMembers/create
        const response = await fetch(`${process.env.BASE_URL}/api/plans/scopes/update/${scopeId}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
            },
        });

        //console.log(response)

        if (!response.ok) {
            throw new Error("Error posting data");
        }

        const res = await response.json()
        console.log('res!!!')
        console.log(res)
       
    } catch (error: any) {
        console.log('jjjj')
        console.log(error);
        throw new Error(error.message);
    }

    revalidatePath("/reports/weekly");

}
