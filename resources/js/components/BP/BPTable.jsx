import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  // Add new BP record (Limit to 7)
  const addRecord = () => {
    if (formData.length < MAX_RECORDS) {
      const newRecord = { id: Date.now(), date: "", time: "", bp: "", remarks: "" };
      setFormData((prevData) => [...prevData, newRecord]);
      setExpandedIndex(formData.length); // Expand new record
    }
  };

  // Remove a BP record
  const removeRecord = (index) => {
    setFormData((prevData) => prevData.filter((_, i) => i !== index));
    setExpandedIndex(null); // Close any expanded records
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
      <DialogContent className="bg-white shadow-xl rounded-lg p-6 max-w-lg w-full mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800">
            {selectedRecord ? "Edit BP Records" : "New BP Records"}
          </DialogTitle>
        </DialogHeader>

        {/* BP Records List - Dropdown Accordion */}
        <div className="space-y-2">
          {formData.map((record, index) => (
            <div key={record.id} className="border border-gray-300 rounded-lg">
              {/* Record Header (Click to Expand/Collapse) */}
              <div
                className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer rounded-t-lg hover:bg-gray-200 transition"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <h3 className="text-sm font-semibold text-gray-800">
                  BP Record {index + 1} - {record.date || "No Date"} at {record.time || "No Time"}
                </h3>
                <span className="text-gray-600">{expandedIndex === index ? "▲" : "▼"}</span>
              </div>

              {/* Expanded Content (Inputs) */}
              {expandedIndex === index && (
                <div className="p-3 transition-all">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Date Input */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        value={record.date}
                        onChange={(e) => handleChange(index, "date", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-0 focus:border-green-600"
                      />
                    </div>

                    {/* Time Input */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <input
                        type="time"
                        value={record.time}
                        onChange={(e) => handleChange(index, "time", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-0 focus:border-green-600"
                      />
                    </div>

                    {/* BP Input */}
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Blood Pressure</label>
                      <input
                        type="text"
                        value={record.bp}
                        onChange={(e) => handleChange(index, "bp", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-0 focus:border-green-600"
                        placeholder="e.g. 120/80"
                        pattern="\d{2,3}/\d{2,3}" // Ensures proper BP format
                      />
                    </div>

                    {/* Remarks */}
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Remarks</label>
                      <input
                        type="text"
                        value={record.remarks}
                        onChange={(e) => handleChange(index, "remarks", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-0 focus:border-green-600"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  {formData.length > 1 && (
                    <button
                      onClick={() => removeRecord(index)}
                      className="mt-2 w-full text-sm text-red-500 hover:text-red-700"
                    >
                      ✖ Remove Record
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Record Button (Disabled at 7 records) */}
        <div className="mt-4 flex justify-center">
          <Button
            onClick={addRecord}
            disabled={formData.length >= MAX_RECORDS}
            className={`px-6 py-2 rounded-lg shadow ${
              formData.length >= MAX_RECORDS
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            + Add BP Record
          </Button>
        </div>

        {/* Form Buttons */}
        <DialogFooter className="mt-6 flex justify-between">
          <Button onClick={() => setOpen(false)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
            {selectedRecord ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BPTable;
