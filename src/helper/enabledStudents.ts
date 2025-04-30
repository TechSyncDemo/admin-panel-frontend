import supabase from "./supabaseClient";

interface Course {
  name: string;
  status: string;
}


interface Student {
    id: number;
    phone: string;
    name: string;
    user_id: string;
    courses: Course[];
    // Add any other fields you might have in the students table
  }

export const fetchEnabledStudents = async (courseId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("enabled_users")
      .eq("id", courseId)
      .single();

    if (error) {
      console.error("Error fetching enabled users:", error.message);
      return [];
    }

    const enabledUserIds = data?.enabled_users || [];

    const { data: students, error: studentError } = await supabase
      .from("students")
      .select("*")
      .in("user_id", enabledUserIds);

    if (studentError) {
      console.error("Error fetching students:", studentError.message);
      return [];
    }

    return students;
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
};



export const fetchStudentsByUserId = async (userId: string): Promise<Student[]> => {
    try {
      const { data, error } = await supabase
        .from("students") // Query the students table
        .select("*")
        .eq("user_id", userId); // Match the user_id column with the provided userId
  
      if (error) {
        console.error("Error fetching students by user ID:", error.message);
        return [];
      }
  
      return data || []; // Return students or an empty array
    } catch (err) {
      console.error("Unexpected error:", err);
      return [];
    }
  };