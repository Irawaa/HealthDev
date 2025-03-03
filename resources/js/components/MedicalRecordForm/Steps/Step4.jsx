// components/PatientForm/FormStep4.jsx
const Step4 = ({ formData, setFormData }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });

    // Ensure only one selection for Pregnancy, Hospitalization, and Surgeries
    if (name === "hospitalizedYes" && checked) {
      setFormData({ ...formData, hospitalizedYes: true, hospitalizedNo: false });
    }
    if (name === "hospitalizedNo" && checked) {
      setFormData({ ...formData, hospitalizedYes: false, hospitalizedNo: true, hospitalizationReason: "" });
    }
    if (name === "surgeryYes" && checked) {
      setFormData({ ...formData, surgeryYes: true, surgeryNo: false });
    }
    if (name === "surgeryNo" && checked) {
      setFormData({ ...formData, surgeryYes: false, surgeryNo: true, surgeryReason: "" });
    }
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
            name="chiefComplaint"
            value={formData.chiefComplaint || ""}
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
            name="presentIllness"
            value={formData.presentIllness || ""}
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
            {["hospitalizedYes", "hospitalizedNo"].map((name) => (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name] || false}
                  onChange={handleCheckboxChange}
                />
                <span>{name === "hospitalizedYes" ? "Yes" : "No"}</span>
              </label>
            ))}
          </div>

          {/* Reason for Hospitalization */}
          {formData.hospitalizedYes && (
            <div className="mt-2">
              <label className="font-medium text-green-700">If yes, reason for hospitalization:</label>
              <input
                type="text"
                name="hospitalizationReason"
                value={formData.hospitalizationReason || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Enter reason for hospitalization"
              />
            </div>
          )}
        </div>

        {/* Previous Surgeries */}
        <div>
          <label className="font-medium text-green-700">Previous Surgeries?</label>
          <div className="flex space-x-4">
            {["surgeryYes", "surgeryNo"].map((name) => (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name] || false}
                  onChange={handleCheckboxChange}
                />
                <span>{name === "surgeryYes" ? "Yes" : "No"}</span>
              </label>
            ))}
          </div>

          {/* Reason for Surgery */}
          {formData.surgeryYes && (
            <div className="mt-2">
              <label className="font-medium text-green-700">If yes, reason for surgery:</label>
              <input
                type="text"
                name="surgeryReason"
                value={formData.surgeryReason || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Enter reason for surgery"
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
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="smokerYes"
                checked={formData.smokerYes || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, smokerYes: true, smokerNo: false });
                  }
                }}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="smokerNo"
                checked={formData.smokerNo || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, smokerYes: false, smokerNo: true, sticksPerDay: "", yearsSmoking: "" });
                  }
                }}
              />
              <span>No</span>
            </label>
          </div>

          {/* Sticks per day & Years of Smoking Inputs */}
          {formData.smokerYes && (
            <div className="mt-2">
              <label className="font-medium text-green-700">Sticks per day:</label>
              <input
                type="text"
                name="sticksPerDay"
                value={formData.sticksPerDay || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Enter sticks per day"
              />

              <label className="font-medium text-green-700 mt-2">Years of Smoking:</label>
              <input
                type="text"
                name="yearsSmoking"
                value={formData.yearsSmoking || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Enter years of smoking"
              />
            </div>
          )}
        </div>

        {/* Alcohol Drinker */}
        <div>
          <label className="font-medium text-green-700">Alcohol Drinker:</label>
          <div className="flex space-x-4">
            {["alcoholRegular", "alcoholOccasional", "alcoholNo"].map((name, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name] || false}
                  onChange={(e) => {
                    setFormData({
                      alcoholRegular: false,
                      alcoholOccasional: false,
                      alcoholNo: false,
                      [name]: e.target.checked,
                    });
                  }}
                />
                <span>{name.replace("alcohol", "")}</span>
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
                type="checkbox"
                name="illicitDrugsYes"
                checked={formData.illicitDrugsYes || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, illicitDrugsYes: true, illicitDrugsNo: false });
                  }
                }}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="illicitDrugsNo"
                checked={formData.illicitDrugsNo || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, illicitDrugsYes: false, illicitDrugsNo: true });
                  }
                }}
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
                name="eyeDisorderYes"
                checked={formData.eyeDisorderYes || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, eyeDisorderYes: true, eyeDisorderNo: false });
                  }
                }}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="eyeDisorderNo"
                checked={formData.eyeDisorderNo || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      eyeDisorderYes: false,
                      eyeDisorderNo: true,
                      eyeGlasses: false,
                      contactLens: false,
                    });
                  }
                }}
              />
              <span>No</span>
            </label>
          </div>

          {/* Eye Glasses & Contact Lens Checkboxes */}
          {formData.eyeDisorderYes && (
            <div className="mt-2 flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="eyeGlasses"
                  checked={formData.eyeGlasses || false}
                  onChange={handleCheckboxChange}
                />
                <span>Eye Glasses</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="contactLens"
                  checked={formData.contactLens || false}
                  onChange={handleCheckboxChange}
                />
                <span>Contact Lens</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Step4;
