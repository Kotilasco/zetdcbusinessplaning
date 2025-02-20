// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { MemberCreationSchema, MemberCreationSchemaByManager } from "@/schema";


export type WorkPlan = {
    month: string;
    week: string;
    scope: string;
    team: string[]
}
export async function createMember(data: z.infer<typeof MemberCreationSchema>) {
    const session = await auth();

    console.log(session)
    noStore();
    console.log('kkkkkk hhhh')

    const d = {
        "firstname": data.firstname,
        "lastname": data.lastname,
        "email": data.email,
        "ecNumber": data.ecnum,
        "designation": data.designation,
        "sectionId": data.section,
        "departmentId": data.department
      }

    try {
        ///api/teamMembers/create
        const response = await fetch(`${process.env.BASE_URL}/api/teamMembers/create`, {
            method: "POST",
            body: JSON.stringify(d),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error posting data");
        }

        const res = await response.json()
        console.log(res)
        if (res.ok) {
    
            return {
                success: "Team Member created successfully"
            }
        }
    
        return {
            error: "Something went wrong"
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    revalidatePath("/");

    redirect("/");
}

export async function createMemberByManager(data: z.infer<typeof MemberCreationSchemaByManager>) {
    const session = await auth();

    console.log(session)
    noStore();
    console.log('kkkkkk hhhh')

    const d = {
        "firstname": data.firstname,
        "lastname": data.lastname,
        "email": data.email,
        "ecNumber": data.ecnum,
        "designation": data.designation,
        "sectionId": session?.user?.sectionId,
        "departmentId": session?.user?.departmentId
      }

    try {
        ///api/teamMembers/create
        const response = await fetch(`${process.env.BASE_URL}/api/teamMembers/create`, {
            method: "POST",
            body: JSON.stringify(d),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error posting data");
        }

        const res = await response.json()
        console.log(res)
        if (res.ok) {
    
            return {
                success: "Team Member Created successfully"
            }
        }
    
        return {
            error: "Something went wrong"
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    revalidatePath("/");

    redirect("/");
}