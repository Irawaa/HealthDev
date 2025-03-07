import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // ✅ For storing tags

const FDARTags = ({ selectedTags, setSelectedTags }) => {
  const [suggestedTags, setSuggestedTags] = useState([]);

  // Load saved tags from cookies on mount
  useEffect(() => {
    const savedTags = Cookies.get("focus_tags");
    if (savedTags) {
      setSuggestedTags(JSON.parse(savedTags));
    }
  }, []);

  // Save tags to cookies
  const saveTagsToCookies = (tags) => {
    Cookies.set("focus_tags", JSON.stringify(tags), { expires: 7 });
  };

  // Handle adding a new tag
  const handleTagInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      const newTag = e.target.value.trim();

      if (!selectedTags.includes(newTag)) {
        const updatedTags = [...selectedTags, newTag];
        setSelectedTags(updatedTags);
        saveTagsToCookies(updatedTags);
      }
      
      e.target.value = ""; // Clear input field
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    saveTagsToCookies(updatedTags);
  };

  // Add a suggested tag
  const addSuggestedTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      saveTagsToCookies(updatedTags);
    }
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="text-xs font-medium text-gray-700">Focus</label>
      
      {/* ✅ Tag Input Field */}
      <div className="border border-gray-300 bg-white p-2 rounded focus-within:ring-1 focus-within:ring-green-500 transition-all">
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <div key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
              >
                &times;
              </button>
            </div>
          ))}
          <input
            type="text"
            onKeyDown={handleTagInput}
            className="border-none focus:ring-0 w-full text-sm outline-none"
            placeholder="Type and press Enter..."
          />
        </div>
      </div>

      {/* ✅ Suggested Tags */}
      {suggestedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs text-gray-500">Suggested:</span>
          {suggestedTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => addSuggestedTag(tag)}
              className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FDARTags;
