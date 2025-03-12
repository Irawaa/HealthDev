import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import IncidentForm from "./incident-reports-form";

const IncidentModal = ({ activeTab, patient }) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [incidentRecords, setIncidentRecords] = useState([]);
  const [expandedForms, setExpandedForms] = useState({});

  // ✅ Load incident reports from patient data
  useEffect(() => {
    if (patient?.incident_reports) {
      setIncidentRecords(patient.incident_reports);
    }
  }, [patient]);

  // ✅ Toggle form expansion
  const toggleForm = (id) => {
    setExpandedForms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    setOpen(activeTab === "incident");
  }, [activeTab]);

  const handleDelete = (id) => {
    setIncidentRecords(incidentRecords.filter((record) => record.id !== id));
  };

  return (
    open && (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-800">Incident Reports</h2>

        {/* ✅ Button to Open Create Form */}
        <Button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          onClick={() => setOpenForm(true)}
        >
          Create New Incident Report
        </Button>

        {/* ✅ Incident Reports List */}
        <div className="mt-4 space-y-3">
          {incidentRecords.length > 0 ? (
            incidentRecords.map((record) => (
              <div key={record.id} className="bg-white p-4 rounded-lg shadow">
                {/* ✅ Clickable Header for Expansion */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleForm(record.id)}
                >
                  <p className="font-medium text-gray-800">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(record.date_of_incident).toLocaleDateString()} |
                    <span className="font-semibold"> Nature:</span> {record.nature_of_incident}
                  </p>
                  <div className="flex items-center space-x-2">
                    {expandedForms[record.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>

                {/* ✅ Collapsible Details */}
                {expandedForms[record.id] && (
                  <div className="mt-3 space-y-2 bg-gray-50 border border-gray-300 p-4 rounded-md shadow-sm">
                    <p className="text-gray-700"><span className="font-semibold">Recorded On:</span> {new Date(record.created_at).toLocaleString()}</p>
                    <p className="text-gray-700"><span className="font-semibold">Place:</span> {record.place_of_incident}</p>
                    <p className="text-gray-700"><span className="font-semibold">Time:</span> {record.time_of_incident}</p>
                    <p className="text-gray-700"><span className="font-semibold">History:</span> {record.history}</p>
                    <p className="text-gray-700"><span className="font-semibold">Description of Injury:</span> {record.description_of_injury || "N/A"}</p>
                    <p className="text-gray-700"><span className="font-semibold">Management:</span> {record.management}</p>
                    {record.hospital_specification && (
                      <p className="text-gray-700"><span className="font-semibold">Hospital:</span> {record.hospital_specification}</p>
                    )}
                    <p className="text-gray-700">
                      <span className="font-semibold">Recorded By:</span> {record.recorded_by.clinic_staff.fname} {record.recorded_by.clinic_staff.lname}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">School Nurse:</span> {record.school_nurse.fname} {record.school_nurse.lname}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">School Physician:</span> {record.school_physician.fname} {record.school_physician.lname}
                    </p>
                    {/* ✅ Delete Button */}
                    <div className="flex justify-end space-x-2">
                      <Button className="bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700" onClick={() => handleDelete(record.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-green-700 text-center">No incident reports found.</p>
          )}
        </div>

        {/* ✅ Incident Form Modal */}
        {openForm && <IncidentForm open={openForm} setOpen={setOpenForm} patient={patient} />}
      </div>
    )
  );
};

export default IncidentModal;
