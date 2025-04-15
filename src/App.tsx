import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import UserCoursesScreen from './pages/UserCoursesScreen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            import UserCoursesScreen from "./pages/UserCoursesScreen";

<Route path="/user/:userId/courses" element={<UserCoursesScreen />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
