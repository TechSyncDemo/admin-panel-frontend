import React from "react";

const Dashboard = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-blue-500 text-white rounded-lg">
            <h2 className="text-lg">Total Users</h2>
            <p className="text-3xl font-bold">120</p>
          </div>
          <div className="p-5 bg-green-500 text-white rounded-lg">
            <h2 className="text-lg">Total Courses</h2>
            <p className="text-3xl font-bold">25</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  