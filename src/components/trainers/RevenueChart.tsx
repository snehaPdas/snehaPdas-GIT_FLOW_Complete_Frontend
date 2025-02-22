import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
  
  interface RevenueChartProps {
    data: {
      revenue: number;
      year: number;
      month: number;
      trainerRevenue: number;
    }[];
    trainerid:string
  }
  
  const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
   
  
    const safeData = Array.isArray(data) ? data : [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const oneYearAgo = new Date(currentYear, currentMonth - 11, 1);
  
    const last12MonthsData = safeData
      .map((item) => ({
        name: `${String(item.month).padStart(2, '0')}/${item.year}`,
        trainerRevenue: item.trainerRevenue, // ✅ Correct mapping
      }))
      .filter((item) => {
        const [month, year] = item.name.split('/').map(Number);
        const itemDate = new Date(year, month - 1, 1);
        return itemDate >= oneYearAgo && itemDate <= today;
      })
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split('/').map(Number);
        const [monthB, yearB] = b.name.split('/').map(Number);
        return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
      });
  
    console.log("Filtered and Sorted Data:", last12MonthsData);
  
    return (
      <ResponsiveContainer width="95%" height={300}>
        <LineChart data={last12MonthsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickCount={12} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="trainerRevenue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  export default RevenueChart;
  