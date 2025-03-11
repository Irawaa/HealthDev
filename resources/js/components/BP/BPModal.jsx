import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BPTable from "@/components/BP/BPTable";

const BPModal = ({ patient }) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [viewRecord, setViewRecord] = useState(null); // Store the record to view
  const [bpRecords, setBpRecords] = useState([
    { id: 1, date: "2024-02-28", time: "08:00", bp: "120/80", remarks: "Normal" },
  ]);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleEdit = (record) => {
    setViewRecord(record); // Set selected record
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setBpRecords(bpRecords.filter((record) => record.id !== id));
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

      {/* ✅ BP Records List */}
      <div className="mt-4 space-y-3">
        {bpRecords.length > 0 ? (
          bpRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setViewRecord(record)} // Open view modal on click
            >
              <div>
                <p className="font-medium text-gray-800">
                  <span className="font-semibold">Date:</span> {record.date} | <span className="font-semibold">Time:</span> {record.time}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">BP:</span> {record.bp} | <span className="font-semibold">Remarks:</span> {record.remarks}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  className="bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent clicking the card from opening the view modal
                    handleDelete(record.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-green-700 text-center">No BP records found.</p>
        )}
      </div>

      {/* ✅ View BP Record Modal */}
      {viewRecord && (
        <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
          <DialogContent className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full mx-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-800">BP Record Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <p className="text-gray-800">
                <span className="font-semibold">Date:</span> {viewRecord.date}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Time:</span> {viewRecord.time}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Blood Pressure:</span> {viewRecord.bp}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Remarks:</span> {viewRecord.remarks || "None"}
              </p>
            </div>

            <DialogFooter className="mt-4 flex justify-between">
              <Button onClick={() => setViewRecord(null)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                Close
              </Button>
              <Button onClick={() => handleEdit(viewRecord)} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ✅ BP Form Modal */}
      {openForm && <BPTable open={openForm} setOpen={setOpenForm} patient={patient} />}
    </div>
  );
};

export default BPModal;
