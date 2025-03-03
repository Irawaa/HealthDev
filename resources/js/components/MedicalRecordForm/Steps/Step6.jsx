const Step6 = ({ formData, setFormData }) => {
  const labTests = [
    "Blood Chemistry",
    "FBS",
    "Uric Acid",
    "Triglycerides",
    "T.Cholesterol",
    "Creatinine",
  ];

  // 🔥 Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔥 Handle File Upload (Chest X-Ray)
  const handleFileChange = (e) => {
    setFormData({ ...formData, chestXRay: e.target.files[0] });
  };

  return (
    <div className="p-4 space-y-6">
      {/* 📸 Chest X-Ray Upload */}
      <h3 className="text-xl font-semibold text-green-700">Chest X-Ray</h3>
      <input
        type="file"
        name="chestXRay"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500 file:bg-green-100 file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:cursor-pointer"
      />

      {/* 🩺 Laboratory Tests */}
      <h3 className="text-xl font-semibold text-green-700">Laboratory Tests</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {labTests.map((test) => (
          <div key={test} className="flex flex-col">
            <label className="font-medium text-gray-700">{test}:</label>
            <input
              type="text"
              name={test.toLowerCase().replace(/\s/g, "")}
              value={formData[`${test.toLowerCase().replace(/\s/g, "")}`] || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Enter result"
            />
          </div>
        ))}
      </div>

      {/* 🔹 Separator */}
      <div className="border-t-2 border-gray-300 my-6"></div>

      {/* 🛡️ Vaccination Status */}
      <h3 className="text-xl font-semibold text-green-700">Vaccination Status</h3>
      <input
        type="text"
        name="vaccinationDetails"
        value={formData.vaccinationDetails || ""}
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
        placeholder="Enter vaccination details"
      />

      {/* 📋 Final Evaluation */}
      <h3 className="text-xl font-semibold text-green-700">Final Evaluation</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {["Class A", "Class B", "Pending"].map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="radio"
              name="finalEvaluation"
              value={option}
              checked={formData.finalEvaluation === option}
              onChange={handleInputChange}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span>{option} {option === "Class A" ? "(Physically Fit)" : option === "Class B" ? "(Fit with Minor Illness)" : "(Needs Clearance)"}</span>
          </label>
        ))}
      </div>

      {/* 📝 Plan/Recommendation */}
      <h3 className="text-xl font-semibold text-green-700">Plan/Recommendation</h3>
      <textarea
        name="planRecommendation"
        value={formData.planRecommendation || ""}
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 w-full h-32 focus:ring-green-500 focus:border-green-500"
        placeholder="Enter plan or recommendation"
      ></textarea>
    </div>
  );
};

export default Step6;
