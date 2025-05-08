//@ts-nocheck

import { getAllWorkPlansBySection } from '@/app/actions/getWorkPlansBySection';
import cron from 'node-cron';
import { sendEmail } from './sendEmail';
import { getNotificationForDepartment } from '@/app/actions/emailNotifications';
import { getEmailDataForDepartment, getOverDueEmailData } from '@/app/actions/overdueEmail';

// Utility function to calculate the current week, month, and year
function getCurrentWeek() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = Math.floor((now - startOfYear) / 86400000) + 1; // Fix calculation
  const weekNumber = Math.ceil(pastDaysOfYear / 7);

  return {
    week: weekNumber,
    month: now.getMonth() + 1, // Months are 0-indexed
    year: now.getFullYear(),
  };
}
let cronJobInitialized = false;

// Initialize the cron job
export function initializeCronJob() {
  
console.log(cronJobInitialized)
  if (cronJobInitialized) {
    console.warn("Cron job already initialized, skipping...");
    return;
  }
  cronJobInitialized = true;

  console.log('Cron job initialized!');
  let i = 0; // Move outside cron function

  // 68261205160020

  //0 16 * * 5
// */50 * * * *
  cron.schedule("0 16 * * 5", async () => {
    console.log("Running the scheduled task...", ++i);

    const { week, month, year } = getCurrentWeek();

    try {
     // const data = await getNotificationForDepartment(2);

      const data = await getEmailDataForDepartment(1);

      console.log("Data fetched:", data); // Debugging log
      // Check if the response is valid

      if (!data || !Array.isArray(data?.sections)) {
        throw new Error("Invalid response format");
      }

      console.log('kjfjfja')

      // Extract the department's senior manager email
  const seniorManagerEmail = data?.seniorManagerEmail;

  // Calculate the total overdue tasks for the department
  const totalOverdueCount = data?.sections?.reduce((total, section) => total + section.overdueTasks.length, 0);

  console.log(totalOverdueCount); // Debugging log
/* 
  const messageBody = `
  <p style="font-family: Arial, sans-serif;">Weekly Workplan Report</p>
  <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="padding: 8px; text-align: left;">Section Name</th>
        <th style="padding: 8px; text-align: left;">Section Manager Email</th>
        <th style="padding: 8px; text-align: center;">Total Overdue Tasks</th>
        <th style="padding: 8px; text-align: left;">Responsible</th>
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (section, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
              <td style="padding: 8px;">${section.sectionName}</td>
              <td style="padding: 8px;">${section.sectionManagerEmail}</td>
              <td style="padding: 8px; text-align: center;">${section.overdueWorkPlans}</td>
              <td style="padding: 8px;">
                ${section.teamMembers
                  .map(
                    (member) => `
                      ${member}<br>
                    `
                  )
                  .join("")}
              </td>
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;
 */

const messageBody = `
  <p style="font-family: Arial, sans-serif;">Weekly Workplan Report</p>
  <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="padding: 8px; text-align: left;">Section Name</th>
        <th style="padding: 8px; text-align: left;">Section Manager Email</th>
        <th style="padding: 8px; text-align: center;">Total Overdue Tasks</th>
        <th style="padding: 8px; text-align: left;">Responsible</th>
        <th style="padding: 8px; text-align: left;">Plan Name</th>
      </tr>
    </thead>
    <tbody>
      ${data.sections
        .map((section, sectionIndex) => {
          const sectionRows = section.overdueTasks.map((task, taskIndex) => {
            const backgroundColor = (sectionIndex + taskIndex) % 2 === 0 ? "#ffffff" : "#f9f9f9";
            let row = `<tr style="background-color: ${backgroundColor};">`;

            // Render Section Name, Email, and Total Overdue Tasks only for the first task in the section
            if (taskIndex === 0) {
              row += `
                <td style="padding: 8px;" rowspan="${section.overdueTasks.length}">${section.sectionName}</td>
                <td style="padding: 8px;" rowspan="${section.overdueTasks.length}">${section.sectionManagerEmail}</td>
                <td style="padding: 8px; text-align: center;" rowspan="${section.overdueTasks.length}">${section.overdueTasks.length}</td>
              `;
            }

            row += `
              <td style="padding: 8px;">${task.teamMemberNames.join(", ")}</td>
              <td style="padding: 8px;">${task.planName || "Unnamed Plan"}</td>
            </tr>
            `;
            return row;
          }).join("");
          return sectionRows;
        })
        .join("")}
    </tbody>
  </table>
`;

console.log("Message Body:", messageBody); // Debugging log
// Email subject
const emailSubject = `Weekly Workplan for ${data?.departmentName}`;


  // Send the email
  const result = await sendEmail({
    recipientEmail: 'kkoti@zetdc.co.zw', //seniorManagerEmail
    subject: emailSubject,
    message: messageBody,
  });

      console.log("Emails sent successfully!", result);
    } catch (error) {
      console.error("Error during task execution:", error);
    }
  });
}
/* 
  // Extract the department's senior manager email
  const seniorManagerEmail = data[0]?.seniorManagerEmail;

  // Calculate the total overdue tasks for the department
  const totalOverdueCount = data.reduce((total, section) => total + section.overdueCount, 0);

  // Build the message body
  const messageBody = `
    Weekly Workplan for Week ${week}, Month ${month}, Year ${year}
    
    Department: ${data[0]?.departmentName}
    Total Overdue Tasks: ${totalOverdueCount}

    Breakdown by Section:
    ${data
      .map(
        (section) =>
          `- Section "${section.sectionName}" led by ${section.managerEmail} has ${section.overdueCount} overdue tasks.`
      )
      .join("\n")}
  `;

  // Email subject
  const emailSubject = `Weekly Workplan for ${data[0]?.departmentName}: ${totalOverdueCount} Overdue Tasks`;

  // Send the email
  const result = await sendEmail({
    recipientEmail: seniorManagerEmail,
    subject: emailSubject,
    message: messageBody,
  });

  return result;
}  */