import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FDARFormModal from "./FDARFormModal";

const FDARModal = ({ patient }) => {
    const [open, setOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
  
    useEffect(() => {
      setOpen(true);
    }, []);
  
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-800">FDAR Records</h2>
  
        <Button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          onClick={() => setOpenForm(true)}
        >
          Create New FDAR Record
        </Button>
  
        {/* FDAR Records List */}
        <div className="mt-4 space-y-3">
          {[{ id: 1, createdBy: "Dr. John Doe", date: "2024-02-26" }].map((record) => (
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
                <Button className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700">Edit</Button>
                <Button className="bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700">Delete</Button>
              </div>
            </div>
          ))}
        </div>
  
        {/* FDAR Form Modal */}
        {openForm && <FDARFormModal open={openForm} setOpen={setOpenForm} patient={patient} />}
      </div>
    );
  };
  
  export default FDARModal;
