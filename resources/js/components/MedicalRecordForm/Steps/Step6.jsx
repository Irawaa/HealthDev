const Step6 = ({ formData, setFormData }) => {
  const labTests = [
    { name: "blood_chemistry", label: "Blood Chemistry" },
    { name: "fbs", label: "FBS" },
    { name: "uric_acid", label: "Uric Acid" },
    { name: "triglycerides", label: "Triglycerides" },
    { name: "t_cholesterol", label: "T. Cholesterol" },
    { name: "creatinine", label: "Creatinine" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, chest_xray: e.target.files[0] });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Chest X-Ray Upload */}
      <h3 className="text-xl font-semibold text-green-700">Chest X-Ray</h3>
      <input
        type="file"
        name="chest_xray"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 file:bg-green-100 file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:cursor-pointer"
      />
      {formData.chest_xray && (
        <img
          src={URL.createObjectURL(formData.chest_xray)}
          alt="X-Ray Preview"
          className="w-48 h-48 object-cover rounded-lg mt-4"
        />
      )}

      {/* Laboratory Tests */}
      <h3 className="text-xl font-semibold text-green-700">Laboratory Tests</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {labTests.map(({ name, label }) => (
          <div key={name} className="flex flex-col">
            <label className="font-medium text-gray-700">{label}:</label>
            <input
              type="text"
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500"
              placeholder={`Enter ${label} result`}
            />
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-300 my-6"></div>

      {/* Vaccination Status */}
      <h3 className="text-xl font-semibold text-green-700">Vaccination Status</h3>
      <input
        type="text"
        name="vaccination_status"
        value={formData.vaccination_status || ""}
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 w-full focus:ring-green-500"
        placeholder="Enter vaccination details"
      />

      {/* Final Evaluation 🔥✅ */}
      <h3 className="text-xl font-semibold text-green-700">Final Evaluation</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {["Class A", "Class B", "Pending"].map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="radio"
              name="final_evaluation"
              value={option} // ✅ EXACT VALUE ENUM
              checked={formData.final_evaluation === option}
              onChange={handleInputChange}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>
              {option}{" "}
              {option === "Class A"
                ? "(Physically Fit)"
                : option === "Class B"
                ? "(Physically Fit with Minor Illness)"
                : "(Needs Clearance)"}
            </span>
          </label>
        ))}
      </div>

      {/* Plan/Recommendation */}
      <h3 className="text-xl font-semibold text-green-700">Plan/Recommendation</h3>
      <textarea
        name="plan_recommendation"
        value={formData.plan_recommendation || ""}
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 w-full h-32 focus:ring-green-500"
        placeholder="Enter plan or recommendation"
      ></textarea>
    </div>
  );
};

export default Step6;
