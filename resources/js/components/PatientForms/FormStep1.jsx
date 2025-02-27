// components/PatientForm/FormStep1.jsx
const FormStep1 = ({ formData, setFormData, isEditing }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, others: e.target.value });
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-green-700 mb-4">Review of System</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: "abdominalPain", label: "Abdominal Pain" },
          { name: "blurringVision", label: "Blurring of Vision" },
          { name: "chestPain", label: "Chest Pain" },
          { name: "coughColds", label: "Cough and Colds" },
          { name: "fever", label: "Fever" },
          { name: "dysuria", label: "Dysuria" },
          { name: "easyBruisability", label: "Easy Bruisability" },
          { name: "easyFatigability", label: "Easy Fatigability" },
          { name: "lbm", label: "LBM" },
          { name: "locSeizure", label: "LOC/Seizure" },
          { name: "recurrentHeadache", label: "Recurrent Headache" },
          { name: "vomiting", label: "Vomiting" },
        ].map(({ name, label }) => (
          <label key={name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={name}
              checked={formData[name] || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>{label}</span>
          </label>
        ))}

        <div className="flex flex-col">
          <label className="font-medium text-green-700">Others:</label>
          <input
            type="text"
            name="others"
            value={formData.others || ""}
            onChange={handleTextChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
            placeholder="Specify other symptoms"
          />
        </div>
      </div>
    </div>
  );
};

export default FormStep1;
