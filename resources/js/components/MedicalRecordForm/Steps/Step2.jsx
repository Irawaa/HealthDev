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
  {
    name: "temperature",
    label: "Temperature (°C):",
    placeholder: "Body Temperature",
  },
  { name: "weight", label: "Weight (kg):", placeholder: "Enter weight" },
  { name: "height", label: "Height (m):", placeholder: "Enter height" },
];

const Step2 = ({ formData, setFormData }) => {
  const [bpWarning, setBpWarning] = useState("");
  const [bpSeverity, setBpSeverity] = useState("");
  const [isBpFocused, setIsBpFocused] = useState(false);

  // Automatically Calculate BMI on Height or Weight Change
  useEffect(() => {
    const { height, weight } = formData;

    if (height && weight) {
      const h = parseFloat(height);
      const w = parseFloat(weight);

      if (h > 0 && w > 0) {
        const bmi = (w / (h * h)).toFixed(2);
        setFormData((prev) => ({ ...prev, bmi }));
      }
    } else {
      setFormData((prev) => ({ ...prev, bmi: "" }));
    }
  }, [formData.height, formData.weight, setFormData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      deformity: prev.deformities.length > 0,
    }));
  }, [formData.deformities, setFormData]);

  const handleCheckboxChange = ({ target: { name, checked } }) => {
    setFormData((prev) => {
      if (name === "deformity") {
        return {
          ...prev,
          deformity: checked,
          deformities: checked ? prev.deformities : [], // Reset deformities if unchecked
        };
      }

      if (name === "None") {
        return {
          ...prev,
          deformities: checked ? ["None"] : [],
          deformity: checked,
        };
      }

      // Handle individual deformities
      const updatedDeformities = checked
        ? [...prev.deformities.filter((d) => d !== "None"), name] // Add deformity
        : prev.deformities.filter((d) => d !== name); // Remove deformity

      return {
        ...prev,
        deformities: updatedDeformities,
        deformity: updatedDeformities.length > 0, // Keep "Deformities" checked if any is selected
      };
    });
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });

    if (name === "bp") checkBpWarning(value);

    // Set validation error if empty
    setFormData((prev) => ({
      ...prev,
      [`${name}Error`]:
        value.trim() === "" ? "This field should not be empty." : "",
    }));
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
          <label
            key={name}
            className={`flex items-center space-x-2 ${
              !formData.deformity ? "opacity-50" : ""
            }`}
          >
            <input
              type="checkbox"
              name={name}
              checked={formData.deformities.includes(name)}
              onChange={handleCheckboxChange}
              disabled={!formData.deformity}
              className="w-5 h-5 text-green-600 rounded border-green-500"
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
          <label className="font-medium text-green-700">
            BP (mmHg): <span className="text-red-500">*</span>
          </label>
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
              required
            />
            {bpSeverity && (
              <ExclamationTriangleIcon
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${bpSeverity}`}
              />
            )}
          </div>
          {bpWarning && isBpFocused && (
            <div
              className={`absolute top-full left-0 mt-1 p-2 rounded shadow-lg text-xs ${
                bpSeverity.includes("red")
                  ? "bg-red-100 text-red-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {bpWarning}
            </div>
          )}
          {!formData.bp && (
            <p className="text-red-500 text-sm">
              This field should not be empty.
            </p>
          )}
        </div>

        {/* Other Vital Signs */}
        {vitalSigns.map(({ name, label, placeholder }) => (
          <div key={name} className="flex flex-col">
            <label className="font-medium text-green-700">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder={placeholder}
              required
            />
            {!formData[name] && (
              <p className="text-red-500 text-sm">
                This field should not be empty.
              </p>
            )}
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
          />
        </div>
      </div>
    </div>
  );
};

export default Step2;
