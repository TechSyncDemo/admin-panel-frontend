import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { Plus, Trash2} from 'lucide-react';

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
  id: string; // Changed from number to string to match Supabase UUID
  title: string;
  description: string;
  duration: string;
  classes: number;
  sections: Section[];
}

interface EditCourseFormProps {
  course: Course;
  onClose: () => void;
  refreshCourses: () => void;
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({ course, onClose, refreshCourses }) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [duration, setDuration] = useState(course.duration);
  const [classes, setClasses] = useState(course.classes);
  const [sections, setSections] = useState<Section[]>(course.sections);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: "", topics: [] }]);
  };

  const removeSection = (sectionId: number) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const updateSectionTitle = (sectionId: number, newTitle: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    );
  };

  const addTopic = (sectionId: number) => {
    const newTopic: Topic = {
      id: Date.now(),
      name: "",
      duration: 0,
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

  const removeTopic = (sectionId: number, topicId: number) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, topics: section.topics.filter((topic) => topic.id !== topicId) }
          : section
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updatedCourseData = {
      title,
      description,
      duration,
      classes,
      sections,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("courses")
      .update(updatedCourseData)
      .eq('id', course.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    refreshCourses();
    onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Edit Course</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    placeholder="Enter course title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Enter course description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="Enter course duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classes</label>
                  <input
                    type="number"
                    placeholder="Enter number of classes"
                    value={classes}
                    onChange={(e) => setClasses(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Sections and Topics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Sections</h3>
                {sections.map((section, sectionIndex) => (
                  <div key={section.id} className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter section title"
                      />
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      {section.topics.map((topic, topicIndex) => (
                        <div key={topic.id} className="space-y-3 mt-3 border-t pt-3">
                          <div className="flex justify-between items-center">
                            <div className="w-3/4">
                              <label className="block text-sm font-medium text-gray-700">Topic Name</label>
                              <input
                                type="text"
                                value={topic.name}
                                onChange={(e) => updateTopic(section.id, topic.id, "name", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter topic name"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeTopic(section.id, topic.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex space-x-6">
                            <div className="w-1/2">
                              <label className="block text-sm font-medium text-gray-700">Duration</label>
                              <input
                                type="number"
                                value={topic.duration}
                                onChange={(e) =>
                                  updateTopic(section.id, topic.id, "duration", Number(e.target.value))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter duration (in minutes)"
                              />
                            </div>

                            <div className="w-1/2">
                              <label className="block text-sm font-medium text-gray-700">Video URL</label>
                              <input
                                type="text"
                                value={topic.videoUrl}
                                onChange={(e) =>
                                  updateTopic(section.id, topic.id, "videoUrl", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter video URL"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addTopic(section.id)}
                      className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Topic
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSection}
                  className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Section
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-white">
            {error && <p className="text-red-500 mr-auto">{error}</p>}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseForm;
