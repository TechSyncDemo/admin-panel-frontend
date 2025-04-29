import React, { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient";
import { Plus, Search, Trash2, BookOpen, X, Edit } from "lucide-react";
import AddCourseForm from "../components/AddCourse";
import EditCourseForm from "../components/EditCourseForm"; // Import EditCourseForm
// import { useNavigate } from "react-router-dom";

interface Topic {
  id: number;
  name: string;
  duration: number;
  videoUrl: string;
}
interface Section {
  id: number;
  title: string;
  topics: Topic[];
}
interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  classes: number;
  sections: Section[]
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  // const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("courses").select("*");

    if (error) {
      console.error("Error fetching courses:", error.message);
    } else {
      setCourses(data || []);
      setFilteredCourses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  // const handleCourseClick = (courseId: string | number) => {
  //   navigate(`/courses/${courseId}`);
  // };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", courseId);

    if (error) {
      console.error("Error deleting course:", error.message);
    } else {
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
      setFilteredCourses((prev) => prev.filter((course) => course.id !== courseId));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="p-4 text-center">Loading courses...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Duration</th>
                <th className="px-6 py-3 text-left">Classes</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id}
                // onClick={() => handleCourseClick(course.id)}
                >  
                  <td className="px-6 py-4 flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{course.duration}</td>
                  <td className="px-6 py-4">{course.classes}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => { setCourseToEdit(course); setShowEditModal(true); }}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteCourse(course.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <AddCourseForm onClose={() => setShowAddModal(false)} refreshCourses={fetchCourses} />
          </div>
        </div>
      )}

      {showEditModal && courseToEdit && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <EditCourseForm course={courseToEdit} onClose={() => setShowEditModal(false)} refreshCourses={fetchCourses} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
