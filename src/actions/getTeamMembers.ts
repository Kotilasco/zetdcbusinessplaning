// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function getMembersBySectionId() {
    const session = await auth();

    noStore();

    try {
        console.log("hello");
        
        const response = await fetch(
            `${process.env.BASE_URL}/api/teamMembers/section/${session?.user?.sectionId}`,
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
            let app = await response.json(); // Extract the JSON data from the response
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

export async function getMembersByDepartmentId() {
    const session = await auth();

    noStore();

    try {
        console.log("hello");
        
        const response = await fetch(
            `${process.env.BASE_URL}/api/teamMembers/department/${session?.user?.departmentId}`,
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
            let app = await response.json(); // Extract the JSON data from the response
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