import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import "../Statistics/Statistics.css"
import api from '../../utils/axioswrapper';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {

  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get('/statistics');
        setStatistics(response.data);
      } catch (error) {
      }
    };

    // Fetch statistics data when the component mounts
    fetchStatistics();
  }, []);

  
  const data = {
    labels: ['Total Users', 'Total Subscriptions', 'Total Subscribe Subscriptions', 'Total Unsubscribe Subscriptions'],
    datasets: [
      {
        label: 'Statistics',
        data: [
          statistics?.total_users || 0,
          statistics?.total_subscriptions || 0,
          statistics?.total_subscribe_subscriptions || 0,
          statistics?.total_unsubscribe_subscriptions || 0,
        ],
        backgroundColor: ['#36A2EB', '#FFCE56', '#00CC00', '#FF6384'],
      },
    ],
  };

  const options = {
       legend: {
      display: false,
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="statistics-container">
      <h2>Statistics</h2>
      {statistics ? (
      <div className="chart-container">
      <Bar data={data} options={options} />
      </div>
      ):(
        <p>Loading statistics...</p>
      )}
    </div>
  );
};

export default Statistics;