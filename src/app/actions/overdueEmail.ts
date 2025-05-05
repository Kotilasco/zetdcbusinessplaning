// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function getOverDueEmailData(departmentId: string) {

  
    noStore();
  
  
    try {
      const session = await auth(); // Moved inside the function

      let url = `${process.env.BASE_URL}/api/plans/department/overdueEmail/departmentId/${departmentId}`;

      console.log("URL:", url); // Debugging log
  
      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      console.log("Response:", response); // Debugging log
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const app = await response.json();
      
      return app;
    } catch (error) {
      console.error("Error fetching overdue email data:", error);
      return [];
    }
  }


  export async function getEmailDataForDepartment(departmentId: string) {

  
    noStore();
  
  
    try {
      const session = await auth(); // Moved inside the function

      let url = `${process.env.BASE_URL}/api/plans/department/Email/${departmentId}`;

      console.log("URL:", url); // Debugging log
  
      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      console.log("Response:", response); // Debugging log
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const app = await response.json();
      console.log('object')
      console.log(app);
      return app;
    } catch (error) {
      console.error("Error fetching overdue email data:", error);
      return [];
    }
  }