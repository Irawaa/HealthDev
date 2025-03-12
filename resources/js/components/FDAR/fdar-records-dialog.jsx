import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast"; // ✅ Import toast
import FDARForm from "./FDARSteps/fdar-forms";

const FDARModal = ({ patient }) => {
  const [open, setOpen] = useState(false);
  const [fdarForms, setFdarForms] = useState([]);
  const [expandedForms, setExpandedForms] = useState({});

  // ✅ Initialize Inertia form
  const { data, setData, post, processing, reset, errors } = useForm({
    patient_id: patient?.patient_id || null,
    school_nurse_id: "",
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
  });

  useEffect(() => {
    if (patient?.fdar_forms) {
      setFdarForms(patient.fdar_forms);
    }
  }, [patient]);

  const toggleForm = (id) => {
    setExpandedForms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  // ✅ Capitalize First Letter of Error Messages
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
  };

  // ✅ Frontend Validation
  const validateForm = () => {
    let isValid = true;

    // 🔥 Required Fields
    const requiredFields = ["data", "action", "response", "blood_pressure", "cardiac_rate", "respiratory_rate", "temperature"];
    requiredFields.forEach((field) => {
      if (!data[field]?.trim()) {
        toast.error(`❌ ${capitalizeFirstLetter(field)} is required`);
        isValid = false;
      }
    });

    // 🔥 Numeric Fields Validation
    const numericFields = ["weight", "height", "temperature", "oxygen_saturation"];
    numericFields.forEach((field) => {
      if (data[field] && isNaN(Number(data[field]))) {
        toast.error(`❌ ${capitalizeFirstLetter(field)} must be a valid number`);
        isValid = false;
      }
    });

    // 🔥 Dropdown / Array Validation
    if (!data.common_disease_ids.length) {
      toast.error("❌ Please select at least one Common Disease");
      isValid = false;
    }

    return isValid;
  };

  // ✅ Handle form submission using Inertia.js
  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 Validate before submission
    if (!validateForm()) return;

    post(route("fdar-forms.store"), {
      onSuccess: () => {
        toast.success("✅ FDAR Record Saved Successfully!");
        setOpen(false);
        reset();
      },
      onError: (errors) => {
        console.error("Validation Errors:", errors);

        // 🔥 Show general error message if available
        if (typeof errors.error === "string") {
          toast.error(`❌ ${capitalizeFirstLetter(errors.error)}`);
        }

        // 🔥 Loop through all validation errors safely
        Object.entries(errors).forEach(([key, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(`❌ ${capitalizeFirstLetter(message)}`));
          } else if (typeof messages === "string") {
            toast.error(`❌ ${capitalizeFirstLetter(messages)}`);
          }
        });
      },
    });
  };

  // ✅ Open modal for creating a new FDAR record
  const openCreateModal = () => {
    reset(); // Clear form
    setOpen(true);
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h2 className="text-xl font-semibold text-green-800">FDAR Records</h2>

      {/* ✅ Button to Open Create Form */}
      <Button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
        onClick={openCreateModal}
      >
        Create New FDAR Record
      </Button>

      <div className="mt-4 space-y-3">
        {fdarForms.length > 0 ? (
          fdarForms.map((form) => (
            <div key={form.id} className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 transition hover:shadow-lg">
              {/* ✅ FDAR Form Header */}
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleForm(form.id)}>
                <p className="font-medium text-gray-800">
                  <span className="font-semibold">Recorded:</span>{" "}
                  {new Date(form.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                  <span className="font-semibold"> || Action:</span> {form.action}
                </p>
                <Button
                  className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-md shadow hover:bg-gray-200 transition"
                  onClick={(e) => { e.stopPropagation(); toggleForm(form.id); }}
                >
                  {expandedForms[form.id] ? "Collapse" : "Expand"}
                  {expandedForms[form.id] ? "🔼" : "🔽"}
                </Button>
              </div>

              {/* ✅ Collapsible FDAR Details */}
              {expandedForms[form.id] && (
                <div className="mt-3 space-y-2 bg-gray-50 border border-gray-300 p-4 rounded-md shadow-sm">

                  {/* ✅ Common Diseases */}
                  {form.common_diseases?.length > 0 && (
                    <div className="text-gray-700">
                      <span className="font-semibold">Focus:</span>
                      <ul className="flex flex-wrap gap-2 mt-1">
                        {form.common_diseases.map((disease) => (
                          <li key={disease.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm shadow">
                            {disease.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-gray-700">
                    <p><span className="font-semibold">Response:</span> {form.response}</p>
                    <p><span className="font-semibold">BP:</span> {form.blood_pressure}</p>
                    <p><span className="font-semibold">Weight:</span> {form.weight || "N/A"} kg</p>
                    <p><span className="font-semibold">Height:</span> {form.height || "N/A"} m</p>
                    <p><span className="font-semibold">Temperature:</span> {form.temperature || "N/A"}°C</p>
                    <p><span className="font-semibold">Oxygen Saturation:</span> {form.oxygen_saturation || "N/A"}%</p>
                  </div>

                  {/* ✅ Actions */}
                  <div className="flex justify-end space-x-2">
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-green-700 text-center">No FDAR records found.</p>
        )}
      </div>


      {/* ✅ FDAR Form Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white shadow-xl rounded-lg p-8 max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-green-100 px-6 py-4 flex justify-between items-center border-b shadow-md sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-green-700">New FDAR Record</h2>
          </div>

          {/* ✅ Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-transparent select-none">‎</DialogTitle>
            </DialogHeader>

            {/* ✅ Render Single Combined Form */}
            <FDARForm formData={data} handleChange={handleChange} />
          </div>

          {/* ✅ Footer Controls */}
          <DialogFooter className="bg-white px-8 py-6 border-t shadow-md flex justify-between">
            <Button onClick={() => setOpen(false)} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={processing}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
            >
              {processing ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FDARModal;
