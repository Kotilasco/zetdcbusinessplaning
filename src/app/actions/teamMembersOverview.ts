// @ts-nocheck
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


interface Props {
sectionId?: string,
week?: string,
month?: string,
year?: string,
}


export async function getTeamOverviewForSection(data: Props = {}) {
    // Move defaultProps inside the function
    const now = new Date();
    const year = now.getFullYear();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const month = monthNames[now.getMonth()];
    const dayOfMonth = now.getDate();
    const week = Math.ceil(dayOfMonth / 7);
  
    const defaultProps: Props = {
      week: `${week}`,
      month: month,
      year: `${year}`,
    };
  
    const mergedData = { ...defaultProps, ...data };
    const { sectionId, week: selectedWeek, month: selectedMonth, year: selectedYear } = mergedData;
  
    noStore();
  
    console.log(
      "Fetching team member overview for section:",
      sectionId,
      selectedWeek,
      selectedMonth,
      selectedYear
    );
  
    try {
      const session = await auth(); // Moved inside the function
  
      // /api/plans/count/team-member/sectionId/{sectionId}/week/{week}/month/{month}/year/{year}
      const response = await fetch(
        `${process.env.BASE_URL}/api/plans/count/team-member/sectionId/${sectionId}/week/week${selectedWeek}/month/${selectedMonth}/year/${selectedYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const app = await response.json();
      console.log("Fetched team member overview:", app);
      return app;
    } catch (error) {
      console.error("Error fetching manager data:", error);
      return [];
    }
  }