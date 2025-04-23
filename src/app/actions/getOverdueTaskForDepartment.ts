// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRoles } from "@/next-auth.d";


export async function getListOfOverdueTasks(
  departmentId: string
) {
  const session = await auth();

  noStore();



  try {
   // console.log("hello here we are??");

    let url = `${process.env.BASE_URL}/api/plans/section-list-overdue/workplans/department/${departmentId}`;


    if (session?.user.role === UserRoles.ROLE_SENIORMANAGER) {
        url = `${process.env.BASE_URL}/api/plans/section-list-overdue/workplans/department/${departmentId}`;
      }
  

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (response.ok) {
      let app = await response.json(); // Extract the JSON data from the response
     
      return app;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }

}


export async function getPieDataForOverdueDeptTasks(
  departmentId?: string
) {
  const session = await auth();

  noStore();

  //console.log('mmmmmm')
  //console.log(session);

  const now = new Date();

// Get the current year
const year = now.getFullYear();

// Get the current month name
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const month = monthNames[now.getMonth()];
const dayOfMonth = now.getDate();

// Get the current week number
const week = Math.ceil(dayOfMonth / 7);

console.log(`Week: ${week}, Month: ${month}, Year: ${year}`) 

  try {
   // console.log("hello here we are???");

    //let url = `${process.env.BASE_URL}/api/plans/workplans/summary/section/${session?.user?.sectionId}/week/week${week}/month/${month}/year/${year}`;

 let url = `${process.env.BASE_URL}/api/plans/section-summary-overdue/workplans/department/${session?.user?.departmentId}`
    /* if (session?.user.role === UserRoles.ROLE_SENIORMANAGER) {
   // check later
        url = `${process.env.BASE_URL}/api/plans/overdue/division/${session?.user?.divisionId}/week/week${week}/month/${month}/year/${year}`;
      } */
  

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    console.log(response)

    if (response.ok) {
      let app = await response.json(); // Extract the JSON data from the response
     console.log(app);
      return app;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }

}