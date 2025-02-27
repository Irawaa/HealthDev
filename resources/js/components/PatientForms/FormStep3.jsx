// components/PatientForm/FormStep3.jsx
const FormStep3 = ({ formData, setFormData, isEditing }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });

    if (name === "obGyneHistory" && !checked) {
      setFormData({
        ...formData,
        obGyneHistory: false,
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
      });
    }

    if (name === "pregnantNo" && checked) {
      setFormData({ ...formData, pregnantYes: false, numberOfPregnancies: "" });
    }

    if (name === "pregnantYes" && checked) {
      setFormData({ ...formData, pregnantNo: false });
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-green-700 mb-4">Past Medical History</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {[
          { name: "allergy", label: "Allergy" },
          { name: "bleedingDisorder", label: "Bleeding Disorder" },
          { name: "bronchialAsthma", label: "Bronchial Asthma" },
          { name: "cardiovascularDisease", label: "Cardiovascular Disease" },
          { name: "hypertension", label: "Hypertension" },
          { name: "pulmonaryTuberculosis", label: "Pulmonary Tuberculosis" },
          { name: "skinDisorder", label: "Skin Disorder" },
          { name: "urinaryTractInfection", label: "Urinary Tract Infection" },
          { name: "lossOfConsciousness", label: "Loss of Consciousness" },
          { name: "surgery", label: "Surgery" },
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
      </div>

      <div className="flex flex-col mb-6">
        <label className="font-medium text-green-700">Others:</label>
        <input
          type="text"
          name="othersMedicalHistory"
          value={formData.othersMedicalHistory || ""}
          onChange={handleTextChange}
          disabled={!isEditing}
          className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
          placeholder="Specify other medical history"
        />
      </div>

      {/* Line Separator */}
      <hr className="border-t border-gray-300 my-6" />

      {/* OB/Gyne History Section */}
      <h3 className="text-xl font-semibold text-green-700 mt-6 mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          name="obGyneHistory"
          checked={formData.obGyneHistory || false}
          onChange={handleCheckboxChange}
          disabled={!isEditing}
          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <span>OB/Gyne History <span className="text-sm text-gray-500">(Female Only)</span></span>
      </h3>

      {/* Conditional OB/Gyne Fields */}
      {formData.obGyneHistory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Menstruation */}
          <div>
            <label className="font-medium text-green-700">Menstruation:</label>
            <div className="flex space-x-4">
              {["menstruationRegular", "menstruationIrregular"].map((name) => (
                <label key={name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name] || false}
                    onChange={(e) => {
                      setFormData({ ...formData, menstruationRegular: false, menstruationIrregular: false, [name]: e.target.checked });
                    }}
                    disabled={!isEditing}
                  />
                  <span>{name === "menstruationRegular" ? "Regular" : "Irregular"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="font-medium text-green-700">Duration:</label>
            <div className="flex space-x-4">
              {["duration1to3", "duration4to6", "duration7to9"].map((name, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name] || false}
                    onChange={(e) => {
                      setFormData({ duration1to3: false, duration4to6: false, duration7to9: false, [name]: e.target.checked });
                    }}
                    disabled={!isEditing}
                  />
                  <span>{name.replace("duration", "").replace("to", "-")} Days</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dysmenorrhea */}
          <div>
            <label className="font-medium text-green-700">Dysmenorrhea:</label>
            <div className="flex space-x-4">
              {["dysmenorrheaYes", "dysmenorrheaNo"].map((name) => (
                <label key={name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name] || false}
                    onChange={(e) => {
                      setFormData({ dysmenorrheaYes: false, dysmenorrheaNo: false, [name]: e.target.checked });
                    }}
                    disabled={!isEditing}
                  />
                  <span>{name === "dysmenorrheaYes" ? "Yes" : "No"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pregnancy */}
          <div>
            <label className="font-medium text-green-700">Have you been pregnant?</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="pregnantYes"
                  checked={formData.pregnantYes || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, pregnantYes: true, pregnantNo: false });
                    }
                  }}
                  disabled={!isEditing}
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="pregnantNo"
                  checked={formData.pregnantNo || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, pregnantYes: false, pregnantNo: true, numberOfPregnancies: "" });
                    }
                  }}
                  disabled={!isEditing}
                />
                <span>No</span>
              </label>
            </div>

            {/* Show Number of Pregnancies Input Only If "Yes" is Selected */}
            {formData.pregnantYes && (
              <div className="mt-2">
                <label className="font-medium text-green-700">If yes, number of pregnancies:</label>
                <input
                  type="number"
                  name="numberOfPregnancies"
                  value={formData.numberOfPregnancies || ""}
                  onChange={(e) => setFormData({ ...formData, numberOfPregnancies: e.target.value })}
                  disabled={!isEditing}
                  className="border border-gray-300 rounded p-2 w-full"
                  placeholder="Enter number of pregnancies"
                  min="1"
                />
              </div>
            )}
          </div>

          {/* Last Menstrual Period */}
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Last Menstrual Period:</label>
            <input
              type="date"
              name="lastMenstrualPeriod"
              value={formData.lastMenstrualPeriod || ""}
              onChange={(e) => setFormData({ ...formData, lastMenstrualPeriod: e.target.value })}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormStep3;
