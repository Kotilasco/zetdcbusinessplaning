// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export type Department = {
    id: number;
    name: string;

}




export async function getTeamMembersInDepartment(): Promise<Department[] | undefined> {
    const session = await auth();

    // Check if the session or token exists
    if (!session?.access_token) {
        throw new Error("Authentication failed. No access token found.");
    }

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error("BASE_URL is not defined in environment variables");
    }

    console.log(baseUrl)

    try {
        console.log("Fetching team members...");
        ///api/teamMembers/department/{departmentId}
        const response = await fetch(`${baseUrl}/api/teamMembers/department/${session?.user?.departmentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store", // Prevent caching
        });

        if (response.ok) {
            const app = await response.json(); // Extract JSON data from the response
            console.log("Members fetched successfully:", app);
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