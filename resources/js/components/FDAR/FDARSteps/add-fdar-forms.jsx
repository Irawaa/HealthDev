import { useState, useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // ✅ Warning icon
import FDARTags from "@/components/FDAR/fdar-tags";

const AddFDARForm = ({ formData, handleChange }) => {
  const [bpWarning, setBpWarning] = useState("");
  const [bpSeverity, setBpSeverity] = useState("");
  const [isBpFocused, setIsBpFocused] = useState(false);

  const [selectedTagIds, setSelectedTagIds] = useState(formData.common_disease_ids || []);
  const [customTags, setCustomTags] = useState(formData.custom_diseases || []);

  useEffect(() => {
    handleChange({
      target: {
        name: "common_disease_ids",
        value: selectedTagIds,
      },
    });
    handleChange({
      target: {
        name: "custom_diseases",
        value: customTags,
      },
    });
  }, [selectedTagIds, customTags]);

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

  const handleBpChange = (e) => {
    handleChange(e);
    checkBpWarning(e.target.value);
  };

  const fields = [
    { key: "weight", label: "Weight", type: "input", required: true },
    { key: "height", label: "Height", type: "input", required: true },
    { key: "blood_pressure", label: "Blood Pressure (BP)", type: "input", bp: true, required: true },
    { key: "cardiac_rate", label: "CR", type: "input", required: true },
    { key: "respiratory_rate", label: "RR", type: "input", required: true },
    { key: "temperature", label: "Temperature (T)", type: "input", required: true },
    { key: "oxygen_saturation", label: "O₂ Saturation", type: "input" },
    { key: "last_menstrual_period", label: "LMP", type: "date" },
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-green-800">FDAR & Patient Vitals</h3>

      <FDARTags
        selectedTagIds={selectedTagIds}
        setSelectedTagIds={setSelectedTagIds}
        customTags={customTags}
        setCustomTags={setCustomTags}
      />

      {/* ✅ FDAR Inputs */}
      <div className="grid grid-cols-1 gap-4">
        {["data", "action", "response"].map((key) => {
          const isRequired = ["data", "action", "response"].includes(key); // Mark all as required

          return (
            <div key={key} className="flex flex-col">
              <label className="text-xs font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                {isRequired && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 bg-white px-2 py-1 text-sm rounded focus:ring-1 focus:ring-green-500 transition-all resize-none"
                placeholder={`Enter ${key}`}
              />
            </div>
          );
        })}
      </div>

      {/* ✅ Patient Vitals (2-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, bp, required }) => (
          <div key={key} className="relative flex flex-col">
            <label className="text-xs font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={key === "last_menstrual_period" ? "date" : "text"}
              name={key}
              value={formData[key] || ""}
              onChange={bp ? handleBpChange : handleChange}
              onFocus={bp ? () => setIsBpFocused(true) : undefined}
              onBlur={bp ? () => setIsBpFocused(false) : undefined}
              className={`border p-2 w-full rounded focus:ring-green-500 focus:border-green-500 ${bp ? bpSeverity : ""
                }`}
              placeholder={label}
            />

            {/* ✅ BP Warning & Icon */}
            {bp && bpWarning && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ExclamationTriangleIcon className={`w-5 h-5 ${bpSeverity}`} />
              </div>
            )}
            {bp && bpWarning && isBpFocused && (
              <div
                className={`absolute top-full left-0 mt-1 p-2 rounded shadow-lg text-xs ${bpSeverity.includes("red") ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                  }`}
              >
                {bpWarning}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFDARForm;
