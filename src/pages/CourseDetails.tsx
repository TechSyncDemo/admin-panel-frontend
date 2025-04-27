import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchEnabledStudents } from "../helper/enabledStudents";
import React from "react";

// Define the Student interface
interface Student {
  id: number;
  name: string;
  // Add other fields as required
}

const CourseDetails = () => {
  // Ensure courseId is strongly typed
  const { courseId } = useParams<{ courseId: string }>();

  // State with explicitly defined type
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseId) return; // Exit if courseId is undefined
      setLoading(true);
      const fetchedStudents = await fetchEnabledStudents(courseId);
      setStudents(fetchedStudents);
      setLoading(false);
    };

    fetchStudents();
  }, [courseId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Students Enabled for Course</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetails;