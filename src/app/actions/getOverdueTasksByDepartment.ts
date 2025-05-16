// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";


interface Props {

  year?: string,
  status?: string,
  departmentId?: string
}


export async function getOverdueTasksByDepartment(
  data: Props
) {
  const session = await auth();

  noStore();

  // console.log(data)

  try {
    console.log(data);

    let url = `${process.env.BASE_URL}/api/plans/section-summary-overdue/workplans/department/${data?.departmentId || session?.user?.departmentId}`;


    if (session?.user.role === UserRoles.ROLE_SENIORMANAGER) {
      url =  `${process.env.BASE_URL}/api/plans/section-summary-overdue/workplans/department/${data?.departmentId}`;
      }
  
      console.log(url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (response.ok) {
      console.log("Successful");
      let app = await response.json(); // Extract the JSON data from the response
      // console.log(app);
      return app;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }

}