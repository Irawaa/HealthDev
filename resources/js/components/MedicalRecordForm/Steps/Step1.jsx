const Step1 = ({ formData, setFormData }) => {
  const symptoms = [
    { name: "Abdominal pain (pagsakit ng tiyan)", label: "Abdominal Pain" },
    { name: "Blurring of vision (panlalabo ng mata)", label: "Blurring of Vision" },
    { name: "Chest pain (pagsakit ng dibdib)", label: "Chest Pain" },
    { name: "Cough and colds (ubo at sipon)", label: "Cough and Colds" },
    { name: "Dysuria (masakit na pag-ihi)", label: "Dysuria" },
    { name: "Easy bruisability (mabilis magka pasa)", label: "Easy Bruisability" },
    { name: "Easy fatigability (mabilis mapagod)", label: "Easy Fatigability" },
    { name: "Fever (lagnat)", label: "Fever" },
    { name: "LBM (pagtatae)", label: "LBM" },
    { name: "LOC/ Seizure (nawalan ng malay/konbulsiyon)", label: "LOC/Seizure" },
    { name: "Recurrent Headache (pabalik-balik na sakit ng ulo)", label: "Recurrent Headache" },
    { name: "Vomiting (pagsusuka)", label: "Vomiting" },
  ];  

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    const updatedSystems = checked
      ? [...formData.review_of_systems, value]
      : formData.review_of_systems.filter((symptom) => symptom !== value);

    setFormData({ ...formData, review_of_systems: updatedSystems });
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, others: e.target.value });
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
              value={name} // Use symptom name instead of input name
              checked={formData.review_of_systems.includes(name)}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>{label}</span>
          </label>
        ))}

        <div>
          <label className="font-medium text-green-700">Others:</label>
          <input
            type="text"
            name="others"
            value={formData.others || ""}
            onChange={handleTextChange}
            className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
            placeholder="Specify other symptoms"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1;
