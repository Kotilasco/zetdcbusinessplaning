// pages/api/scheduleEmails.js
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

// This API route will initialize the cron job
export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Schedule the cron job to run every Friday at 4:00 PM
      cron.schedule('*/200 * * * *', async () => {
        console.log('Running the scheduled task...');

        // Get the current week, month, and year
        const { week, month, year } = getCurrentWeek();

        try {
          // Fetch data from your backend
          // http://localhost:8080/
          const response = await fetch(`http://localhost:8080/api/plans/overdue/division/1/month/March/year/${year}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ week, month, year }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data from backend');
          }

          const data = await response.json();

          /* // Send emails to users
          await fetch('https://your-domain.com/api/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              users: data.users, // Assuming the backend returns a list of users
              message: data.message, // Data to include in the email
            }),
          }); */

          //console.log(data)

          //console.log('Emails sent successfully!');
        } catch (error) {
          console.error('Error during task execution:', error);
        }
      });

      res.status(200).json({ message: 'Cron job scheduled successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to schedule the cron job' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}