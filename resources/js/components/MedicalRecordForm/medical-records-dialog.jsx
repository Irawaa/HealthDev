import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";
import Step6 from "./Steps/Step6";

const MedicalRecordDialog = ({ patient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [step, setStep] = useState(1);

  const { data, setData, post, processing, reset, errors } = useForm({
    patient_id: patient?.patient_id || null,
    school_nurse_id: 1,
    school_physician_id: 2,
    recorded_by: 1,
    review_of_systems: [],
    others: "",
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleCreateNew = () => {
    reset();
    setSelectedRecord(null);
    setIsOpen(true);
    setStep(1);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsOpen(true);
    setStep(1);
  };

  const handleSave = () => {
    post(route("medical-records.store"), {
      onSuccess: () => {
        toast.success("Medical record saved successfully!");

        if (!selectedRecord) {
          setRecords([{ id: Date.now(), ...data }, ...records]);
        } else {
          const updated = records.map((r) =>
            r.id === selectedRecord.id ? { ...data } : r
          );
          setRecords(updated);
        }
        reset();
        setIsOpen(false);
      },
      onError: () => {
        toast.error("Failed to save medical record.");
      },
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRecords(records.filter((r) => r.id !== id));
      toast.success("Record deleted successfully.");
    }
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-green-700">Medical Records</h2>

      <Button onClick={handleCreateNew} className="mb-4 bg-blue-500 text-white">
        Create New Medical Record
      </Button>

      {records.length > 0 ? (
        records.map((record) => (
          <div key={record.id} className="p-4 bg-white shadow-md rounded-lg flex justify-between">
            <div>
              <p>
                <strong>Created by:</strong> {record.createdBy}
              </p>
              <p>
                <strong>Date:</strong> {record.date}
              </p>
            </div>
            <div className="space-x-2">
              <Button onClick={() => handleEdit(record)} className="bg-green-600 text-white">
                Edit
              </Button>
              <Button onClick={() => handleDelete(record.id)} className="bg-red-600 text-white">
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-700 mt-4">No medical records available.</p>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-semibold text-green-700">
                {selectedRecord ? "Edit Medical Record" : "New Medical Record"}
              </h2>
              <Button onClick={() => setIsOpen(false)} className="bg-gray-500">
                Close
              </Button>
            </div>

            {step === 1 && <Step1 formData={data} setFormData={setData} />}
            {step === 2 && <Step2 formData={data} setFormData={setData} />}
            {step === 3 && <Step3 formData={data} setFormData={setData} patient={patient} />}
            {step === 4 && <Step4 formData={data} setFormData={setData} />}
            {step === 5 && <Step5 formData={data} setFormData={setData} />}
            {step === 6 && <Step6 formData={data} setFormData={setData} />}

            <div className="mt-4 flex justify-between">
              {step > 1 && (
                <Button onClick={prevStep} className="bg-gray-400">
                  Back
                </Button>
              )}
              {step < 6 ? (
                <Button onClick={nextStep} className="bg-green-600">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSave} className="bg-blue-600">
                  {processing ? "Saving..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordDialog;
