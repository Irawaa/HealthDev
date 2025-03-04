import { useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const deformityOptions = [
  { name: "Cleft Lip (Bingot)", label: "Cleft Lip" },
  { name: "Exotropia (walleyed / banlag)", label: "Exotropia" },
  { name: "Poliomyelitis", label: "Poliomyelitis" },
  { name: "Scoliosis", label: "Scoliosis" },
  { name: "Strabismus (cross-eyed / duling)", label: "Strabismus" },
  { name: "None", label: "None" }, // Added "None" as per your table content
];

const vitalSigns = [
  { name: "rr", label: "RR (cpm):", placeholder: "Respiratory Rate" },
  { name: "hr", label: "HR (bpm):", placeholder: "Heart Rate" },
  { name: "temperature", label: "Temperature (°C):", placeholder: "Body Temperature" },
  { name: "weight", label: "Weight (kg):", placeholder: "Enter weight" },
  { name: "height", label: "Height (m):", placeholder: "Enter height" },
];

const Step2 = ({ formData, setFormData }) => {
  const [bpWarning, setBpWarning] = useState("");
  const [bpSeverity, setBpSeverity] = useState("");
  const [isBpFocused, setIsBpFocused] = useState(false);

  const handleCheckboxChange = ({ target: { name, checked } }) => {
    if (name === "deformity") {
      setFormData((prev) => ({
        ...prev,
        deformity: checked,
        deformities: checked ? prev.deformities : [], // Reset if unchecked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        deformities: checked
          ? [...prev.deformities, name] // Add deformity
          : prev.deformities.filter((d) => d !== name), // Remove if unchecked
      }));
    }
  };  

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
    if (name === "bp") checkBpWarning(value);
  };

  const checkBpWarning = (value) => {
    const [systolic, diastolic] = value.split("/").map(Number);
    if (systolic >= 180 || diastolic >= 120) {
      setBpWarning("🚨 Hypertensive Crisis: Seek emergency care!");
      setBpSeverity("text-red-600");
    } else if (systolic >= 140 || diastolic >= 90) {
      setBpWarning("⚠️ Stage 2 Hypertension: Monitor closely.");
      setBpSeverity("text-orange-500");
    } else if (systolic >= 130 || diastolic >= 80) {
      setBpWarning("⚠️ Stage 1 Hypertension: Lifestyle changes recommended.");
      setBpSeverity("text-yellow-500");
    } else if (systolic < 90 || diastolic < 60) {
      setBpWarning("⚠️ Low Blood Pressure: Consider medical advice.");
      setBpSeverity("text-yellow-500");
    } else {
      setBpWarning("");
      setBpSeverity("");
    }
  };

  return (
    <div className="p-4">
      {/* Deformities Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          name="deformity"
          checked={formData.deformity || false}
          onChange={handleCheckboxChange}
          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <span>Deformities</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {deformityOptions.map(({ name, label }) => (
          <label key={name} className={`flex items-center space-x-2 ${!formData.deformity ? "opacity-50" : ""}`}>
            <input
              type="checkbox"
              name={name}
              checked={formData.deformities.includes(name)}
              onChange={handleCheckboxChange}
              disabled={!formData.deformity}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {/* Vital Signs Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4">Vital Signs</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* BP Input with Warning */}
        <div className="relative">
          <label className="font-medium text-green-700">BP (mmHg):</label>
          <div className="relative">
            <input
              type="text"
              name="bp"
              value={formData.bp || ""}
              onChange={handleInputChange}
              onFocus={() => setIsBpFocused(true)}
              onBlur={() => setIsBpFocused(false)}
              className={`border p-2 w-full rounded focus:ring-green-500 focus:border-green-500 ${bpSeverity}`}
              placeholder="120/80"
            />
            {bpSeverity && (
              <ExclamationTriangleIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${bpSeverity}`} />
            )}
          </div>
          {bpWarning && isBpFocused && (
            <div className={`absolute top-full left-0 mt-1 p-2 rounded shadow-lg text-xs ${bpSeverity.includes("red") ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}>
              {bpWarning}
            </div>
          )}
        </div>

        {/* Other Vital Signs */}
        {vitalSigns.map(({ name, label, placeholder }) => (
          <div key={name} className="flex flex-col">
            <label className="font-medium text-green-700">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder={placeholder}
            />
          </div>
        ))}

        {/* BMI (Auto-calculated) */}
        <div>
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
    </div>
  );
};

export default Step2;
