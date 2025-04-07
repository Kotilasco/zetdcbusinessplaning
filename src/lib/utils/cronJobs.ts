// lib/cronJobs.js
import { getAllWorkPlansBySection } from '@/app/actions/getWorkPlansBySection';
import cron from 'node-cron';

// Utility function to calculate the current week, month, and year
function getCurrentWeek() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - startOfYear + 86400000) / 86400000;
  const weekNumber = Math.ceil(pastDaysOfYear / 7);

  return {
    week: weekNumber,
    month: now.getMonth() + 1, // Months are 0-indexed
    year: now.getFullYear(),
  };
}

// Initialize the cron job
export function initializeCronJob() {
  // Schedule the cron job to run every 2 minutes (for testing)
  cron.schedule('*/289999 * * * *', async () => {
    console.log('Running the scheduled task...');

    // Get the current week, month, and year
    const { week, month, year } = getCurrentWeek();

    try {
      // Fetch data from your backend
      const response = await getAllWorkPlansBySection();

    //  console.log(response);
    //  console.log('Emails sent successfully!');
    } catch (error) {
      console.error('Error during task execution:', error);
    }
  });

  console.log('Cron job initialized!');
}