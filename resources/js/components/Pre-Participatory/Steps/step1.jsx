import { useState, useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const medicalHistoryOptions = [
  "Allergy",
  "Bleeding Disorder",
  "Bronchial Asthma",
  "Cardiovascular Disease",
  "Hypertension",
  "PTB",
  "Skin Disorder",
  "Surgery",
  "UTI",
  "Loss of Consciousness",
  "Others",
];

const Step1 = ({ formData, setFormData }) => {
  const [bpWarning, setBpWarning] = useState("");
  const [bpSeverity, setBpSeverity] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);

  // BMI Calculation
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return "";
    const heightInMeters = height / 100; // Convert cm to meters
    return (weight / (heightInMeters * heightInMeters)).toFixed(1); // BMI formula
  };

  // Update BMI whenever weight or height changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      bmi: calculateBMI(prev.weight, prev.height),
    }));
  }, [formData.weight, formData.height]);

  // Blood Pressure Warning
  const checkBpWarning = (value) => {
    if (!value) {
      setBpWarning("");
      setBpSeverity("");
      return;
    }

    const [systolic, diastolic] = value.split("/").map(Number);
    if (systolic >= 180 || diastolic >= 120) {
      setBpWarning("🚨 Hypertensive Crisis: Seek emergency care!");
      setBpSeverity("text-red-600 border-red-500");
    } else if (systolic >= 140 || diastolic >= 90) {
      setBpWarning("⚠️ Stage 2 Hypertension: Monitor closely.");
      setBpSeverity("text-orange-500 border-orange-500");
    } else if (systolic >= 130 || diastolic >= 80) {
      setBpWarning("⚠️ Stage 1 Hypertension: Lifestyle changes recommended.");
      setBpSeverity("text-yellow-500 border-yellow-500");
    } else if (systolic < 90 || diastolic < 60) {
      setBpWarning("⚠️ Low Blood Pressure: Consider medical advice.");
      setBpSeverity("text-yellow-500 border-yellow-500");
    } else {
      setBpWarning("");
      setBpSeverity("");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBpChange = (e) => {
    setFormData({ ...formData, blood_pressure: e.target.value });
    checkBpWarning(e.target.value);
  };

  const handleMedicalHistoryChange = (option) => {
    const updatedHistory = formData.medicalHistory.includes(option)
      ? formData.medicalHistory.filter((item) => item !== option)
      : [...formData.medicalHistory, option];

    setFormData({ ...formData, medicalHistory: updatedHistory });

    if (option === "Others") {
      setShowOtherInput(!showOtherInput);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-xl font-semibold text-green-800">Step 1: Patient Vitals & Medical History</h3>

      {/* Patient Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[ 
          { key: "weight", label: "Weight (kg)" },
          { key: "height", label: "Height (cm)" },
          { key: "blood_pressure", label: "Blood Pressure (BP)", bp: true },
          { key: "cardiac_rate", label: "Cardiac Rate (CR)" },
          { key: "respiratory_rate", label: "Respiratory Rate (RR)" },
          { key: "temperature", label: "Temperature (°C)" },
          { key: "oxygen_saturation", label: "O₂ Saturation (%)" },
        ].map(({ key, label, bp }) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              name={key}
              value={formData[key] || ""}
              onChange={bp ? handleBpChange : handleChange}
              className={`border p-2 rounded w-full focus:ring-green-500 ${bp ? bpSeverity : ""}`}
              placeholder={label}
            />
          </div>
        ))}

        {/* BMI Field (Auto-calculated) */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">BMI (Auto-calculated)</label>
          <input
            type="text"
            name="bmi"
            value={formData.bmi || ""}
            readOnly
            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      {/* BP Warning */}
      {bpWarning && (
        <div className={`border-l-4 p-2 ${bpSeverity}`}>
          <ExclamationTriangleIcon className="w-5 h-5 inline-block mr-2" />
          {bpWarning}
        </div>
      )}

      {/* Medical History */}
      <div>
        <label className="font-semibold text-green-800">Past Medical History:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {medicalHistoryOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.medicalHistory.includes(option)}
                onChange={() => handleMedicalHistoryChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Other Medical History Input */}
      {showOtherInput && (
        <input
          type="text"
          className="mt-2 p-2 border border-gray-300 rounded w-full"
          placeholder="Specify other medical history..."
          value={formData.otherMedicalHistory}
          onChange={(e) => setFormData({ ...formData, otherMedicalHistory: e.target.value })}
        />
      )}
    </div>
  );
};

export default Step1;
