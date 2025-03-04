const Step3 = ({ formData, setFormData, patient }) => {
  const isMale = patient.gender === 1;

  const medicalHistoryOptions = [
    { name: "Allergy", label: "Allergy" },
    { name: "Bleeding disorder", label: "Bleeding disorder" },
    { name: "Bronchial asthma", label: "Bronchial asthma" },
    { name: "Cardiovascular Disease", label: "Cardiovascular Disease" },
    { name: "Hypertension", label: "Hypertension" },
    { name: "Pulmonary Tuberculosis (PTB)", label: "Pulmonary Tuberculosis (PTB)" },
    { name: "Skin disorder", label: "Skin disorder" },
    { name: "Surgery", label: "Surgery" },
    { name: "Urinary Tract Infection (UTI)", label: "Urinary Tract Infection (UTI)" },
    { name: "Loss of consciousness", label: "Loss of consciousness" },
    { name: "Others", label: "Others" },
  ];

  const obGyneOptions = {
    menstruation: [
      { name: "menstruationRegular", label: "Regular" },
      { name: "menstruationIrregular", label: "Irregular" },
    ],
    duration: [
      { name: "duration1to3", label: "1-3 Days" },
      { name: "duration4to6", label: "4-6 Days" },
      { name: "duration7to9", label: "7-9 Days" },
    ],
    dysmenorrhea: [
      { name: "dysmenorrheaYes", label: "Yes" },
      { name: "dysmenorrheaNo", label: "No" },
    ],
    pregnancy: [
      { name: "pregnantYes", label: "Yes" },
      { name: "pregnantNo", label: "No" },
    ],
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
  
    setFormData((prev) => {
      let updatedData = { ...prev };
  
      // Handle past medical history checkboxes
      if (name !== "obGyneHistory" && name !== "pregnantYes" && name !== "pregnantNo") {
        updatedData.past_medical_histories = checked
          ? [...(prev.past_medical_histories || []), name] // Add to history
          : prev.past_medical_histories?.filter((item) => item !== name) || []; // Remove if unchecked
  
        if (name === "Others" && !checked) {
          updatedData.other_condition = ""; // Clear input when unchecked
        }
      }
  
      // Handle OB/Gyne History Checkbox
      if (name === "obGyneHistory") {
        updatedData.obGyneHistory = checked;
        if (!checked) {
          updatedData = {
            ...updatedData,
            menstruationRegular: false,
            menstruationIrregular: false,
            duration1to3: false,
            duration4to6: false,
            duration7to9: false,
            dysmenorrheaYes: false,
            dysmenorrheaNo: false,
            pregnantYes: false,
            pregnantNo: false,
            numberOfPregnancies: "",
            lastMenstrualPeriod: "",
          };
        }
      }
  
      // Handle Pregnancy Logic
      if (name === "pregnantNo" && checked) {
        updatedData.pregnantYes = false;
        updatedData.numberOfPregnancies = "";
      } else if (name === "pregnantYes" && checked) {
        updatedData.pregnantNo = false;
      }
  
      return updatedData;
    });
  };  

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const CheckboxGroup = ({ options, formData, handleChange }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      {options.map(({ name, label }) => (
        <label key={name} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name={name}
            checked={formData.past_medical_histories?.includes(name) || false}
            onChange={handleChange}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-green-700 mb-4">Past Medical History</h3>

      <CheckboxGroup options={medicalHistoryOptions} formData={formData} handleChange={handleCheckboxChange} />

      <div className="flex flex-col mb-6">
        <label className="font-medium text-green-700">Others:</label>
        <input
          type="text"
          name="other_condition"
          value={formData.other_condition || ""}
          onChange={handleTextChange}
          className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
          placeholder="Specify other medical history"
          disabled={!formData.past_medical_histories?.includes("Others")}
        />
      </div>

      {!isMale && (
        <>
          <hr className="border-t border-gray-300 my-6" />

          <h3 className="text-xl font-semibold text-green-700 mt-6 mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              name="obGyneHistory"
              checked={formData.obGyneHistory || false}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>OB/Gyne History <span className="text-sm text-gray-500">(Female Only)</span></span>
          </h3>

          {formData.obGyneHistory && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(obGyneOptions).map(([key, options]) => (
                <div key={key}>
                  <label className="font-medium text-green-700">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <div className="flex space-x-4">
                    {options.map(({ name, label }) => (
                      <label key={name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={name}
                          checked={formData[name] || false}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              [options[0].name]: name === options[0].name ? e.target.checked : false,
                              [options[1].name]: name === options[1].name ? e.target.checked : false,
                            }));
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {formData.pregnantYes && (
                <div className="mt-2">
                  <label className="font-medium text-green-700">If yes, number of pregnancies:</label>
                  <input
                    type="number"
                    name="numberOfPregnancies"
                    value={formData.numberOfPregnancies || ""}
                    onChange={handleTextChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    placeholder="Enter number of pregnancies"
                    min="1"
                  />
                </div>
              )}

              <div className="flex flex-col">
                <label className="font-medium text-green-700">Last Menstrual Period:</label>
                <input
                  type="date"
                  name="lastMenstrualPeriod"
                  value={formData.lastMenstrualPeriod || ""}
                  onChange={handleTextChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Step3;
