import supabase from "../helper/supabaseClient";

export const fetchCourses = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) {
      console.error("Error fetching courses:", error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};