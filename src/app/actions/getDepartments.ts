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


/* const assignedDepartments = mockData.assignedDepartments.map(dept => ({
    id: dept.id,
    name: dept.name,
  }));

  return assignedDepartments; */

export async function getDepartments(): Promise<Department[] | undefined> {
    const session = await auth();

    // Check if the session or token exists
    if (!session?.access_token) {
        throw new Error("Authentication failed. No access token found.");
    }

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error("BASE_URL is not defined in environment variables");
    }

    //console.log(baseUrl)

    try {
        console.log("Fetching departments...");
        const response = await fetch(`${baseUrl}/api/departments/findAll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store", // Prevent caching
        });

        if (response.ok) {
            const app = await response.json(); // Extract JSON data from the response
//console.log("Departments fetched successfully:", app);
            return app;
        } else {
            throw new Error(`Failed to fetch departments: ${response.statusText}`);
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

export async function getDepartmentsByDivisionId(divisionId?: string): Promise<Department[] | undefined> {
    const session = await auth();

    let id = divisionId || session?.user?.divisionId;

    // Check if the session or token exists
    if (!session?.access_token) {
        throw new Error("Authentication failed. No access token found.");
    }

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error("BASE_URL is not defined in environment variables");
    }

    //console.log(baseUrl)

    try {
        console.log("Fetching departments...");
        const response = await fetch(`${baseUrl}/api/divisions/findById/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store", // Prevent caching
        });

        if (response.ok) {
            const app = await response.json(); // Extract JSON data from the response
//console.log("Departments fetched successfully:", app);
const assignedDepartments = app?.assignedDepartments?.map(dept => ({
    id: dept.id,
    name: dept.name,
  }));

  return assignedDepartments;
        } else {
            throw new Error(`Failed to fetch departments: ${response.statusText}`);
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


export async function getDepartmentIdListByDivisionId(divisionId?: string): Promise<Department[] | undefined> {
    const session = await auth();

    let id = divisionId || session?.user?.divisionId;

    // Check if the session or token exists
    if (!session?.access_token) {
        throw new Error("Authentication failed. No access token found.");
    }

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error("BASE_URL is not defined in environment variables");
    }

    //console.log(baseUrl)

    try {
        console.log("Fetching departments...");
        const response = await fetch(`${baseUrl}/api/divisions/findById/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store", // Prevent caching
        });

        if (response.ok) {
            const app = await response.json(); // Extract JSON data from the response
//console.log("Departments fetched successfully:", app);
const assignedDepartments = app?.assignedDepartments?.map(dept => dept.id);

console.log("Assigned Departments:", assignedDepartments);

  return assignedDepartments;
        } else {
            throw new Error(`Failed to fetch departments: ${response.statusText}`);
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