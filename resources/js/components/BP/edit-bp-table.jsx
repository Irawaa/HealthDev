import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";

const EditBPTable = ({ open, setOpen, patient, record }) => {
  const MAX_RECORDS = 7; // Limit for BP records
  const [expandedIndex, setExpandedIndex] = useState(null); // Track expanded record

  // Initialize form state with existing data (record) if available
  const { data, setData, put, processing, reset, errors } = useForm({
    patient_id: patient?.patient_id || null,
    readings: record?.readings || [],
    status: record?.status || "Stable",
  });

  const resetFormState = () => {
    setData({
      patient_id: patient?.patient_id || null,
      readings: [],
      status: "Stable",
    });
  };


  useEffect(() => {
    // Reset form state whenever the record changes
    resetFormState();

    if (record) {
      console.log("Setting data for the record:", record); // Log the record data
      setData({
        patient_id: patient?.patient_id || null,
        readings: record.readings,
        status: record.status,
      });
    }
  }, [record, setData, patient]);


  // BP Warning Logic (unchanged)
  const checkBpWarning = (bp) => {
    if (!bp) return { warning: "", severity: "", remark: "No BP recorded" };

    const [systolic, diastolic] = bp.split("/").map(Number);
    if (systolic >= 180 || diastolic >= 120) {
      return {
        warning: "🚨 Hypertensive Crisis: Seek emergency care!",
        severity: "text-red-600 border-red-500 bg-red-100",
        remark: "Critical - Immediate medical attention required"
      };
    } else if (systolic >= 140 || diastolic >= 90) {
      return {
        warning: "⚠️ Stage 2 Hypertension: Monitor closely.",
        severity: "text-orange-500 border-orange-500 bg-orange-100",
        remark: "High BP - Consider medication or lifestyle changes"
      };
    } else if (systolic >= 130 || diastolic >= 80) {
      return {
        warning: "⚠️ Stage 1 Hypertension: Lifestyle changes recommended.",
        severity: "text-yellow-600 border-yellow-500 bg-yellow-100",
        remark: "Elevated BP - Diet and exercise advised"
      };
    } else if (systolic < 90 || diastolic < 60) {
      return {
        warning: "⚠️ Low Blood Pressure: Consider medical advice.",
        severity: "text-blue-600 border-blue-500 bg-blue-100",
        remark: "Low BP - Monitor for dizziness or fatigue"
      };
    } else {
      return {
        warning: "",
        severity: "",
        remark: "Normal - BP within a healthy range"
      };
    }
  };

  // Validation function (unchanged)
  const validateForm = () => {
    return data.readings.every((record) => {
      const { date, time, blood_pressure } = record;
      const isValidDate = date && time && blood_pressure;
      const isValidBp = /^(\d{2,3})\/(\d{2,3})$/.test(blood_pressure);
      return isValidDate && isValidBp;
    });
  };

  // Handle input changes (unchanged)
  const handleChange = (index, field, value) => {
    if (field === "time") {
      const timeParts = value.split(":");
      if (timeParts.length === 2) {
        // If the time has only hours and minutes, add ":00" for seconds
        value = `${timeParts[0]}:${timeParts[1]}:00`;
      }
      setData("readings", data.readings.map((record, i) =>
        i === index ? { ...record, [field]: value } : record
      ));
    } else {
      setData("readings", data.readings.map((record, i) =>
        i === index ? { ...record, [field]: value } : record
      ));
    }
  };

  // Handle BP changes with warning (unchanged)
  const handleBpChange = (index, value) => {
    const { warning, severity, remark } = checkBpWarning(value);
    setData("readings", data.readings.map((record, i) =>
      i === index ? { ...record, blood_pressure: value, warning, severity, remarks: remark } : record
    ));
    updateOverallStatus();
  };

  const updateOverallStatus = () => {
    let criticalCount = 0, highCount = 0, lowCount = 0, normalCount = 0;

    data.readings.forEach((record) => {
      if (record.remarks.includes("Critical")) criticalCount++;
      else if (record.remarks.includes("High BP")) highCount++;
      else if (record.remarks.includes("Low BP")) lowCount++;
      else if (record.remarks.includes("Normal")) normalCount++;
    });

    let status = "Stable";
    if (criticalCount > 0) status = "Critical Condition";
    else if (highCount >= 3) status = "High Risk";
    else if (highCount > 0) status = "Elevated BP";
    else if (lowCount > 0) status = "Low BP Warning";
    else if (normalCount === data.readings.length) status = "Stable";

    setData("status", status);
  };

  // Add a new record (limit 7)
  const addRecord = () => {
    if (data.readings.length < MAX_RECORDS) {
      setData("readings", [
        ...data.readings,
        { date: "", time: "", blood_pressure: "", has_signature: false, remarks: "No BP recorded", warning: "", severity: "" }
      ]);
      updateOverallStatus();
      setExpandedIndex(data.readings.length);
    }
  };

  // Remove a record (unchanged)
  const removeRecord = (index) => {
    setData("readings", data.readings.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const handleSubmit = () => {
    // If we have a record (editing mode), we'll use the `update` route
    put(route("bp-forms.update", record.id), {
      data: { ...data, patient_id: patient?.patient_id },
      onSuccess: () => {
        toast.success("BP records updated successfully!");
        reset();
        setOpen(false);
      },
      onError: (errors) => {
        console.error("Validation Errors:", errors);
        if (typeof errors.error === "string") {
          toast.error(`❌ ${errors.error}`);
        }
        Object.entries(errors).forEach(([key, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(`❌ ${message}`));
          } else if (typeof messages === "string") {
            toast.error(`❌ ${messages}`);
          }
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white shadow-xl rounded-lg p-6 max-w-lg w-full mx-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {record ? "Edit BP Records" : "New BP Records"}
          </DialogTitle>
        </DialogHeader>

        {/* Overall Status Summary */}
        <div className="mb-4 p-3 rounded-lg bg-green-100 border border-gray-300 text-gray-800 font-semibold">
          Overall Status: <span className="font-bold">{data.status}</span>
        </div>

        {/* BP Records List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {data.readings.map((record, index) => (
            <div key={`${record.id || index}-${record.date}-${record.time}`} className="border border-green-300 rounded-lg bg-green-50 shadow-md">
              {/* Record Header */}
              <div
                className="flex justify-between items-center p-3 bg-green-200 cursor-pointer rounded-t-lg hover:bg-green-300 transition"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <h3 className="text-sm font-semibold text-gray-900">
                  BP Record {index + 1} - {record.date || "No Date"} at {record.time || "No Time"}
                </h3>
                <span className="text-gray-700">{expandedIndex === index ? "▲" : "▼"}</span>
              </div>

              {/* Expanded Content */}
              {expandedIndex === index && (
                <div className="p-3 transition-all">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Date Input */}
                    <div>
                      <label className="text-sm font-medium text-gray-800">Date</label>
                      <input
                        type="date"
                        value={record.date}
                        onChange={(e) => handleChange(index, "date", e.target.value)}
                        className="w-full border border-gray-400 rounded-md px-2 py-1 focus:ring-0 focus:border-gray-600"
                      />
                    </div>

                    {/* Time Input */}
                    <div>
                      <label className="text-sm font-medium text-gray-800">Time</label>
                      <input
                        type="time"
                        value={record.time}
                        onChange={(e) => handleChange(index, "time", e.target.value)}
                        className="w-full border border-gray-400 rounded-md px-2 py-1 focus:ring-0 focus:border-gray-600"
                      />
                    </div>

                    {/* BP Input with Warning */}
                    <div className="col-span-2 relative">
                      <label className="text-sm font-medium text-gray-800">
                        Blood Pressure <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={record.blood_pressure}
                        onChange={(e) => handleBpChange(index, e.target.value)}
                        className={`w-full border border-gray-400 rounded-md px-2 py-1 focus:ring-0 focus:border-gray-600 ${record.severity} ${!record.blood_pressure ? "border-red-500" : ""}`}
                        placeholder="e.g. 120/80"
                      />

                      {/* Error message when field is empty */}
                      {!record.blood_pressure && (
                        <div className="text-red-500 text-xs mt-1">
                          This field must not be empty
                        </div>
                      )}

                      {/* Warning Icon */}
                      {record.warning && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <ExclamationTriangleIcon className={`w-5 h-5 ${record.severity}`} />
                        </div>
                      )}

                      {/* Warning Message */}
                      {record.warning && (
                        <div className={`mt-1 text-xs p-2 rounded shadow-lg ${record.severity}`}>
                          {record.warning}
                        </div>
                      )}

                      {/* Remarks Display */}
                      <div className="mt-2 p-2 rounded bg-green-100 border border-gray-300">
                        <strong>Remarks:</strong> {record.remarks}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => removeRecord(index)}
                      className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-md hover:bg-red-200 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Record Button */}
        <div className="mt-4 flex justify-center">
          <Button onClick={addRecord} disabled={data.readings.length >= MAX_RECORDS} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700">
            + Add BP Record
          </Button>
        </div>

        {/* Submit & Cancel Buttons */}
        <DialogFooter className="mt-6 flex justify-between">
          <Button onClick={() => setOpen(false)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={processing || data.readings.length === 0 || !validateForm()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {processing ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBPTable;
