import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import { fetchCourses } from "../helper/courseHelper"; 

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  enabled_users: string[];
  isEnabled: boolean;
}

const UserCoursesScreen: React.FC = () => {
  const { userId } = useParams(); // ✅ Get the current user ID from the URL
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUserCourses();
//   }, []);

//   const fetchUserCourses = async () => {
//     setLoading(true);
//     const data = await fetchCourses(); // ✅ Reuse the shared fetch function
//     setCourses(
//       data.map((course) => ({
//         ...course,
//         isEnabled: course.enabled_users.includes(userId!), // ✅ Check if user ID exists in enabled_users
//       }))
//     );
//     setLoading(false);
//   };

const fetchUserCourses = useCallback(async () => {
    setLoading(true);
    const data = await fetchCourses(); // ✅ Reuse the shared fetch function
    setCourses(
      data.map((course) => ({
        ...course,
        isEnabled: course.enabled_users.includes(userId!), // ✅ Check if user ID exists
      }))
    );
    setLoading(false);
  }, [userId]); // ✅ Dependency is `userId`

  // ✅ useEffect to call fetchUserCourses
  useEffect(() => {
    fetchUserCourses(); // Call the memoized function
  }, [fetchUserCourses]);



  const toggleCourse = async (courseId: string, isEnabled: boolean) => {
    const updatedEnabledUsers = isEnabled
      ? courses.find((c) => c.id === courseId)?.enabled_users.filter((id) => id !== userId) || [] // ✅ Remove user ID
      : [...courses.find((c) => c.id === courseId)?.enabled_users || [], userId]; // ✅ Add user ID

    const { error } = await supabase
      .from("courses")
      .update({ enabled_users: updatedEnabledUsers }) // ✅ Update DB
      .eq("id", courseId);

    if (!error) {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, isEnabled: !isEnabled } : course
        )
      );
    } else {
      console.error("Error updating course:", error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Courses for User {userId}</h2>
      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div>
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-md mb-2"
            >
              <div>
                <p className="font-bold">{course.title}</p>
                <p className="text-sm text-gray-500">{course.description}</p>
              </div>
              <input
                type="checkbox"
                checked={course.isEnabled}
                onChange={() => toggleCourse(course.id, course.isEnabled)} // ✅ Toggle enable/disable
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCoursesScreen;
