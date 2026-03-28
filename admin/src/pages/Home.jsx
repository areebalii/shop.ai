import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../components/exportVariables'
import { toast } from 'react-toastify'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS Components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const Home = ({ token }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/stats', { headers: { token } });

      // LOG THIS to see exactly what your backend is sending
      console.log("Dashboard Response:", response.data);

      // Check if the response follows the ApiResponse structure (response.data.data)
      if (response.data.success || response.data.statusCode === 200) {
        // We use .data.data because ApiResponse puts the payload in 'data'
        setDashboardData(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load stats");
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Error fetching dashboard data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) return <div className='p-10 text-center font-bold'>Syncing with Database...</div>

  // Doughnut Chart Configuration
  const doughnutData = {
    labels: dashboardData?.categoryData.map(item => item._id) || [],
    datasets: [{
      data: dashboardData?.categoryData.map(item => item.count) || [],
      backgroundColor: ['#0F172A', '#3B82F6', '#94A3B8', '#F43F5E'],
      borderWidth: 0,
    }]
  };

  // Line Chart Configuration (System Status Box)
  const lineData = {
    labels: dashboardData?.salesData?.length > 0
      ? dashboardData.salesData.map(item => item._id)
      : ['No Data'],
    datasets: [{
      label: 'Daily Revenue',
      data: dashboardData?.salesData?.length > 0
        ? dashboardData.salesData.map(item => item.revenue)
        : [0],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  return (
    <div className='p-4 space-y-8 animate-in fade-in duration-500'>
      <div>
        <h1 className='text-3xl font-bold text-slate-900'>Live Business Stats</h1>
        <p className='text-slate-500'>Real-time insights from your store.</p>
      </div>

      {/* --- TOP STAT CARDS --- */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-2xl border shadow-sm transition-transform hover:scale-[1.02]'>
          <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Total Revenue</p>
          <p className='text-3xl font-black text-slate-900'>${dashboardData?.totalRevenue || 0}</p>
        </div>
        <div className='bg-white p-6 rounded-2xl border shadow-sm transition-transform hover:scale-[1.02]'>
          <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Total Orders</p>
          <p className='text-3xl font-black text-slate-900'>{dashboardData?.totalOrders || 0}</p>
        </div>
        <div className='bg-white p-6 rounded-2xl border shadow-sm transition-transform hover:scale-[1.02]'>
          <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Live Products</p>
          <p className='text-3xl font-black text-slate-900'>{dashboardData?.totalProducts || 0}</p>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

        {/* Inventory Chart */}
        <div className='bg-white p-8 rounded-2xl border shadow-sm h-[400px] flex flex-col'>
          <h3 className='font-bold text-slate-800 mb-6'>Inventory Distribution</h3>
          <div className='flex-1 relative flex justify-center items-center'>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
          </div>
        </div>

        {/* REPLACED "System Status" with Revenue Trends */}
        <div className='bg-white p-8 rounded-2xl border shadow-sm h-[400px] flex flex-col'>
          <h3 className='font-bold text-slate-800 mb-6'>Revenue Trends (7 Days)</h3>
          <div className='flex-1 relative'>
            {dashboardData?.salesData?.length > 0 ? (
              <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            ) : (
              <div className='h-full flex flex-col items-center justify-center text-slate-400'>
                <p className='italic'>No sales data found for the last 7 days.</p>
                <p className='text-xs'>(Once you place an order, the graph will appear)</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home;