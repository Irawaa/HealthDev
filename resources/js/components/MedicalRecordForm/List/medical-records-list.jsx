import { useState } from "react";
import { Button } from "@/components/ui/button";
import MedicalRecordDetails from "../components/medical-records-details";
import { router } from "@inertiajs/react";
import ConfirmationModal from "@/components/confirmation-modal";
import { toast } from "react-hot-toast";

const MedicalRecordsList = ({ patient, onEdit }) => {
    const [records, setRecords] = useState(patient?.medical_records || []);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedMedicalRecordId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedMedicalRecordId) return;

        setPageLoading(true);

        router.delete(route("medical-records.destroy", selectedMedicalRecordId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Medical Record deleted successfully!");
                setRecords((prevRecords) =>
                    prevRecords.filter((record) => record.id !== selectedMedicalRecordId)
                );
            },
            onError: () => {
                toast.error("Failed to delete the medical record.");
            },
            onFinish: () => {
                setConfirmOpen(false);
                setSelectedMedicalRecordId(null);
                setPageLoading(false);
            },
        });
    };

    return (
        <div>
            {records.length > 0 ? (
                records.map((record) => (
                    <div
                        key={record.id}
                        className="p-4 bg-white shadow-md rounded-lg flex justify-between"
                    >
                        <div>
                            <p><strong>Final Evaluation:</strong> {record.final_evaluation}</p>
                            <p><strong>Plan:</strong> {record.plan_recommendation}</p>
                            <p><strong>Date:</strong> {new Date(record.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="space-x-2">
                            <Button onClick={() => setSelectedRecord(record)} className="bg-blue-600 text-white">
                                Details
                            </Button>
                            <Button onClick={() => onEdit(record)} className="bg-green-600 text-white">
                                Edit
                            </Button>
                            <Button onClick={() => handleDeleteClick(record.id)} className="bg-red-600 text-white">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-700 mt-4">No medical records available.</p>
            )}

            {selectedRecord && (
                <MedicalRecordDetails record={selectedRecord} onClose={() => setSelectedRecord(null)} />
            )}

            <ConfirmationModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Medical Record"
                message="Are you sure you want to delete this medical record? This action cannot be undone."
                actionType="Remove"
            />

            {pageLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <div className="relative flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-red-500 border-l-red-400 border-r-red-300 border-b-red-200"></div>
                        <p className="mt-4 text-red-300 text-lg font-semibold animate-pulse">
                            Deleting, please wait...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordsList;
