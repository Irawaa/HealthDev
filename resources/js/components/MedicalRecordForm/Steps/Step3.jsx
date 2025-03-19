import { useEffect } from "react";

useEffect

const Step3 = ({ formData, setFormData, patient }) => {
  const isMale = patient.gender === 1;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      obGyneHistory: prev.obGyneHistory ?? true, // ✅ Default to true if not set
    }));
  }, []);

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
      { name: "Regular", label: "Regular" },
      { name: "Irregular", label: "Irregular" },
    ],
    duration: [
      { name: "1-3 days", label: "1-3 Days" },
      { name: "4-6 days", label: "4-6 Days" },
      { name: "7-9 days", label: "7-9 Days" },
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

      if (name === "obGyneHistory") {
        updatedData.obGyneHistory = checked;
        if (checked) {
          updatedData = {
            ...updatedData,
            menstruation: updatedData.menstruation || "Regular",
            duration: updatedData.duration || "4-6 days",
            dysmenorrhea: updatedData.dysmenorrhea ?? false,
            pregnant_before: updatedData.pregnant_before ?? false,
            num_of_pregnancies: updatedData.num_of_pregnancies || "",
            last_menstrual_period: updatedData.last_menstrual_period || "",
          };
        } else {
          updatedData = {
            ...updatedData,
            menstruation: "",
            duration: "",
            dysmenorrhea: false,
            pregnant_before: false,
            num_of_pregnancies: "",
            last_menstrual_period: "",
          };
        }
      }

      // Handle Pregnancy Logic
      if (name === "pregnantNo" && checked) {
        updatedData.pregnant_before = false;
        updatedData.num_of_pregnancies = "";
      } else if (name === "pregnantYes" && checked) {
        updatedData.pregnant_before = true;
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

      <CheckboxGroup
        options={medicalHistoryOptions}
        formData={formData}
        handleChange={handleCheckboxChange}
      />

      <div className="flex flex-col mb-6">
        <label className="font-medium text-green-700">Others:</label>
        <input
          type="text"
          name="other_condition"
          value={formData.other_condition || ""}
          onChange={handleTextChange}
          className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
          placeholder="Specify other medical history"
        />
      </div>

      {!isMale && (
        <>
          <hr className="border-t border-gray-300 my-6" />
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            OB/Gyne History (Female Only)
          </h3>

          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              name="obGyneHistory"
              checked={formData.obGyneHistory ?? false}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Check if applicable</span>
          </label>

          {formData.obGyneHistory && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(obGyneOptions).map(([key, options]) => (
                <div key={key}>
                  <label className="font-medium text-green-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </label>
                  <div className="flex space-x-4">
                    {options.map(({ name, label }) => (
                      <label key={name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={name}
                          checked={formData[key] === name} // ✅ Only one can be checked
                          onChange={() => {
                            setFormData((prev) => ({
                              ...prev,
                              [key]: name, // ✅ Ensures only one checkbox is selected at a time
                            }));
                          }}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="font-medium text-green-700">Dysmenorrhea:</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="dysmenorrhea"
                      checked={formData.dysmenorrhea}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dysmenorrhea: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="dysmenorrheaNo"
                      checked={!formData.dysmenorrhea}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dysmenorrhea: !e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-medium text-green-700">Pregnant Before:</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="pregnant_before"
                      checked={formData.pregnant_before}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pregnant_before: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span>Yes</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="pregnant_before_no"
                      checked={!formData.pregnant_before}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pregnant_before: !e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.pregnant_before && (
                <div>
                  <label className="font-medium text-green-700">Number of Pregnancies:</label>
                  <input
                    type="number"
                    name="num_of_pregnancies"
                    value={formData.num_of_pregnancies || ""}
                    onChange={handleTextChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    min="1"
                  />
                </div>
              )}

              <div>
                <label className="font-medium text-green-700">Last Menstrual Period:</label>
                <input
                  type="date"
                  name="last_menstrual_period"
                  value={formData.last_menstrual_period || ""}
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
