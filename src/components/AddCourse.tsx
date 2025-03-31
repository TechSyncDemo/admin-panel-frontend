import React, { useState } from "react";
import supabase from "../helper/supabaseClient";

interface AddCourseFormProps {
    onClose: () => void; // Function with no arguments that returns nothing
    refreshCourses: () => void; // Function with no arguments that returns nothing
  }

  const AddCourseForm: React.FC<AddCourseFormProps>  = ({ onClose, refreshCourses }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [classes, setClasses] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const courseData = {
      title,
      description,
      duration,
      classes,
      progress: {
        lastUpdate: new Date().toDateString(),
        completion: "0%",
        nextAssessment: "TBD",
      },
      tabs: ["Course content", "Overview", "Q&A", "Notes"],
      sections: [],
    };

    const { error } = await supabase.from("courses").insert([courseData]);
    if (error) {
      console.error("Error adding course:", error.message);
    } else {
      refreshCourses();
      onClose();
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Classes"
          value={classes}
          onChange={(e) => setClasses(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
