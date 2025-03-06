// components/PatientForm/FormStep4.jsx
const Step4 = ({ formData, setFormData }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => {
      let updatedData = { ...prev, [name]: checked };

      // ✅ Hospitalized Logic
      if (name === "hospitalized" && checked) {
        updatedData.hospitalized = true;
      }
      if (name === "hospitalizedNo" && checked) {
        updatedData.hospitalized = false;
        updatedData.hospitalized_reason = ""; // Clear reason
      }

      // ✅ Surgery Logic
      if (name === "previous_surgeries" && checked) {
        updatedData.previous_surgeries = true;
      }
      if (name === "surgeryNo" && checked) {
        updatedData.previous_surgeries = false;
        updatedData.surgery_reason = ""; // Clear reason
      }

      // ✅ Smoker
      if (name === "smoker" && !checked) {
        updatedData.sticks_per_day = "";
        updatedData.years_smoking = "";
      }

      // ✅ Eye Disorder
      if (name === "eye_disorder_no" && checked) {
        updatedData.eye_glasses = false;
        updatedData.contact_lens = false;
      }

      return updatedData;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-4">
      {/* Medical History Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4">Medical History</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Chief Complaint */}
        <div className="flex flex-col">
          <label className="font-medium text-green-700">Chief Complaint:</label>
          <input
            type="text"
            name="chief_complaint"
            value={formData.chief_complaint || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Enter chief complaint"
          />
        </div>

        {/* Present Illness */}
        <div className="flex flex-col">
          <label className="font-medium text-green-700">Present Illness:</label>
          <input
            type="text"
            name="present_illness"
            value={formData.present_illness || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Describe present illness"
          />
        </div>

        {/* Medication */}
        <div className="flex flex-col">
          <label className="font-medium text-green-700">Medication:</label>
          <input
            type="text"
            name="medication"
            value={formData.medication || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="List current medications"
          />
        </div>
      </div>

      {/* Line Separator */}
      <hr className="border-t border-gray-300 my-6" />

      {/* Hospitalization & Surgery History */}
      <h3 className="text-xl font-semibold text-green-700 mt-6 mb-4">Hospitalization & Surgery History</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hospitalization */}
        <div>
          <label className="font-medium text-green-700">Have you ever been hospitalized?</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="hospitalized"
                checked={formData.hospitalized || false}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" // 💚 Checkbox Green
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="hospitalizedNo"
                checked={!formData.hospitalized}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" // 💚 Checkbox Green
              />
              <span>No</span>
            </label>
          </div>

          {formData.hospitalized && (
            <div className="mt-2">
              <label className="font-medium text-green-700">Reason:</label>
              <input
                type="text"
                name="hospitalized_reason"
                value={formData.hospitalized_reason || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
                placeholder="Enter reason"
              />
            </div>
          )}
        </div>

        {/* Previous Surgeries */}
        <div>
          <label className="font-medium text-green-700">Previous Surgeries?</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="previous_surgeries"
                checked={formData.previous_surgeries || false}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" // 💚 Checkbox Green
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="surgeryNo"
                checked={!formData.previous_surgeries}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" // 💚 Checkbox Green
              />
              <span>No</span>
            </label>
          </div>

          {formData.previous_surgeries && (
            <div className="mt-2">
              <label className="font-medium text-green-700">Reason:</label>
              <input
                type="text"
                name="surgery_reason"
                value={formData.surgery_reason || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
                placeholder="Enter reason"
              />
            </div>
          )}
        </div>
      </div>

      {/* Line Separator */}
      <hr className="border-t border-gray-300 my-6" />

      {/* Personal and Social History Section */}
      <h3 className="text-xl font-semibold text-green-700 mt-6 mb-4">Personal & Social History</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Smoker Checkbox */}
        <div>
          <label className="font-medium text-green-700">Smoker:</label>
          <div className="flex space-x-4">
            {/* ✅ Smoker Yes */}
            <label className="flex items-center space-x-2">
              <input
                type="radio" // 🔥 Changed to Radio
                name="smoker"
                value="1"
                checked={formData.smoker === true}
                onChange={() =>
                  setFormData({
                    ...formData,
                    smoker: true,
                    sticks_per_day: "",
                    years_smoking: "",
                  })
                }
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <span>Yes</span>
            </label>

            {/* ❌ Smoker No */}
            <label className="flex items-center space-x-2">
              <input
                type="radio" // 🔥 Changed to Radio
                name="smoker"
                value="0"
                checked={formData.smoker === false}
                onChange={() =>
                  setFormData({
                    ...formData,
                    smoker: false,
                    sticks_per_day: "",
                    years_smoking: "",
                  })
                }
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <span>No</span>
            </label>
          </div>

          {/* ✅ Sticks per Day & Years Smoking (Only for YES) */}
          {formData.smoker && (
            <div className="mt-2">
              <label className="font-medium text-green-700">Sticks per Day:</label>
              <input
                type="number"
                name="sticks_per_day"
                value={formData.sticks_per_day || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-green-500"
                placeholder="Enter sticks per day"
              />
              <label className="font-medium text-green-700 mt-2">Years of Smoking:</label>
              <input
                type="number"
                name="years_smoking"
                value={formData.years_smoking || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-green-500"
                placeholder="Enter years smoking"
              />
            </div>
          )}
        </div>

        {/* Alcohol Drinker */}
        <div>
          <label className="font-medium text-green-700">Alcohol Drinker:</label>
          <div className="flex space-x-4">
            {["Regular", "Occasional", "No"].map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio" // ✅ Change checkbox to radio for single selection
                  name="alcoholic_drinker"
                  value={option}
                  checked={formData.alcoholic_drinker === option}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span>{option}</span> {/* ✅ This will now display the correct text */}
              </label>
            ))}
          </div>
        </div>

        {/* Use of Illicit Drugs */}
        <div>
          <label className="font-medium text-green-700">Use of Illicit Drugs:</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="illicit_drugs"
                value="1"
                checked={formData.illicit_drugs === true}
                onChange={() => setFormData({ ...formData, illicit_drugs: true })}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="illicit_drugs"
                value="0"
                checked={formData.illicit_drugs === false}
                onChange={() => setFormData({ ...formData, illicit_drugs: false })}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Eye Disorder */}
        <div>
          <label className="font-medium text-green-700">Eye Disorder:</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="eye_glasses"
                checked={formData.eye_glasses || false}
                onChange={handleCheckboxChange}
                disabled={formData.eye_disorder_no}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <span>Eye Glasses</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="contact_lens"
                checked={formData.contact_lens || false}
                onChange={handleCheckboxChange}
                disabled={formData.eye_disorder_no}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <span>Contact Lens</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="eye_disorder_no"
                checked={formData.eye_disorder_no || false}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Step4;
