import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast"; // React Hot Toast
import { ScrollArea } from "@/components/ui/scroll-area";
import FDARTags from "@/components/FDAR/fdar-tags";

const EditFDARModal = ({ isOpen, onClose, formData }) => {
  const [bpWarning, setBpWarning] = useState("");
  const [bpSeverity, setBpSeverity] = useState("");
  const [formErrors, setFormErrors] = useState({}); // Added form errors state

  const { data, setData, put, processing, errors } = useForm({
    id: "",
    data: "",
    action: "",
    response: "",
    weight: "",
    height: "",
    blood_pressure: "",
    cardiac_rate: "",
    respiratory_rate: "",
    temperature: "",
    oxygen_saturation: "",
    last_menstrual_period: "",
    common_disease_ids: [],
    custom_diseases: [],
  });

  useEffect(() => {
    if (formData) {
      setData({
        id: formData.id || "",
        data: formData.data || "",
        action: formData.action || "",
        response: formData.response || "",
        weight: formData.weight || "",
        height: formData.height || "",
        blood_pressure: formData.blood_pressure || "",
        cardiac_rate: formData.cardiac_rate || "",
        respiratory_rate: formData.respiratory_rate || "",
        temperature: formData.temperature || "",
        oxygen_saturation: formData.oxygen_saturation || "",
        last_menstrual_period: formData.last_menstrual_period || "",
        common_disease_ids: formData.common_disease_ids || [],
        custom_diseases: formData.custom_diseases || [],
      });
    }
  }, [formData]);

  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = "This field is required.";
    } else if (name === "blood_pressure" && !/^\d+\/\d+$/.test(value)) {
      error = "Blood pressure must be in format '120/80'.";
    } else if (name === "temperature" && (isNaN(value) || value < 30 || value > 45)) {
      error = "Temperature must be between 30-45°C.";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);

    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

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

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(data).forEach((key) => {
      const error = validateField(key, data[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      toast.error("Please fix the validation errors.");
      return;
    }

    put(`/fdar-forms/${data.id}`, {
      onSuccess: () => {
        toast.success("FDAR Record updated successfully!");
        onClose(); // Close modal on success
      },
      onError: () => {
        toast.error("Failed to update FDAR Record. Please try again.");
      },
    });
  };

  if (!isOpen) return null;

  const fields = [
    { key: "weight", label: "Weight", required: true },
    { key: "height", label: "Height", required: true },
    { key: "blood_pressure", label: "Blood Pressure (BP)", bp: true, required: true },
    { key: "cardiac_rate", label: "CR", required: true },
    { key: "respiratory_rate", label: "RR", required: true },
    { key: "temperature", label: "Temperature (T)", required: true },
    { key: "oxygen_saturation", label: "O₂ Saturation" },
    { key: "last_menstrual_period", label: "LMP", type: "date" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full"
      >
        <div className="bg-green-100 px-6 py-4 flex justify-between items-center border-b shadow-md sticky top-0 z-10 mb-7">
          <h2 className="text-lg font-semibold text-green-700">Edit FDAR Record</h2>
        </div>

        {/* Scrollable Input Container */}
        <ScrollArea className="max-h-[60vh] overflow-y-auto px-1">
          <FDARTags
            selectedTagIds={data.common_disease_ids}
            setSelectedTagIds={(ids) => setData("common_disease_ids", ids)}
            customTags={data.custom_diseases}
            setCustomTags={(tags) => setData("custom_diseases", tags)}
          />

          {/* FDAR Inputs */}
          <div className="grid grid-cols-1 gap-4 mt-7">
            {["data", "action", "response"].map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-xs font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)} <span className="text-red-500">*</span></label>
                <textarea
                  name={key}
                  value={data[key] || ""}
                  onChange={handleChange}
                  rows={3}
                  className="border border-gray-300 bg-white px-2 py-1 text-sm rounded focus:ring-1 focus:ring-green-500 resize-none"
                  placeholder={`Enter ${key}`}
                />
                {formErrors[key] && <p className="text-red-500 text-xs">{formErrors[key]}</p>}
              </div>
            ))}
          </div>

          {/* Patient Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {fields.map(({ key, label, bp, required, type }) => (
              <div key={key} className="relative flex flex-col">
                <label className="text-xs font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
                <input
                  type={type || "text"}
                  name={key}
                  value={data[key] || ""}
                  onChange={(e) => {
                    handleChange(e);
                    if (bp) checkBpWarning(e.target.value);
                  }}
                  className={`border p-2 w-full rounded focus:ring-green-500 focus:border-green-500 ${bp ? bpSeverity : ""}`}
                  placeholder={label}
                />
                {formErrors[key] && <p className="text-red-500 text-xs">{formErrors[key]}</p>}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={handleSubmit}
            disabled={processing}
          >
            {processing ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditFDARModal;
