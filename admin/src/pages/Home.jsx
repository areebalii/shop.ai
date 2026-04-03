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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const Home = ({ token }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/stats', { headers: { token } });
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Cloud sync failed");
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardStats(); }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-black tracking-tighter text-4xl animate-pulse">WEARWELL.AI</div>

  // Advanced Gradient for Line Chart
  const getGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
    return gradient;
  };

  return (
    <div className='p-8 space-y-10 bg-[#F8FAFC] min-h-screen font-sans'>

      {/* --- SMART HEADER --- */}
      <div className='flex justify-between items-end'>
        <div>
          <span className='text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mb-2 inline-block uppercase tracking-widest'>System Online</span>
          <h1 className='text-5xl font-black text-slate-900 tracking-tight'>Intelligence <span className='text-slate-400'>Hub</span></h1>
        </div>
        <div className='text-right hidden md:block'>
          <p className='text-xs font-bold text-slate-400 uppercase'>Server Latency</p>
          <p className='text-sm font-black text-emerald-500'>24ms (Optimal)</p>
        </div>
      </div>

      {/* --- INTERACTIVE STATS GRID --- */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {[
          { label: 'Revenue', value: `Rs ${dashboardData?.totalRevenue?.toLocaleString()}`, trend: '+12.5%', color: 'indigo' },
          { label: 'Orders', value: dashboardData?.totalOrders, trend: '+5.2%', color: 'blue' },
          { label: 'Products', value: dashboardData?.totalProducts, trend: 'Stable', color: 'slate' },
          { label: 'Conversion', value: '3.4%', trend: '-0.8%', color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className='group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer'>
            <div className='flex justify-between items-center mb-4'>
              <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <span className={`text-[10px] font-black ${stat.trend.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.trend}</span>
            </div>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>{stat.label}</p>
            <p className='text-3xl font-black text-slate-900 mt-1'>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Revenue Projection */}
        <div className='lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm'>
          <div className='flex justify-between items-center mb-10'>
            <h3 className='text-xl font-black text-slate-900'>Revenue Projection</h3>
            <select className='text-xs font-bold border-none bg-slate-50 rounded-lg p-2 outline-none'>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className='h-[350px]'>
            <Line
              data={{
                labels: dashboardData?.salesData?.map(item => item._id) || [],
                datasets: [{
                  data: dashboardData?.salesData?.map(item => item.revenue) || [],
                  borderColor: '#6366F1',
                  borderWidth: 4,
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 3,
                  tension: 0.4,
                  fill: true,
                  backgroundColor: (context) => getGradient(context.chart.ctx)
                }]
              }}
              options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }}
            />
          </div>
        </div>

        {/* AI Stock Prediction */}
        <div className='bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden'>
          <div className='relative z-10'>
            <h3 className='text-xl font-black mb-6'>Inventory Health</h3>
            <div className='space-y-6'>
              {dashboardData?.categoryData.map((item, i) => (
                <div key={i}>
                  <div className='flex justify-between text-xs font-bold uppercase tracking-widest mb-2'>
                    <span>{item._id}</span>
                    <span className={item.count < 5 ? 'text-rose-400' : 'text-emerald-400'}>{item.count} Units</span>
                  </div>
                  <div className='w-full h-1 bg-white/10 rounded-full overflow-hidden'>
                    <div className='h-full bg-indigo-500 transition-all duration-1000' style={{ width: `${(item.count / 20) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className='w-full mt-10 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all'>
              Restock Report
            </button>
          </div>
          <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl'></div>
        </div>
      </div>
    </div>
  )
}

export default Home;