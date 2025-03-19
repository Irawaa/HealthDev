import { useEffect, useState } from "react";
import { usePhysicianStaff } from "@/Pages/Patients/ProfilePage"; // Import context

const Step6 = ({ formData, setFormData }) => {
  const physicianStaff = usePhysicianStaff();
  const [imageUrl, setImageUrl] = useState(null);

  const labTests = [
    { name: "blood_chemistry", label: "Blood Chemistry" },
    { name: "fbs", label: "FBS" },
    { name: "uric_acid", label: "Uric Acid" },
    { name: "triglycerides", label: "Triglycerides" },
    { name: "t_cholesterol", label: "T. Cholesterol" },
    { name: "creatinine", label: "Creatinine" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, chest_xray: file }));
    }
  };

  useEffect(() => {
    if (formData.medical_record) {
      setImageUrl(`/medical-records/${formData.medical_record}/image?timestamp=${new Date().getTime()}`);
    } else if (formData.chest_xray && typeof formData.chest_xray === "string") {
      setImageUrl(`${formData.chest_xray}?timestamp=${new Date().getTime()}`); // Avoid caching
    } else if (formData.chest_xray instanceof File) {
      const objectUrl = URL.createObjectURL(formData.chest_xray);
      setImageUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setImageUrl(null);
    }
  }, [formData.medical_record, formData.chest_xray]);

  return (
    <div className="form-container p-4 space-y-5">
      <style>
        {`
          /* Remove blur from the form container */
          .form-container {
            filter: none !important;
          }

          /* Ensure no inherited blur from parent elements */
          .form-container,
          .form-container * {
            filter: none !important;
          }
        `}
      </style>

      {/* Chest X-Ray Upload Section */}
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Chest X-Ray</h3>
        <div className="flex flex-col space-y-3">
          <input
            type="file"
            name="chest_xray"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="border border-gray-400 rounded p-2 w-full file:bg-green-100 file:border file:border-gray-400 file:rounded file:px-3 file:py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-describedby="xray-helper"
          />
          <small id="xray-helper" className="text-sm text-gray-600">
            Upload your chest X-ray image or PDF.
          </small>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="X-Ray Preview"
              className="w-28 h-28 object-contain rounded mt-2"
            />
          )}
        </div>
      </div>

      {/* Laboratory Tests Section */}
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Laboratory Tests</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {labTests.map(({ name, label }) => (
            <div key={name} className="flex flex-col space-y-2">
              <label htmlFor={name} className="text-sm font-medium text-gray-800">
                {label}:
              </label>
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name] || ""}
                onChange={handleInputChange}
                className="border border-gray-400 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={`Enter ${label} result`}
                aria-labelledby={`${name}-label`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-gray-400 my-4"></div>

      {/* Vaccination Status Section */}
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Vaccination Status</h3>
        <input
          type="text"
          name="vaccination_status"
          value={formData.vaccination_status || ""}
          onChange={handleInputChange}
          className="border border-gray-400 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter vaccination details"
        />
      </div>

      {/* Final Evaluation Section */}
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Final Evaluation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Class A", "Class B", "Pending"].map((option) => (
            <label key={option} className="flex items-center space-x-3">
              <input
                type="radio"
                name="final_evaluation"
                value={option}
                checked={formData.final_evaluation === option}
                onChange={handleInputChange}
                className="w-5 h-5 text-green-600 border-gray-400 rounded"
                aria-labelledby="final-evaluation"
              />
              <span className="text-sm text-gray-800">
                {option}{" "}
                {option === "Class A"
                  ? "(Physically Fit)"
                  : option === "Class B"
                    ? "(Physically Fit with Minor Illness)"
                    : "(Needs Clearance)"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Plan/Recommendation Section */}
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Plan/Recommendation</h3>
        <textarea
          name="plan_recommendation"
          value={formData.plan_recommendation || ""}
          onChange={handleInputChange}
          className="border border-gray-400 rounded p-2 w-full h-20 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter plan or recommendation"
        ></textarea>
      </div>

      {/* School Physician Selection Section */}
      <div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">School Physician</h3>
        <select
          name="school_physician_id"
          value={formData.school_physician_id || ""}
          onChange={handleInputChange}
          className="border border-gray-400 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          aria-labelledby="physician-selection"
        >
          <option value="">Select Physician</option>
          {physicianStaff && physicianStaff.length > 0 ? (
            physicianStaff.map((physician) => (
              <option key={physician.staff_id} value={physician.staff_id}>
                {physician.lname}, {physician.fname} {physician.mname || ""} (Lic: {physician.license_no})
              </option>
            ))
          ) : (
            <option disabled>No physicians available</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default Step6;