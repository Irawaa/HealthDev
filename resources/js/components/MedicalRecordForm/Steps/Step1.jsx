const Step1 = ({ formData, setFormData }) => {
  const symptoms = [
    { name: "Abdominal pain (pagsakit ng tiyan)", label: "Abdominal Pain" },
    {
      name: "Blurring of vision (panlalabo ng mata)",
      label: "Blurring of Vision",
    },
    { name: "Chest pain (pagsakit ng dibdib)", label: "Chest Pain" },
    { name: "Cough and colds (ubo at sipon)", label: "Cough and Colds" },
    { name: "Dysuria (masakit na pag-ihi)", label: "Dysuria" },
    {
      name: "Easy bruisability (mabilis magka pasa)",
      label: "Easy Bruisability",
    },
    { name: "Easy fatigability (mabilis mapagod)", label: "Easy Fatigability" },
    { name: "Fever (lagnat)", label: "Fever" },
    { name: "LBM (pagtatae)", label: "LBM" },
    {
      name: "LOC/ Seizure (nawalan ng malay/konbulsiyon)",
      label: "LOC/Seizure",
    },
    {
      name: "Recurrent Headache (pabalik-balik na sakit ng ulo)",
      label: "Recurrent Headache",
    },
    { name: "Vomiting (pagsusuka)", label: "Vomiting" },
    { name: "Others", label: "Others" }, // Ensure "Others" is in the list
  ];

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedSymptoms = checked
      ? [...formData.review_of_systems, value]
      : formData.review_of_systems.filter((symptom) => symptom !== value);

    setFormData({ ...formData, review_of_systems: updatedSymptoms });
  };

  const handleTextChange = (e) => {
    const newValue = e.target.value;

    setFormData((prev) => {
      let updatedSymptoms = prev.review_of_systems.filter(
        (symptom) => symptom !== prev.others
      );

      if (newValue) {
        updatedSymptoms = [...updatedSymptoms, "Others"]; // Ensure "Others" is added
      }

      return {
        ...prev,
        others: newValue,
        review_of_systems: updatedSymptoms,
      };
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-green-700 mb-4">
        Review of System
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {symptoms.map(({ name, label }) => (
          <label key={name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={name}
              checked={formData.review_of_systems.includes(name)}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>{label}</span>
          </label>
        ))}

        {formData.review_of_systems.includes("Others") && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="others"
              value={formData.others || ""}
              onChange={handleTextChange}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Specify other symptoms"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1;
