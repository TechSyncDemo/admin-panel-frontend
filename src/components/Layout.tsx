import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                location.pathname === item.path ? 'bg-gray-50 border-r-4 border-blue-500' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;