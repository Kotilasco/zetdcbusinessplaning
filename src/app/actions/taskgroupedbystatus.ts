// /api/teamMembers/team-members/{teamMemberId}/tasks-grouped-by-status

// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";



export async function gettaskedGroupedByStatusForMember(teamMemberId) {
    const session = await auth();

    noStore();

   // console.log(session)

    try {

        let url = `${process.env.BASE_URL}/api/teamMembers/team-members/${teamMemberId}/tasks-grouped-by-status`
       
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
            let memberData = await response.json(); // Extract the JSON data from the response
     
            return memberData;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

}
