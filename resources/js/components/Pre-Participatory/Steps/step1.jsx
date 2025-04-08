import { useState, useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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

const Step1 = ({ formData, setFormData, errors }) => {
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
    setFormData({ ...formData, bp: e.target.value });
    checkBpWarning(e.target.value);
  };

  const handleMedicalHistoryChange = (option) => {
    const updatedHistory = formData.past_medical_histories.includes(option)
      ? formData.past_medical_histories.filter((item) => item !== option)
      : [...formData.past_medical_histories, option];

    setFormData({ ...formData, past_medical_histories: updatedHistory });

    // If "Others" is deselected, reset 'other_condition'
    if (option === "Others" && !updatedHistory.includes("Others")) {
      setFormData((prevData) => ({
        ...prevData,
        other_condition: "", // Reset the 'Other Condition' input if 'Others' is unchecked
      }));
    }

    // Toggle visibility of "Other Condition" input field based on "Others" checkbox
    if (option === "Others") {
      setShowOtherInput(!showOtherInput);
    }
  };

  useEffect(() => {
    if (formData.past_medical_histories.includes("Others")) {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
    }
  }, [formData.past_medical_histories]);

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-xl font-semibold text-green-800">Step 1: Patient Vitals & Medical History</h3>

      {/* Patient Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: "weight", label: "Weight (kg)" },
          { key: "height", label: "Height (cm)" },
          { key: "bp", label: "Blood Pressure (BP)", bp: true },
          { key: "hr", label: "Cardiac Rate (HR)" },
          { key: "rr", label: "Respiratory Rate (RR)" },
          { key: "temperature", label: "Temperature (°C)" },
        ].map(({ key, label, bp }) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              {label} <span className="text-red-500">*</span> {/* Red asterisk */}
            </label>
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
        <div className="grid grid-cols-2 gap-2">
          {medicalHistoryOptions.map((option) => (
            <label key={option.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="past_medical_histories"
                value={option.name}
                checked={formData.past_medical_histories.includes(option.name)}
                onChange={() => handleMedicalHistoryChange(option.name)}
                className="h-4 w-4 border-gray-300"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
        {showOtherInput && (
          <div className="mt-2">
            <label className="text-sm font-medium text-gray-700">Other Condition</label>
            <input
              type="text"
              name="other_condition"
              value={formData.other_condition || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Specify other condition"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1;
