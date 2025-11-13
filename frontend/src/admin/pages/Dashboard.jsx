import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/adminApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error.response || error);
    }
  };

  if (!stats) return <p>Loading dashboard...</p>;

  const { summary, monthlyRevenue, topCategories } = stats;

  // Month labels
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = monthlyRevenue.map((m) => ({
    name: monthNames[m.month - 1],
    revenue: m.total,
  }));

  const categoryData = topCategories.map((c) => ({
    name: c.name,
    value: c.products_count,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Admin Dashboard Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <SummaryCard title="Total Orders" value={summary.totalOrders} color="bg-blue-500" />
        <SummaryCard title="Completed Orders" value={summary.completedOrders} color="bg-green-500" />
        <SummaryCard title="Pending Orders" value={summary.pendingOrders} color="bg-yellow-500" />
        <SummaryCard title="Products" value={summary.totalProducts} color="bg-purple-500" />
        <SummaryCard title="Categories" value={summary.totalCategories} color="bg-pink-500" />
      </div>

      {/* Total Revenue */}
      <div className="mb-6 text-lg font-semibold">
        💰 Total Revenue: <span className="text-green-700">₹{summary.totalRevenue.toLocaleString()}</span>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Monthly Revenue Bar Chart */}
        <div className="p-4 bg-white shadow-md rounded-2xl">
          <h3 className="font-semibold mb-3 text-center">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories Pie Chart */}
        <div className="p-4 bg-white shadow-md rounded-2xl">
          <h3 className="font-semibold mb-3 text-center">Top Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={120} label>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, color }) => (
  <div className={`text-white p-4 rounded-2xl shadow-md ${color}`}>
    <h4 className="text-sm">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
