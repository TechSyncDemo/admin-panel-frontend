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

// types.ts (or types/index.ts)
export interface Course {
  id: number; // Changed to number
  title: string;
  description: string;
  duration: string;
  enrolledUsers: number;
  status: string;
  createdAt: string;
}

export interface User {
  id: number; // Changed to number
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
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