import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { CommonDiseasesContext } from "@/pages/Patients/Index"; // Adjust the import path

const FDARTags = ({ selectedTagIds, setSelectedTagIds }) => {
  const commonDiseases = useContext(CommonDiseasesContext); // Retrieve data from context
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (Array.isArray(commonDiseases)) {
      setSuggestedTags(commonDiseases); // Store the full object list [{ id, name }, ...]
    }
  }, [commonDiseases]);

  const saveTagsToCookies = (tagIds) => {
    Cookies.set("focus_tags", JSON.stringify(tagIds), { expires: 7 });
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tagName) => {
    const matchedTag = suggestedTags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());

    if (matchedTag && !selectedTagIds.includes(matchedTag.id)) {
      const updatedTagIds = [...selectedTagIds, matchedTag.id];
      setSelectedTagIds(updatedTagIds);
      saveTagsToCookies(updatedTagIds);
    }
    setInputValue("");
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const removeTag = (tagIdToRemove) => {
    const updatedTagIds = selectedTagIds.filter(id => id !== tagIdToRemove);
    setSelectedTagIds(updatedTagIds);
    saveTagsToCookies(updatedTagIds);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() !== "") {
      const filtered = suggestedTags.filter(tag =>
        tag.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="flex flex-col mb-4 relative">
      <label className="text-xs font-medium text-gray-700">Focus</label>

      {/* ✅ Tag Input Field */}
      <div className="border border-gray-300 bg-white p-2 rounded focus-within:ring-1 focus-within:ring-green-500 transition-all relative">
        <div className="flex flex-wrap gap-2">
          {selectedTagIds.map((tagId, index) => {
            const tag = suggestedTags.find(t => t.id === tagId);
            return (
              tag && (
                <div key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                  {tag.name}
                  <button
                    onClick={() => removeTag(tagId)}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              )
            );
          })}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleTagInput}
          className="border-none focus:ring-0 w-full text-sm outline-none"
          placeholder="Type to search or add..."
        />
      </div>

      {/* ✅ Fixed Autocomplete Suggestions Positioning */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute top-full left-0 bg-white border border-gray-300 rounded shadow-md w-full z-10 max-h-40 overflow-y-auto mt-1">
          {filteredSuggestions.map((tag, index) => (
            <li
              key={index}
              className="p-2 text-sm cursor-pointer hover:bg-green-100"
              onClick={() => addTag(tag.name)}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FDARTags;
