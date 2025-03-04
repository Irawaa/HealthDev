import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import FDARForm from "./FDARSteps/FDARForm"; // ✅ Import the combined form

const FDARModal = ({ patient }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    focus: "",
    data: "",
    action: "",
    response: "",
    weight: "",
    height: "",
    bloodPressure: "",
    cr: "",
    rr: "",
    temp: "",
    o2Sat: "",
    lmp: "",
    savedBy: "Dr. John Doe",
    savedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Saving Data:", formData);
    setOpen(false);
  };

  // ✅ Open modal for creating a new FDAR record
  const openCreateModal = () => {
    setFormData({
      focus: "",
      data: "",
      action: "",
      response: "",
      weight: "",
      height: "",
      bloodPressure: "",
      cr: "",
      rr: "",
      temp: "",
      o2Sat: "",
      lmp: "",
      savedBy: "Dr. John Doe",
      savedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });
    setOpen(true);
  };

  // ✅ Open modal for editing an existing record
  const openEditModal = (record) => {
    setFormData({
      ...record,
      savedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"), // Update timestamp
    });
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

      {/* ✅ FDAR Records List */}
      <div className="mt-4 space-y-3">
        {[{ id: 1, createdBy: "Dr. John Doe", date: "2024-02-26", focus: "Sample Focus", data: "Sample Data" }].map(
          (record) => (
            <div key={record.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">
                  <span className="font-semibold">Created by:</span> {record.createdBy}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Date:</span> {record.date}
                </p>
              </div>
              <div className="space-x-2">
                {/* ✅ Edit Button - Opens Modal with Pre-filled Data */}
                <Button
                  className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700"
                  onClick={() => openEditModal(record)}
                >
                  Edit
                </Button>
                <Button className="bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700">Delete</Button>
              </div>
            </div>
          )
        )}
      </div>

      {/* ✅ FDAR Form Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white shadow-xl rounded-lg p-8 max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col overflow-hidden">
          {/* ✅ Fixed Green Header */}
          <div className="bg-green-100 px-6 py-4 flex justify-between items-center border-b shadow-md sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-green-700">New FDAR Record</h2>
            <p className="text-sm text-gray-600">
              Created by: {formData.savedBy} on {new Date().toISOString().split("T")[0]}
            </p>
          </div>

          {/* ✅ Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-transparent select-none">‎</DialogTitle> {/* Invisible title for spacing */}
            </DialogHeader>

            {/* ✅ Render Single Combined Form */}
            <FDARForm formData={formData} handleChange={handleChange} />
          </div>

          {/* ✅ Footer Controls */}
          <DialogFooter className="bg-white px-8 py-6 border-t shadow-md flex justify-between">
            <Button onClick={() => setOpen(false)} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FDARModal;
