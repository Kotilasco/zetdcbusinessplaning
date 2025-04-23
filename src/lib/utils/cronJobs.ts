//@ts-nocheck

import { getAllWorkPlansBySection } from '@/app/actions/getWorkPlansBySection';
import cron from 'node-cron';
import { sendEmail } from './sendEmail';
import { getNotificationForDepartment } from '@/app/actions/emailNotifications';

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

// Initialize the cron job
export function initializeCronJob() {
  console.log('Cron job initialized!');
  let i = 0; // Move outside cron function

  cron.schedule("*/30 * * * *", async () => {
    console.log("Running the scheduled task...", ++i);

    const { week, month, year } = getCurrentWeek();

    try {
      const data = await getNotificationForDepartment(2);

      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

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
    recipientEmail: 'edwin@zetdc.co.zw', //seniorManagerEmail
    subject: emailSubject,
    message: messageBody,
  });

      console.log("Emails sent successfully!", result);
    } catch (error) {
      console.error("Error during task execution:", error);
    }
  });
}
/* async function sendSummaryEmail(data, week, month, year) {
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
} */