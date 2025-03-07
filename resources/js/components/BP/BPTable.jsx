import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // ✅ Warning icon

const BPTable = ({ open, setOpen, selectedRecord, setBpRecords }) => {
  const MAX_RECORDS = 7; // Maximum records allowed

  const [formData, setFormData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null); // Track which record is expanded

  useEffect(() => {
    if (selectedRecord) {
      setFormData(selectedRecord.bpRecords || []);
    } else {
      setFormData([]); // Reset form for new records
    }
  }, [selectedRecord]);

  // Handle input changes
  const handleChange = (index, field, value) => {
    setFormData((prevData) =>
      prevData.map((record, i) =>
        i === index ? { ...record, [field]: value } : record
      )
    );
  };

  // Check BP Warning
  const checkBpWarning = (bp) => {
    if (!bp) return { warning: "", severity: "" };

    const [systolic, diastolic] = bp.split("/").map(Number);
    if (systolic >= 180 || diastolic >= 120) {
      return { warning: "🚨 Hypertensive Crisis: Seek emergency care!", severity: "text-red-600 border-red-500 bg-red-100" };
    } else if (systolic >= 140 || diastolic >= 90) {
      return { warning: "⚠️ Stage 2 Hypertension: Monitor closely.", severity: "text-orange-500 border-orange-500 bg-orange-100" };
    } else if (systolic >= 130 || diastolic >= 80) {
      return { warning: "⚠️ Stage 1 Hypertension: Lifestyle changes recommended.", severity: "text-green-600 border-green-500 bg-green-100" };
    } else if (systolic < 90 || diastolic < 60) {
      return { warning: "⚠️ Low Blood Pressure: Consider medical advice.", severity: "text-green-600 border-green-500 bg-green-100" };
    } else {
      return { warning: "", severity: "" };
    }
  };

  // Handle BP Input Change with Warning
  const handleBpChange = (index, value) => {
    const { warning, severity } = checkBpWarning(value);
    setFormData((prevData) =>
      prevData.map((record, i) =>
        i === index ? { ...record, bp: value, warning, severity } : record
      )
    );
  };

  // Add new BP record (Limit to 7)
  const addRecord = () => {
    if (formData.length < MAX_RECORDS) {
      const newRecord = { id: Date.now(), date: "", time: "", bp: "", remarks: "", warning: "", severity: "" };
      setFormData((prevData) => [...prevData, newRecord]);
      setExpandedIndex(formData.length); // Expand new record
    }
  };

  // Remove a BP record
  const removeRecord = (index) => {
    if (formData.length > 1) {
      setFormData((prevData) => prevData.filter((_, i) => i !== index));
      setExpandedIndex(null); // Close any expanded records
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setBpRecords((prevRecords) => {
      if (selectedRecord) {
        return prevRecords.map((rec) =>
          rec.id === selectedRecord.id ? { ...rec, bpRecords: formData } : rec
        );
      } else {
        return [...prevRecords, { id: Date.now(), bpRecords: formData }];
      }
    });
    setOpen(false); // Close modal
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-green-50 shadow-xl rounded-lg p-6 max-w-lg w-full mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800">
            {selectedRecord ? "Edit BP Records" : "New BP Records"}
          </DialogTitle>
        </DialogHeader>

        {/* BP Records List - Dropdown Accordion */}
        <div className="space-y-2">
          {formData.map((record, index) => (
            <div key={record.id} className="border border-green-300 rounded-lg bg-green-100">
              {/* Record Header (Click to Expand/Collapse) */}
              <div
                className="flex justify-between items-center p-3 bg-green-200 cursor-pointer rounded-t-lg hover:bg-green-300 transition"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <h3 className="text-sm font-semibold text-green-900">
                  BP Record {index + 1} - {record.date || "No Date"} at {record.time || "No Time"}
                </h3>
                <span className="text-green-700">{expandedIndex === index ? "▲" : "▼"}</span>
              </div>

              {/* Expanded Content (Inputs) */}
              {expandedIndex === index && (
                <div className="p-3 transition-all">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Date Input */}
                    <div>
                      <label className="text-sm font-medium text-green-800">Date</label>
                      <input
                        type="date"
                        value={record.date}
                        onChange={(e) => handleChange(index, "date", e.target.value)}
                        className="w-full border border-green-400 rounded-md px-2 py-1 focus:ring-0 focus:border-green-600"
                      />
                    </div>

                    {/* Time Input */}
                    <div>
                      <label className="text-sm font-medium text-green-800">Time</label>
                      <input
                        type="time"
                        value={record.time}
                        onChange={(e) => handleChange(index, "time", e.target.value)}
                        className="w-full border border-green-400 rounded-md px-2 py-1 focus:ring-0 focus:border-green-600"
                      />
                    </div>

                    {/* BP Input with Warning */}
                    <div className="col-span-2 relative">
                      <label className="text-sm font-medium text-green-800">Blood Pressure</label>
                      <input
                        type="text"
                        value={record.bp}
                        onChange={(e) => handleBpChange(index, e.target.value)}
                        className={`w-full border border-green-400 rounded-md px-2 py-1 focus:ring-0 focus:border-green-600 ${record.severity}`}
                        placeholder="e.g. 120/80"
                        pattern="\d{2,3}/\d{2,3}"
                      />
                      
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
                    </div>
                  </div>

                  {/* Remove Button (Only if more than 1 record) */}
                  {formData.length > 1 && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => removeRecord(index)}
                        className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-md hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Record Button */}
        <div className="mt-4 flex justify-center">
          <Button onClick={addRecord} disabled={formData.length >= MAX_RECORDS} className="bg-green-700 text-white px-6 py-2 rounded-lg shadow hover:bg-green-800">
            + Add BP Record
          </Button>
        </div>

        {/* Submit & Cancel Buttons */}
        <DialogFooter className="mt-6 flex justify-between">
          <Button onClick={() => setOpen(false)} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BPTable;
