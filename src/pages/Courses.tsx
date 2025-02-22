import React from "react";
import { useState } from "react";

interface Course {
  id: number;
  title: string;
  youtubeLink: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: "React Basics", youtubeLink: "https://youtube.com/abc" },
    { id: 2, title: "TailwindCSS Guide", youtubeLink: "https://youtube.com/xyz" },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">YouTube Link</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="text-center">
              <td className="border p-2">{course.id}</td>
              <td className="border p-2">{course.title}</td>
              <td className="border p-2">
                <a href={course.youtubeLink} target="_blank" className="text-blue-500">
                  Watch
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
