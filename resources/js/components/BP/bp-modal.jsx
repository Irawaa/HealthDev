import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BPTable from "@/components/BP/bp-table";
import { ChevronDown, ChevronUp } from "lucide-react";

const BPModal = ({ patient }) => {
  const [openForm, setOpenForm] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [bpForms, setBpForms] = useState([]);
  const [expandedForms, setExpandedForms] = useState({});

  // ✅ Load BP Forms & Readings Nested
  useEffect(() => {
    if (patient?.bp_forms) {
      setBpForms(patient.bp_forms);
    }
  }, [patient]);

  const toggleForm = (formId) => {
    setExpandedForms((prev) => ({
      ...prev,
      [formId]: !prev[formId], // Toggle form expansion
    }));
  };

  const handleEdit = (form) => {
    setViewRecord(form);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setBpForms(bpForms.filter((form) => form.id !== id));
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h2 className="text-xl font-semibold text-green-800">BP Records</h2>

      {/* ✅ Create New BP Record Button */}
      <Button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
        onClick={() => setOpenForm(true)}
      >
        Create New BP Record
      </Button>

      {/* ✅ BP Forms with Readings in Collapsible Cards */}
      <div className="mt-4 space-y-3">
        {bpForms.length > 0 ? (
          bpForms.map((form) => (
            <div key={form.id} className="bg-white p-4 rounded-lg shadow">
              {/* Form Header - Click to Expand/Collapse */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleForm(form.id)}
              >
                <div>
                  <p className="font-medium text-gray-800">
                    <span className="font-semibold">Status:</span> {form.status}
                  </p>
                </div>
                <div className="space-x-2 flex items-center">
                  <Button
                    className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown toggle
                      handleEdit(form);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown toggle
                      handleDelete(form.id);
                    }}
                  >
                    Delete
                  </Button>
                  {expandedForms[form.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </div>

              {/* ✅ Nested BP Readings - Show only when expanded */}
              {expandedForms[form.id] && (
                <div className="mt-3 space-y-2">
                  {form.readings.length > 0 ? (
                    form.readings.map((reading) => (
                      <div
                        key={reading.id}
                        className="bg-gray-100 p-2 rounded-md flex justify-between"
                      >
                        <p className="text-gray-700">
                          <span className="font-semibold">Date:</span> {reading.date} |
                          <span className="font-semibold"> Time:</span> {reading.time}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">BP:</span> {reading.blood_pressure} |
                          <span className="font-semibold"> Remarks:</span> {reading.remarks || "None"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No readings recorded.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-green-700 text-center">No BP forms found.</p>
        )}
      </div>

      {/* ✅ BP Form Modal */}
      {openForm && <BPTable open={openForm} setOpen={setOpenForm} patient={patient} />}
    </div>
  );
};

export default BPModal;
