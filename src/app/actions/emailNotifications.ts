// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";



export async function getNotificationForDepartment(departmentId: number) {
    const session = await auth();


    // Check if the session or token exists
    if (!session?.access_token) {
        throw new Error("Authentication failed. No access token found.");
    }

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error("BASE_URL is not defined in environment variables");
    }


     let url = `${baseUrl}/api/plans/section-summary-overdue/workplans/department/${departmentId}/notifications/`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store", // Prevent caching
        });

        if (response.ok) {
            const app = await response.json(); // Extract JSON data from the response
            console.log("notifications:", app);
            return app;
        } else {
            throw new Error(`Failed to fetch summary: ${response.statusText}`);
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

}