import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Eye, Printer, Pencil, Trash2 } from "lucide-react";
import EditIncidentForm from "./incident-reports-edit-form";
import { router } from "@inertiajs/react";
import ConfirmationModal from "../confirmation-modal";
import { toast } from "react-hot-toast";

const IncidentRecords = ({ patient }) => {
    const [incidentRecords, setIncidentRecords] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);
    const [expandedForms, setExpandedForms] = useState({});
    const [editForm, setEditForm] = useState({ open: false, record: null });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);


    const handleEditClick = (record) => {
        setEditForm({ open: true, record });
    };

    useEffect(() => {
        if (patient?.incident_reports) {
            setIncidentRecords(patient.incident_reports);
        }
    }, [patient]);

    const toggleForm = (id) => {
        setExpandedForms((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleDeleteClick = (id) => {
        setSelectedIncidentId(id);
        setConfirmOpen(true);
    };

    const onView = (id) => {
        window.open(`/incident-reports/${id}/pdf`, "_blank");
    };

    const onPreview = (id) => {
        const printWindow = window.open(`/incident-reports/preview/${id}`, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus(); // Ensure it's in focus
                printWindow.print(); // Auto-trigger print dialog
            };
        }
    };

    const handleDeleteConfirm = () => {
        if (!selectedIncidentId) return;

        setPageLoading(true);

        router.delete(route("incident-reports.destroy", selectedIncidentId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Incident report deleted successfully!");
                setIncidentRecords((prevRecords) => prevRecords.filter((record) => record.id !== selectedIncidentId));
            },
            onError: (errors) => {
                toast.error("Failed to delete the incident report.");
                console.error("Delete Error:", errors);
            },
            onFinish: () => {
                setConfirmOpen(false);
                setSelectedIncidentId(null);
                setPageLoading(false);
            },
        });
    };



    return (
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
                                <span className="font-semibold">Incident:</span> {record.nature_of_incident}
                            </p>
                            <div className="flex items-center">
                                {expandedForms[record.id] ? (
                                    <ChevronUp className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                        </div>

                        {/* ✅ Smoothly Expandable Details */}
                        <AnimatePresence>
                            {expandedForms[record.id] && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="mt-2 p-4 bg-gray-100 rounded overflow-hidden"
                                >
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Date:</span> {new Date(record.date_of_incident).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-700"><span className="font-semibold">Time:</span> {record.time_of_incident}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Place:</span> {record.place_of_incident}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Recorded On:</span> {new Date(record.created_at).toLocaleString()}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Recorded By:</span> {record.school_nurse?.fname} {record.school_nurse?.lname}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Description:</span> {record.history}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Injury:</span> {record.description_of_injury || "N/A"}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Management:</span> {record.management}</p>
                                    {record.hospital_specification && (
                                        <p className="text-gray-700"><span className="font-semibold">Hospital:</span> {record.hospital_specification}</p>
                                    )}
                                    <p className="text-gray-700">
                                        <span className="font-semibold">School Nurse:</span> {record.school_nurse?.fname} {record.school_nurse?.lname}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">School Physician:</span> {record.school_physician?.fname} {record.school_physician?.lname} {record.school_physician?.ext}
                                    </p>

                                    <div className="flex justify-end mt-4 space-x-3">
                                        {/* View Button */}
                                        <Button
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                            onClick={() => onView(record.id)}
                                        >
                                            <Eye size={18} />
                                            View
                                        </Button>

                                        {/* Print Button */}
                                        <Button
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                                            onClick={() => onPreview(record.id)}
                                        >
                                            <Printer size={18} />
                                            Print
                                        </Button>

                                        {/* Edit Button */}
                                        <Button
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                                            onClick={() => setEditForm({ open: true, record })}
                                        >
                                            <Pencil size={18} />
                                            Edit
                                        </Button>

                                        {/* Delete Button */}
                                        <Button
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                                            onClick={() => handleDeleteClick(record.id)}
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                ))
            ) : (
                <p className="text-gray-500">No incident reports found.</p>
            )}

            {editForm.open && (
                <EditIncidentForm
                    open={editForm.open}
                    setOpen={(val) => setEditForm({ ...editForm, open: val })}
                    patient={patient}
                    existingData={editForm.record}
                />
            )}

            <ConfirmationModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Incident Report"
                message="Are you sure you want to delete this incident report? This action cannot be undone."
                actionType="Remove"
            />

            {pageLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Smooth Spinning Loader */}
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-red-500 border-l-red-400 border-r-red-300 border-b-red-200"></div>
                        <p className="mt-4 text-red-300 text-lg font-semibold animate-pulse">
                            Deleting, please wait...
                        </p>
                    </motion.div>
                </div>
            )}

        </div>
    );
};

export default IncidentRecords;
