// components/TaskStatusChart.js
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TaskStatusChart = ({ data }) => {
  // Prepare the data for the chart
  const chartData = {
    labels: data.map(item => item.status), // Extract statuses
    datasets: [
      {
        label: 'Task Count',
        data: data.map(item => item.taskCount), // Extract task counts
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Status Overview',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default TaskStatusChart;