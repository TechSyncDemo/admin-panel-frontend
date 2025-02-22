import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 fixed">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/users" className="block p-2 hover:bg-gray-700 rounded">
              Users
            </Link>
          </li>
          <li>
            <Link to="/courses" className="block p-2 hover:bg-gray-700 rounded">
              Courses
            </Link>
          </li>
          <li>
            <Link to="/access-control" className="block p-2 hover:bg-gray-700 rounded">
              Access Control
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
