import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import supabase from "../helper/supabaseClient";
import { 
  Users, 
  BookOpen, 
  Activity, 
  Clock,
  CheckCircle 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { DashboardStats} from '../types';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  classes: number;
}

interface User {
  email: string;
  name: string;
  gender: string;
  role: string;
  validity: Date;
}

const Dashboard: React.FC = () =>{
  const [stats] = useState<DashboardStats>({
    activeUsers: 234,
    totalUsers: 1250,
    courseViews: 3456,
    averageEngagement: 78,
    completionRate: 82
  });

  //const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);


  const engagementData = [
    { name: 'Mon', views: 150, engagement: 65 },
    { name: 'Tue', views: 230, engagement: 72 },
    { name: 'Wed', views: 180, engagement: 68 },
    { name: 'Thu', views: 290, engagement: 85 },
    { name: 'Fri', views: 200, engagement: 70 },
    { name: 'Sat', views: 120, engagement: 55 },
    { name: 'Sun', views: 140, engagement: 60 }
  ];

  const fetchTotalClasses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("classes");
  
    if (error) {
      console.error("Error fetching total classes:", error.message);
      return;
    }

    const totalClasses = data.reduce((sum, course) => sum + (course.classes || 0), 0);
    setTotalClasses(totalClasses);
  };

  const fetchCourses = async () => {
    setLoadingCourses(true);
    const {count: totalCourses, data, error } = await supabase
      .from("courses")
      .select("id, title, description, duration, classes",  { count: "exact" })
      .limit(2);

    if (error) {
      console.error("Error fetching courses:", error.message);
    } else {
      setCourses(data || []);
      setTotalCourses(totalCourses || 0);
    }
    setLoadingCourses(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from("users")
      .select("email, name, gender, role, validity")
      .order("email", { ascending: false })
      .limit(2);

    if (error) {
      console.error("Error fetching top users:", error.message);
    } else {
      setUsers(data || []);
    }
    setLoadingUsers(false);
  };


  const fetchActiveUsers = async () => {
    const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });
  
    if (error) {
      console.error("Error fetching active users:", error.message);
      return 0;
    }
    return count || 0;
  };

  const [activeUsers, setActiveUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await fetchActiveUsers();
      setActiveUsers(count);
    };

    fetchCount();
    fetchCourses();
    fetchUsers();
    fetchTotalClasses();
  }, []);
  

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {format(new Date(), 'PPp')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers !== null ? activeUsers : "Loading..."}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{totalClasses !== null ? totalClasses : "Loading..."}</p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Course</p>
              <p className="text-2xl font-bold text-gray-900">{totalCourses !== null ? totalCourses : "Loading..."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Course Engagement Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3B82F6" 
                  fill="#93C5FD" 
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#10B981" 
                  fill="#6EE7B7" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Completion Statistics</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Started', count: stats.totalUsers },
                { name: 'Active', count: stats.activeUsers },
                { name: 'Completed', count: Math.round(stats.totalUsers * (stats.completionRate / 100)) }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Trending Courses</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {loadingCourses ? (
              <p className="text-gray-500 text-sm">Loading courses...</p>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <p className="text-xs text-gray-500">
                      {course.duration} mins • {course.classes} classes
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No courses available.</p>
            )}
          </div>
        </div>




        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Users</h2>
            <CheckCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {loadingUsers ? (
              <p className="text-gray-500 text-sm">Loading users...</p>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div key={user.email} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">
                      Email: {user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Valid upto: {user.validity.toString()} | {user.role}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No users available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;  