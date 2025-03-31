import React, { useState } from "react";
import supabase from "../helper/supabaseClient";

interface Topic {
  id: number;
  name: string;
  duration: number; // Duration is now a number (minutes)
  videoUrl: string;
}

interface Section {
  id: number;
  title: string;
  topics: Topic[];
}

interface AddCourseFormProps {
  onClose: () => void;
  refreshCourses: () => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({ onClose, refreshCourses }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number>(0);
  const [classes, setClasses] = useState<number>(1);
  const [sections, setSections] = useState<Section[]>([]);

  // Add a new section
  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: "", topics: [] }]);
  };

  // Remove a section
  const removeSection = (sectionId: number) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  // Update section title
  const updateSectionTitle = (sectionId: number, newTitle: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    );
  };

  // Add a topic to a section
  const addTopic = (sectionId: number) => {
    const newTopic: Topic = {
      id: Date.now(),
      name: "",
      duration: 0, // Default to 0 minutes
      videoUrl: "",
    };

    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, topics: [...section.topics, newTopic] }
          : section
      )
    );
  };

  // Update a topic
  const updateTopic = (sectionId: number, topicId: number, field: keyof Topic, value: string | number) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              topics: section.topics.map((topic) =>
                topic.id === topicId ? { ...topic, [field]: value } : topic
              ),
            }
          : section
      )
    );
  };

  // Remove a topic
  const removeTopic = (sectionId: number, topicId: number) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, topics: section.topics.filter((topic) => topic.id !== topicId) }
          : section
      )
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const courseData = {
      title,
      description,
      duration,
      classes,
      tabs: [
        "Course content",
        "Overview",
        "Q&A",
        "Notes"
      ],
      sections, // Include sections in submission
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
        



<div className="flex gap-4">
  {/* Duration input with "min" suffix */}
  <div className="flex flex-col w-1/2">
    <label className="text-sm font-semibold">Duration</label>
    <div className="flex items-center border rounded p-2">
      <input
        type="number"
        placeholder="Duration"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="w-full outline-none"
        required
        min="1"
      />
      <span className="ml-2 text-gray-600">min</span>
    </div>
  </div>

  {/* Classes input as a dropdown */}
  <div className="flex flex-col w-1/2">
    <label className="text-sm font-semibold">Classes</label>
    <select
      value={classes}
      onChange={(e) => setClasses(Number(e.target.value))}
      className="w-full p-2 border rounded"
      required
    >
      <option value="1">1 Class</option>
      <option value="2">2 Classes</option>
      <option value="3">3 Classes</option>
      <option value="4">4 Classes</option>
      <option value="5">5 Classes</option>
    </select>
  </div>
</div>


        {/* Section Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sections</h3>
          {sections.map((section) => (
            <div key={section.id} className="p-4 border rounded-lg">
              <input
                type="text"
                placeholder="Section Title"
                value={section.title}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => addTopic(section.id)}
                className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
              >
                + Add Topic
              </button>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="mt-2 ml-2 px-4 py-1 bg-red-500 text-white rounded"
              >
                🗑 Remove Section
              </button>

              {/* Topic Management */}
              {section.topics.map((topic) => (
                <div key={topic.id} className="mt-3 p-3 border rounded-lg">
                  <input
                    type="text"
                    placeholder="Topic Name"
                    value={topic.name}
                    onChange={(e) => updateTopic(section.id, topic.id, "name", e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={topic.duration}
                    onChange={(e) => updateTopic(section.id, topic.id, "duration", Number(e.target.value))}
                    className="w-full p-2 border rounded mt-2"
                    required
                    min="1"
                  />
                  <input
                    type="text"
                    placeholder="Video URL"
                    value={topic.videoUrl}
                    onChange={(e) => updateTopic(section.id, topic.id, "videoUrl", e.target.value)}
                    className="w-full p-2 border rounded mt-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(section.id, topic.id)}
                    className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
                  >
                    🗑 Remove Topic
                  </button>
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Section
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;
