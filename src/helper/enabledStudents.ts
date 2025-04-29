import supabase from "./supabaseClient";

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