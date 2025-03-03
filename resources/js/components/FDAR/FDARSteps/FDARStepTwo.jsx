const FDARStepTwo = ({ formData, handleChange }) => {
    return (
      <div className="p-6 space-y-8">
        <h3 className="text-2xl font-bold text-green-800">Patient Vitals</h3>
  
        {[
          { key: "weight", label: "Weight" },
          { key: "height", label: "Height" },
          { key: "bloodPressure", label: "Blood Pressure" },
          { key: "cr", label: "CR" },
          { key: "rr", label: "RR" },
          { key: "temp", label: "Temperature (T)" },
          { key: "o2Sat", label: "O₂ Saturation" },
          { key: "lmp", label: "LMP" },
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
  
  export default FDARStepTwo;
  