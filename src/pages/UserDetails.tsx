import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentsByUserId } from "../helper/enabledStudents";

interface Student {
  id: number;
  name: string;
  user_id: string;
  // Add other fields based on your table schema
}

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>(); // Ensure userId is properly typed
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!userId) return; // Handle undefined userId
      setLoading(true);
      const fetchedStudents = await fetchStudentsByUserId(userId);
      setStudents(fetchedStudents);
      setLoading(false);
    };

    fetchStudents();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Students Managed by User</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;