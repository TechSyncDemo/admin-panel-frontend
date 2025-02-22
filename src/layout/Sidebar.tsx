import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <ul className="mt-5 space-y-3">
        <li><Link to="/dashboard" className="block p-2 hover:bg-gray-700">Dashboard</Link></li>
        <li><Link to="/users" className="block p-2 hover:bg-gray-700">Users</Link></li>
        <li><Link to="/courses" className="block p-2 hover:bg-gray-700">Courses</Link></li>
        <li><Link to="/access-control" className="block p-2 hover:bg-gray-700">Access Control</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
