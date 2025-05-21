// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";

export async function getSectionsByDeptId() {
  const session = await auth();

  noStore();

  try {
    // console.log(session);

    let url = `${process.env.BASE_URL}/api/departments/${session?.user?.departmentId}/sections`;

    if (session?.user.role === UserRoles.ROLE_SENIORMANAGER) {
      url = `${process.env.BASE_URL}/api/sections/division/${session?.user?.divisionId}/sections`;
    }

    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (response.ok) {
      // console.log("Successful");
      let app = await response.json(); // Extract the JSON data from the response
      //   console.log(app);
      if (session?.user.role !== UserRoles.ROLE_SENIORMANAGER) {
        return app?.assignedSections || [];
      }
      return app;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }

  // revalidatePath("/dashboard/user/applications");
  // redirect("/dashboard/user/applications");
}

export async function getSectionById(sectionId?: string) {
  const session = await auth();

  noStore();

  try {
    //console.log("hello");

    let secId = sectionId || session?.user?.sectionId;

    const response = await fetch(
      `${process.env.BASE_URL}/api/sections/findById/${secId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    if (response.ok) {
      //  console.log("Successful");
      let app = await response.json(); // Extract the JSON data from the response
      //   console.log(app);
      return app;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }

  // revalidatePath("/dashboard/user/applications");
  // redirect("/dashboard/user/applications");
}
export async function getSectionNameById(sectionId?: string) {
  const session = await auth();

  noStore();

  try {
    console.log(sectionId);

    let section = sectionId || session?.user?.sectionId;

    const response = await fetch(
      `${process.env.BASE_URL}/api/sections/findById/${section}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    if (response.ok) {
      //  console.log("Successful");
      let section = await response.json(); // Extract the JSON data from the response
      //   console.log(app);
      return section?.name;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }

  // revalidatePath("/dashboard/user/applications");
  // redirect("/dashboard/user/applications");
}
