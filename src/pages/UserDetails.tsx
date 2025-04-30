import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentsByUserId } from "../helper/enabledStudents";
import { ChevronDown, ChevronUp, User, BookOpen, AlertCircle} from "lucide-react";

interface Course {
  name: string;
  status: string;
}

interface Student {
  id: number;
  name: string;
  phone: string;
  user_id: string;
  courses: Course[];
}

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!userId) return;
      setLoading(true);
      
      try {
        const fetchedStudents = await fetchStudentsByUserId(userId);
        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [userId]);

  const toggleStudentExpansion = (studentId: number) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <User className="mr-2 h-6 w-6 text-blue-500" />
            Students Managed by User
          </h1>
          <p className="text-sm text-gray-500 mt-1">User ID: {userId}</p>
        </div>

        {students.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student.id} className="px-6 py-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleStudentExpansion(student.id)}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-800">{student.name}</h2>
                      <p className="text-xs text-gray-500 flex items-center">         
                        {student.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {student.courses?.length || 0} courses
                    </span>
                    {expandedStudent === student.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedStudent === student.id && student.courses && student.courses.length > 0 ? (
                  <div className="mt-4 ml-14">
                    <h3 className="font-medium text-gray-700 flex items-center mb-2">
                      <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
                      Enrolled Courses
                    </h3>
                    <ul className="bg-gray-50 rounded-md overflow-hidden">
                      {student.courses.map((course, index) => (
                        <li
                          key={index}
                          className="px-4 py-3 border-b last:border-0 flex justify-between items-center"
                        >
                          <span>{course.name}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(
                              course.status
                            )}`}
                          >
                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : expandedStudent === student.id ? (
                  <div className="mt-4 ml-14">
                    <p className="text-sm text-gray-500 italic">No courses enrolled</p>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-700">No Students Enrolled</h2>
            <p className="text-gray-500 mt-1">
              This user currently doesn't have any students assigned.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;