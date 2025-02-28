const FDARStepOne = ({ formData, handleChange }) => {
    return (
      <div className="p-6 space-y-8">
        <h3 className="text-2xl font-bold text-green-800">FDAR Information</h3>
  
        {[
          { key: "focus", label: "Focus (F)" },
          { key: "data", label: "Data (D)" },
          { key: "action", label: "Action (A)" },
          { key: "response", label: "Response (R)" },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="border-b border-gray-300 bg-transparent px-2 py-2 focus:ring-0 focus:border-green-600 transition-all"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}
      </div>
    );
  };
  
  export default FDARStepOne;
  