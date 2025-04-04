import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { usePhysicianStaff } from "@/Pages/Patients/ProfilePage"; // Import context
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const AddIncidentForm = ({ open, setOpen, patient }) => {
  const [pageLoading, setPageLoading] = useState(false);
  const physicianStaff = usePhysicianStaff(); // Get physicians from context
  const { data, setData, post, processing, errors, reset } = useForm({
    patient_id: patient?.patient_id || "",
    history: "",
    nature_of_incident: "",
    place_of_incident: "",
    date_of_incident: "",
    time_of_incident: "",
    description_of_injury: "",
    management: "In PNC", // Default to "In PNC"
    hospital_specification: "",
    school_physician_id: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setData(e.target.name, e.target.value || "");
  };

  // Toggle management options (Ensure only one is selected)
  const handleManagementChange = (option) => {
    setData("management", option);
    if (option !== "Referred to Hospital") {
      setData("hospital_specification", ""); // Clear hospital name if not referred
    }
  };

  console.log(data);

  const handleBlur = (e) => {
    if (!e.target.value.trim()) {
      setData(e.target.name, "");
      toast.error(`❌ ${e.target.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} should not be empty.`);
    }
  };

  // Submit form to Laravel backend
  const handleSubmit = (e) => {
    e.preventDefault();

    // Trim all input values
    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    // Required fields
    const requiredFields = [
      "history",
      "nature_of_incident",
      "place_of_incident",
      "date_of_incident",
      "time_of_incident",
      "school_physician_id",
    ];

    let missingFields = requiredFields.filter((field) => !trimmedData[field]);

    // Ensure `hospital_specification` is required if "Referred to Hospital" is selected
    if (trimmedData.management === "Referred to Hospital" && !trimmedData.hospital_specification) {
      missingFields.push("hospital_specification");
    }

    // Ensure `description_of_injury` is required if the incident involves injury
    if (
      /injury|wound|fracture|burn|bruise|cut/i.test(trimmedData.nature_of_incident) &&
      !trimmedData.description_of_injury
    ) {
      missingFields.push("description_of_injury");
    }

    // Ensure `date_of_incident` is not in the future
    const today = new Date().toISOString().split("T")[0];
    if (trimmedData.date_of_incident && trimmedData.date_of_incident > today) {
      toast.error("❌ Date of incident cannot be in the future.");
      return;
    }

    // Ensure `time_of_incident` is valid
    if (!/^\d{2}:\d{2}$/.test(trimmedData.time_of_incident)) {
      toast.error("❌ Invalid time format.");
      return;
    }

    if (missingFields.length > 0) {
      missingFields.forEach((field) =>
        toast.error(`❌ ${field.replace(/_/g, " ")} is required.`)
      );
      return; // Stop form submission
    }

    setPageLoading(true); // Show loading animation

    post(route("incident-reports.store"), {
      onSuccess: () => {
        toast.success("Incident report saved successfully!");
        reset();
        setOpen(false);
      },
      onError: (errors) => {
        console.error("Validation Errors:", errors);
        toast.error("Failed to save the incident report.");

        Object.entries(errors).forEach(([key, messages]) => {
          (Array.isArray(messages) ? messages : [messages]).forEach((message) =>
            toast.error(`❌ ${message}`)
          );
        });
      },
      onFinish: () => {
        setPageLoading(false); // Hide loading animation after request finishes
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white shadow-xl rounded-lg p-6 max-w-lg w-full mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-700 text-center">
            New Incident Report
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          {/* Patient ID (Hidden Field) */}
          <input type="hidden" name="patient_id" value={data.patient_id || ""} />

            {/* History */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                History: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="history"
                value={data.history || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Enter history"
                required
              />
              {errors.history && <p className="text-red-500 text-xs mt-1">{errors.history}</p>}
            </div>

            {/* Nature of Incident */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nature of Incident: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nature_of_incident"
                value={data.nature_of_incident || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
              {errors.nature_of_incident && <p className="text-red-500 text-xs mt-1">{errors.nature_of_incident}</p>}
            </div>

            {/* Place of Incident */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Place of Incident: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="place_of_incident"
                value={data.place_of_incident || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
              {errors.place_of_incident && <p className="text-red-500 text-xs mt-1">{errors.place_of_incident}</p>}
            </div>

            {/* Date of Incident */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Incident: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_incident"
                value={data.date_of_incident || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
              {errors.date_of_incident && <p className="text-red-500 text-xs mt-1">{errors.date_of_incident}</p>}
            </div>

            {/* Time of Incident */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time of Incident: <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time_of_incident"
                value={data.time_of_incident || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
              {errors.time_of_incident && <p className="text-red-500 text-xs mt-1">{errors.time_of_incident}</p>}
            </div>

            {/* Description of Injury */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description of Injury: <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description_of_injury"
                value={data.description_of_injury || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded p-2 w-full"
                rows="3"
                required
              ></textarea>
              {errors.description_of_injury && <p className="text-red-500 text-xs mt-1">{errors.description_of_injury}</p>}
            </div>

            {/* Management Section */}
            <div>
              <label className="block text-lg font-medium text-gray-900">Management:</label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={data.management === "In PNC"}
                  onChange={() => handleManagementChange("In PNC")}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Treated in PNC Clinic</label>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={data.management === "Referred to Hospital"}
                  onChange={() => handleManagementChange("Referred to Hospital")}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Referred to Hospital</label>
              </div>

              {data.management === "Referred to Hospital" && (
                <input
                  type="text"
                  name="hospital_specification"
                  value={data.hospital_specification || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border border-gray-300 rounded p-2 w-full mt-2"
                  placeholder="Enter hospital name"
                  required
                />
              )}
              {errors.hospital_specification && <p className="text-red-500 text-xs mt-1">{errors.hospital_specification}</p>}
            </div>

            {/* School Physician Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                School Physician: <span className="text-red-500">*</span>
              </label>
              <select
                name="school_physician_id"
                value={data.school_physician_id || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded p-2 w-full"
                required
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
              {errors.school_physician_id && <p className="text-red-500 text-xs mt-1">{errors.school_physician_id}</p>}
            </div>

            {/* Submit & Cancel Buttons */}
            <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-3">
              <Button type="button" onClick={() => setOpen(false)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                Cancel
              </Button>
              <Button type="submit" disabled={processing} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
                {processing ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>

      {pageLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative flex flex-col items-center"
          >
            {/* Smooth Spinning Loader */}
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-green-500 border-l-green-400 border-r-green-300 border-b-green-200"></div>
            <p className="mt-4 text-green-300 text-lg font-semibold animate-pulse">
              Saving, please wait...
            </p>
          </motion.div>
        </div>
      )}

    </Dialog>
  );
};

export default AddIncidentForm;
