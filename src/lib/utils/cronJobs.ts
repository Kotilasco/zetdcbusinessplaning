//@ts-nocheck

import { getAllWorkPlansBySection } from '@/app/actions/getWorkPlansBySection';
import cron from 'node-cron';
import { sendEmail } from './sendEmail';
import { getNotificationForDepartment } from '@/app/actions/emailNotifications';
import { getEmailDataForDepartment, getOverDueEmailData } from '@/app/actions/overdueEmail';
import { auth, signOut } from "@/auth";
import { getDepartmentIdListByDivisionId } from '@/app/actions/getDepartments';

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
function generateDepartmentOverdueTasksEmailBody(data, overdueTasks) {
  return `
  <p style="font-family: Arial, sans-serif;">Overdue Workplan Report for Department: ${data.departmentName}</p>
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
          const sectionRows = section.overdueTasks
            .map((task, taskIndex) => {
              const backgroundColor =
                (sectionIndex + taskIndex) % 2 === 0
                  ? "#ffffff"
                  : "#f9f9f9";
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
            })
            .join("");
          return sectionRows;
        })
        .join("")}
    </tbody>
  </table>
`;
}

function generateDepartmentAboveBudgetEmailBody(data, aboveBudgetPlans) {
  return  `<p style="font-family: Arial, sans-serif;">Above Budget Work Plans Report for Department: ${data.departmentName}</p>
    <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left;">Section Name</th>
          <th style="padding: 8px; text-align: left;">Section Manager Email</th>
          <th style="padding: 8px; text-align: left;">Plan Name</th>
          <th style="padding: 8px; text-align: left;">Team Members</th>
          <th style="padding: 8px; text-align: center;">Budget</th>
          <th style="padding: 8px; text-align: center;">Actual Expenditure</th>
          <th style="padding: 8px; text-align: center;">Difference</th>
          <th style="padding: 8px; text-align: center;">Currency</th>
        </tr>
      </thead>
      <tbody>
        ${aboveBudgetPlans
          .map((plan, index) => {
            const backgroundColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
            return `
              <tr style="background-color: ${backgroundColor};">
                <td style="padding: 8px;">${plan.sectionName}</td>
                <td style="padding: 8px;">${plan.sectionManagerEmail}</td>
                <td style="padding: 8px;">${plan.planName || "Unnamed Plan"}</td>
                <td style="padding: 8px;">${plan.teamMemberNames.join(", ")}</td>
                <td style="padding: 8px; text-align: center;">${plan.budget}</td>
                <td style="padding: 8px; text-align: center;">${plan.actualExpenditure}</td>
                <td style="padding: 8px; text-align: center;">${plan.difference}</td>
                <td style="padding: 8px; text-align: center;">${plan.currency}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `
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
 

cron.schedule("0 15 * * 1", async () => {
  console.log("Running the scheduled task...");

  const session = await auth(); // Moved inside the function
const departmentIds = await getDepartmentIdListByDivisionId(session?.user?.divisionId); // Replace with actual department IDs

console.log("Department IDs:", departmentIds); // Debugging log

  const { week, month, year } = getCurrentWeek();

  try {
    // Iterate over each department ID
    /* for (const departmentId of departmentIds) {
      console.log(`Processing department ID: ${departmentId}`);

      // Fetch data for the current department
      const data = await getEmailDataForDepartment(departmentId);

      // Check if the response is valid
      if (!data || !Array.isArray(data?.sections)) {
        console.error(`Invalid response for department ID: ${departmentId}`);
        continue; // Skip to the next department
      }

      // Extract the department's senior manager email
      const seniorManagerEmail = data?.seniorManagerEmail;

      // Calculate the total overdue tasks for the department
      const totalOverdueCount = data?.sections?.reduce(
        (total, section) => total + section.overdueTasks.length,
        0
      );

      // Generate the email body
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
                const sectionRows = section.overdueTasks
                  .map((task, taskIndex) => {
                    const backgroundColor =
                      (sectionIndex + taskIndex) % 2 === 0
                        ? "#ffffff"
                        : "#f9f9f9";
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
                  })
                  .join("");
                return sectionRows;
              })
              .join("")}
          </tbody>
        </table>
      `;

      console.log(`Generated email body for department ID: ${departmentId}`);

      // Email subject
      const emailSubject = `Weekly Workplan for ${data?.departmentName}`;

      // Send the email
      const result = await sendEmail({
        recipientEmail: 'kkoti@zetdc.co.zw',//seniorManagerEmail, // Use the department's senior manager email
        subject: emailSubject,
        message: messageBody,
      });

      console.log(`Email sent successfully to ${seniorManagerEmail}`, result);
    } */

    for (const departmentId of departmentIds) {
      console.log(`Processing department ID: ${departmentId}`);
    
      // Fetch data for the current department
      const data = await getEmailDataForDepartment(departmentId);
    
      // Check if the response is valid
      if (!data || !Array.isArray(data?.sections)) {
        console.error(`Invalid response for department ID: ${departmentId}`);
        continue; // Skip to the next department
      }
    
      // Extract the department's senior manager email
      const seniorManagerEmail = data?.seniorManagerEmail;
      // Aggregate overdue tasks and above-budget plans for the entire department
      const departmentOverdueTasks = [];
      const departmentAboveBudgetPlans = [];
    
      // Process each section in the department
      /* for (const section of data.sections) {

        console.log(`Processing section: ${section.sectionName}`);
    
        // Send email for overdue tasks
        if (section.overdueTasks.length > 0) {
         
          const overdueTasksEmailBody = generateDepartmentOverdueTasksEmailBody(data, departmentOverdueTasks);
        const overdueTasksEmailSubject = `Overdue Tasks Report for Department: ${data.departmentName}`;
        await sendEmail({
            recipientEmail: 'kkoti@zetdc.co.zw', // Send to the senior manager
            subject: overdueTasksEmailSubject,
            message: overdueTasksEmailBody,
          });
    
          console.log(`Sent overdue tasks email for section: ${section.sectionName}`);
        }
    
        // Send email for above-budget work plans
        if (section.aboveBudgetWorkPlans.length > 0) {
          const aboveBudgetEmailBody = generateDepartmentAboveBudgetEmailBody(data, departmentAboveBudgetPlans);
          const aboveBudgetEmailSubject = `Above Budget Work Plans Report for Department: ${data.departmentName}`;
           await sendEmail({
            recipientEmail: 'kkoti@zetdc.co.zw', // Send to the senior manager
            subject: aboveBudgetEmailSubject,
            message: aboveBudgetEmailBody,
          });
    
          console.log(`Sent above-budget work plans email for section: ${section.sectionName}`);
        }
      } */
   
        for (const section of data.sections) {
          console.log(`Processing section: ${section.sectionName}`);
          departmentOverdueTasks.push(...section.overdueTasks.map(task => ({ ...task, sectionName: section.sectionName, sectionManagerEmail: section.sectionManagerEmail })));
          departmentAboveBudgetPlans.push(...section.aboveBudgetWorkPlans.map(plan => ({ ...plan, sectionName: section.sectionName, sectionManagerEmail: section.sectionManagerEmail })));
          console.log('object')
        }
  
        // Send email for all overdue tasks in the department
        if (departmentOverdueTasks.length > 0) {
          console.log('kkkkk')
          console.log(data)
        
          const overdueTasksEmailBody = generateDepartmentOverdueTasksEmailBody(data, departmentOverdueTasks);
          console.log('kkkllllll')
          const overdueTasksEmailSubject = `Overdue Tasks Report for Department: ${data.departmentName}`;
          await sendEmail({
            recipientEmail: 'kkoti@zetdc.co.zw', // Use senior manager's email if available
            subject: overdueTasksEmailSubject,
            message: overdueTasksEmailBody,
          });
          console.log(`Sent overdue tasks email for department: ${data.departmentName}`);
        }
  
        // Send email for all above-budget work plans in the department
        if (departmentAboveBudgetPlans.length > 0) {
          const aboveBudgetEmailBody = generateDepartmentAboveBudgetEmailBody(data, departmentAboveBudgetPlans);
          const aboveBudgetEmailSubject = `Above Budget Work Plans Report for Department: ${data.departmentName}`;
          await sendEmail({
            recipientEmail:  'kkoti@zetdc.co.zw', // Use senior manager's email if available
            subject: aboveBudgetEmailSubject,
            message: aboveBudgetEmailBody,
          });
          console.log(`Sent above-budget work plans email for department: ${data.departmentName}`);
        }
  
   
      }

    console.log("All department emails processed successfully!");
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