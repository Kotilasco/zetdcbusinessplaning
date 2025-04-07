// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getOverdueTasksByMemberId(id: number) {
    const session = await auth();

    noStore();

    try {
        console.log("hello");
        
        const response = await fetch(
            `${process.env.BASE_URL}/api/plans/scopes/overdue/team-member/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
            }
        );
        if (response.ok) {
            let app = await response.json(); // Extract the JSON data from the response
            // console.log(app);
            return app;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    // revalidatePath("/dashboard/user/applications");
    // redirect("/dashboard/user/applications");
}


export async function getOverdueTasksForDivision() {
    const session = await auth();

    noStore();

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
    
    console.log(`Week: ${week}, Month: ${month}, Year: ${year}`);

    try {
        console.log("hello");
        
        const response = await fetch(
            `${process.env.BASE_URL}/api/plans/overdue/division/${session?.user?.divisionId}/week/week${week}/month/${month}/year/${year}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
            }
        );
        if (response.ok) {
            let app = await response.json(); // Extract the JSON data from the response
          //  console.log(app);
            return app;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }

    // revalidatePath("/dashboard/user/applications");
    // redirect("/dashboard/user/applications");
}


function groupPlansBySection(plans) {
    return plans.reduce((grouped, plan) => {
      const { sectionId } = plan;
      if (!grouped[sectionId]) {
        grouped[sectionId] = [];
      }
      grouped[sectionId].push(plan);
      return grouped;
    }, {});
  }
  
  // Function to fetch section details by sectionId
  async function fetchSectionDetails(sectionId) {
    if (!session?.access_token) {
        throw new Error("Authentication failed. No access token found.");
    }

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
        throw new Error("BASE_URL is not defined in environment variables");
    }

    //console.log(baseUrl)

    try {
      //  console.log("Fetching section...");
        const response = await fetch(`${baseUrl}/api/sections/findById/${sectionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store", // Prevent caching
        });

        if (response.ok) {
            const app = await response.json(); 
            return app;
        } else {
            throw new Error(`Failed to fetch section: ${response.statusText}`);
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

  }
  
  // Function to process grouped plans
  async function processGroupedPlans(plans) {
    // Group plans by sectionId
    const groupedPlans = plans.reduce((grouped, plan) => {
      const { sectionId } = plan;
      if (!grouped[sectionId]) {
        grouped[sectionId] = [];
      }
      grouped[sectionId].push(plan);
      return grouped;
    }, {});
  
    const result = [];
  
    // Loop through each group
    for (const sectionId in groupedPlans) {
      const sectionPlans = groupedPlans[sectionId];
  
      // Fetch section details
      const sectionDetails = await fetchSectionDetails(sectionId);
  
      console.log(`Section ID: ${sectionId}`);
      console.log("Section Details:", sectionDetails);
      console.log("Plans in this section:", sectionPlans);
  
      // Process each plan in the section
      const processedPlans = sectionPlans.map((plan) => {
        console.log(`Plan ID: ${plan.id}, Weekly Target: ${plan.weeklyTarget}`);
        return {
          sectionId,
          sectionName: sectionDetails?.name || `Section ${sectionId}`,
          planId: plan.id,
          weeklyTarget: plan.weeklyTarget,
          status: plan.status,
          remarks: plan.remarks,
        };
      });
  
      result.push({
        sectionId,
        sectionDetails,
        plans: processedPlans,
      });
    }
  
    return result;
  }