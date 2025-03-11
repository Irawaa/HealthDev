import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import IncidentForm from "./incident-reports-form";

const IncidentModal = ({ activeTab, patient }) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [incidentRecords, setIncidentRecords] = useState([]);

  useEffect(() => {
    if (activeTab === "incident") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [activeTab]);

  const handleSave = (record) => {
    if (record.id) {
      setIncidentRecords(incidentRecords.map((r) => (r.id === record.id ? record : r)));
    } else {
      setIncidentRecords([...incidentRecords, { ...record, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setIncidentRecords(incidentRecords.filter((record) => record.id !== id));
  };

  return (
    open && (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-800">Incident Reports</h2>

        <Button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition" onClick={() => setOpenForm(true)}>
          Create New Incident Report
        </Button>

        <div className="mt-4 space-y-3">
          {incidentRecords.length > 0 ? (
            incidentRecords.map((record) => (
              <div key={record.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer hover:bg-gray-100">
                <div onClick={() => setViewRecord(record)}>
                  <p className="font-medium text-gray-800">
                    <span className="font-semibold">Date:</span> {record.date} | <span className="font-semibold">Nature:</span> {record.nature}
                  </p>
                </div>
                <Button className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700" onClick={() => handleDelete(record.id)}>
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <p className="text-green-700 text-center">No incident reports found.</p>
          )}
        </div>

        {openForm && <IncidentForm open={openForm} setOpen={setOpenForm} handleSave={handleSave} />}
      </div>
    )
  );
};

export default IncidentModal;
