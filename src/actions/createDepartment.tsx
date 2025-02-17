// @ts-nocheck
"use server";

import { auth } from "@/auth"; // Assuming `auth` is imported from your auth utilities
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Section = {
  name: string;
};

type Dept = {
  name: string;
  sections: string[];
};

async function createAndAssignSection(section, appId, accessToken) {
  console.log(section);

  const sectionResponse = await fetch(
    `${process.env.BASE_URL}/api/sections/create`,
    {
      method: "POST",
      body: JSON.stringify({ name: section }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!sectionResponse.ok) {
    throw new Error("Error creating section");
  }

  // Safely parse the JSON response
  const sectionData = await safeJsonParse(sectionResponse);

  if (!sectionData || !sectionData.id) {
    throw new Error("Invalid section data returned from the server");
  }

  console.log(sectionData);

  const assignResponse = await fetch(
    `${process.env.BASE_URL}/api/sections/${appId}/assignSections`,
    {
      method: "POST",
      body: JSON.stringify({ sectionIds: [sectionData.id] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!assignResponse.ok) {
    throw new Error("Error assigning section to department");
  }

  // Safely parse the JSON response
  const assignData = await safeJsonParse(assignResponse);

  console.log("Section assigned successfully:", assignData);

  return assignData;
}

export async function createDepartment(department: Dept) {
  console.log(department);
  const session = await auth();

  if (!session || !session.access_token) {
    throw new Error("Unauthorized: Access token is missing.");
  }

  const dept = {
    name: department.name,
  };

  const sections = department.sections;

  try {
    // Create the department
    const response = await fetch(
      `${process.env.BASE_URL}/api/departments/create`,
      {
        method: "POST",
        body: JSON.stringify(dept),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error posting data");
    }

    // Safely parse the JSON response
    const app = await safeJsonParse(response);

    if (!app || !app.id) {
      throw new Error("Invalid department data returned from the server");
    }

    console.log(app);

    const sectionsArr = treatEmptyStringsAsEmptyArray(sections);

    console.log(sectionsArr.length);

    // Create sections and assign them to the department
    if (sectionsArr.length > 0) {
      const sectionPromises = sectionsArr.map((section) =>
        createAndAssignSection(section, app.id, session.access_token),
      );

      const results = await Promise.all(sectionPromises);
      console.log("All sections created and assigned:", results);
    }
  } catch (error: any) {
    console.error("Error:", error);
    throw new Error(error.message || "An unknown error occurred");
  }

  // Revalidate and redirect
  revalidatePath("/");
  redirect("/");
}

function treatEmptyStringsAsEmptyArray(arr) {
  // Filter out empty strings
  const filteredArray = arr.filter((item) => item.trim() !== "");
  return filteredArray.length === 0 ? [] : filteredArray;
}


async function safeJsonParse(response) {
  try {
    // Check if the response has content to parse
    const text = await response.text();
    return text ? JSON.parse(text) : null; // Return null if the response is empty
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Invalid JSON response");
  }
}