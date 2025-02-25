export interface UserActivity {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface CourseCompletion {
  id: number;
  user: string;
  courseName: string;
  completedAt: string;
  score: number;
}

export interface DashboardStats {
  activeUsers: number;
  totalUsers: number;
  courseViews: number;
  averageEngagement: number;
  completionRate: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  enrolledUsers: number;
  status: 'active' | 'draft';
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
}