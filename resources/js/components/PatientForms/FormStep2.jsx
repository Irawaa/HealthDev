// components/PatientForm/FormStep2.jsx
import { useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"; // Install heroicons if needed

const FormStep2 = ({ formData, setFormData, isEditing }) => {
  const [bpWarning, setBpWarning] = useState("");
  const [bpSeverity, setBpSeverity] = useState(""); // Controls icon color
  const [isBpFocused, setIsBpFocused] = useState(false);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "deformity") {
      setFormData({
        ...formData,
        deformity: checked,
        cleftLip: false,
        exotropia: false,
        poliomyelitis: false,
        scoliosis: false,
        strabismus: false,
      });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "bp") {
      checkBpWarning(value);
    }
  };

  const handleBpFocus = () => setIsBpFocused(true);
  const handleBpBlur = () => setIsBpFocused(false);

  // Function to check BP and set medical warnings + icon severity
  const checkBpWarning = (bpValue) => {
    const [systolic, diastolic] = bpValue.split("/").map(Number);

    if (!isNaN(systolic) && !isNaN(diastolic)) {
      if (systolic >= 180 || diastolic >= 120) {
        setBpWarning("🚨 Hypertensive Crisis (≥180/120): Seek emergency care!");
        setBpSeverity("text-red-600"); // 🔴 Red alert
      } else if (systolic >= 140 || diastolic >= 90) {
        setBpWarning("⚠️ Stage 2 Hypertension (≥140/90): Monitor closely.");
        setBpSeverity("text-orange-500"); // 🟠 Orange alert
      } else if (systolic >= 130 || diastolic >= 80) {
        setBpWarning("⚠️ Stage 1 Hypertension (130–139/80–89): Lifestyle changes recommended.");
        setBpSeverity("text-yellow-500"); // 🟡 Yellow alert
      } else if (systolic < 90 || diastolic < 60) {
        setBpWarning("⚠️ Low Blood Pressure (<90/60): Consider medical advice.");
        setBpSeverity("text-yellow-500"); // 🟡 Yellow alert
      } else {
        setBpWarning("");
        setBpSeverity("");
      }
    } else {
      setBpWarning("");
      setBpSeverity("");
    }
  };

  return (
    <div className="p-4">
      {/* Deformities Section (Restored) */}
      <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          name="deformity"
          checked={formData.deformity || false}
          onChange={handleCheckboxChange}
          disabled={!isEditing}
          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <span>Deformities</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {[
          { name: "cleftLip", label: "Cleft Lip" },
          { name: "exotropia", label: "Exotropia" },
          { name: "poliomyelitis", label: "Poliomyelitis" },
          { name: "scoliosis", label: "Scoliosis" },
          { name: "strabismus", label: "Strabismus" },
        ].map(({ name, label }) => (
          <label key={name} className={`flex items-center space-x-2 ${!formData.deformity ? "opacity-50" : ""}`}>
            <input
              type="checkbox"
              name={name}
              checked={formData[name] || false}
              onChange={handleCheckboxChange}
              disabled={!formData.deformity || !isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {/* Vital Signs Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4">Vital Signs</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* BP Input with High BP Warning Only */}
        <div className="flex flex-col relative">
          <label className="font-medium text-green-700">BP (mmHg):</label>
          <div className="relative w-full">
            <input
              type="text"
              name="bp"
              value={formData.bp || ""}
              onChange={handleInputChange}
              onFocus={handleBpFocus}
              onBlur={handleBpBlur}
              disabled={!isEditing}
              className={`border rounded p-2 w-full pr-10 focus:ring-green-500 focus:border-green-500 
          ${bpSeverity === "text-red-600" || bpSeverity === "text-orange-500" ? "border-red-500" : "border-gray-300"}`}
              placeholder="120/80"
            />
            {(bpSeverity === "text-red-600" || bpSeverity === "text-orange-500") && (
              <ExclamationTriangleIcon
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${bpSeverity}`}
              />
            )}
          </div>

          {(bpSeverity === "text-red-600" || bpSeverity === "text-orange-500") && isBpFocused && (
            <div className={`absolute top-full left-0 mt-1 p-2 rounded shadow-lg w-max text-xs transition-opacity duration-200 
        ${bpSeverity === "text-red-600" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}
            >
              {bpWarning}
            </div>
          )}
        </div>

        {/* Other Vital Signs */}
        {[
          { name: "rr", label: "RR (cpm):", placeholder: "Respiratory Rate" },
          { name: "hr", label: "HR (bpm):", placeholder: "Heart Rate" },
          { name: "temperature", label: "Temperature (°C):", placeholder: "Body Temperature" },
          { name: "weight", label: "Weight (kg):", placeholder: "Enter weight" },
          { name: "height", label: "Height (m):", placeholder: "Enter height" },
        ].map(({ name, label, placeholder }) => (
          <div key={name} className="flex flex-col">
            <label className="font-medium text-green-700">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder={placeholder}
            />
          </div>
        ))}

        {/* Auto-calculated BMI */}
        <div className="flex flex-col">
          <label className="font-medium text-green-700">BMI:</label>
          <input
            type="text"
            name="bmi"
            value={formData.bmi || ""}
            disabled
            className="border border-gray-300 bg-gray-100 rounded p-2 w-full cursor-not-allowed"
            placeholder="Auto-calculated"
          />
        </div>
      </div>
    </div >
  );
};

export default FormStep2;
