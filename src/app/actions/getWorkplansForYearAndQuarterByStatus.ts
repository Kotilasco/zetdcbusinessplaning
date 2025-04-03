// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";


interface Props {

  year?: string,
  quarter?: string,
  status?: string,
}

export async function getWorkplansForYearAndQuarterByStatus(
  data: Props
) {
  const session = await auth();

  noStore();

  // console.log(data)

  try {
    //console.log("hello here we are!!!!");

    let url = `${process.env.BASE_URL}/api/plans/workplans/year/${data.year}/departmentId/${session?.user?.departmentId}/quarter/${data.quarter}/status/${data.status}`;

    if (session?.user.role === UserRoles.ROLE_SENIORMANAGER) {
      url = `${process.env.BASE_URL}/api/plans/workplans/year/${data.year}/departmentId/${session?.user?.departmentId}/quarter/${data.quarter}/status/${data.status}`;
    }



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
    //  console.log(app);
      return app;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }

}
