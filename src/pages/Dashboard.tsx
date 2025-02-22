import React from "react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  // Dummy stats
  const [stats] = useState({
    totalUsers: 120,
    totalCourses: 10,
    activeUsers: 75,
  });

  // Dummy user activity data
  const [activities] = useState([
    { id: 1, user: "John Doe", action: "Logged in", time: "10:00 AM" },
    { id: 2, user: "Jane Smith", action: "Enrolled in Course", time: "10:30 AM" },
    { id: 3, user: "Michael Lee", action: "Completed Lesson", time: "11:00 AM" },
  ]);

  // Dummy data for bar chart
  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Courses", value: stats.totalCourses },
    { name: "Active", value: stats.activeUsers },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-4xl font-semibold">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-bold">Total Courses</h2>
          <p className="text-4xl font-semibold">{stats.totalCourses}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-bold">Active Users</h2>
          <p className="text-4xl font-semibold">{stats.activeUsers}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-4">User & Course Stats</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Activity Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent User Activity</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">User</th>
              <th className="border p-3 text-left">Action</th>
              <th className="border p-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-100">
                <td className="border p-3">{activity.user}</td>
                <td className="border p-3">{activity.action}</td>
                <td className="border p-3">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
