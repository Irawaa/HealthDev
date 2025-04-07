import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Printer, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import EditIncidentForm from "./incident-reports-edit-form";
import PdfModal from "../react-pdf";
import ConfirmationModal from "../confirmation-modal";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

const formatDateTime = (dateTime) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    return new Date(dateTime).toLocaleDateString("en-US", options);
};

const IncidentRecords = ({ patient }) => {
    const [incidentRecords, setIncidentRecords] = useState([]);
    const [expandedForms, setExpandedForms] = useState({});
    const [editForm, setEditForm] = useState({ open: false, record: null });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);

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

    const handleEditClick = (record) => {
        setEditForm({ open: true, record });
    };

    const onView = (id) => {
        setPreviewUrl(`/incident-reports/${id}/pdf`);
    };

    const onPreview = (id) => {
        const printWindow = window.open(`/incident-reports/preview/${id}`, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedIncidentId(id);
        setConfirmOpen(true);
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
            onError: () => {
                toast.error("Failed to delete the incident report.");
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
                incidentRecords.map((record, index) => (
                    <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-green-300 transition hover:shadow-2xl"
                    >
                        {/* Title Card */}
                        <div className="flex justify-between items-center cursor-pointer">
                            <div>
                                <h3 className="text-lg font-semibold text-green-600">
                                    Incident #{index + 1}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Recorded: {formatDateTime(record.created_at)}
                                </p>
                            </div>
                            <button
                                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-green-500 hover:via-green-600 hover:to-green-700 transition"
                                onClick={() => toggleForm(record.id)}
                            >
                                {expandedForms[record.id] ? (
                                    <ChevronUp size={20} className="text-white" />
                                ) : (
                                    <ChevronDown size={20} className="text-white" />
                                )}
                                {expandedForms[record.id] ? "Collapse" : "Expand"}
                            </button>
                        </div>

                        {/* Expandable Details */}
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: expandedForms[record.id] ? "auto" : 0,
                                opacity: expandedForms[record.id] ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className={`overflow-hidden ${expandedForms[record.id] ? "mt-3" : ""}`}
                        >
                            <div className="space-y-3 bg-green-50 border border-green-200 p-4 rounded-md shadow-sm">
                                <p><span className="font-semibold">Nature of Incident:</span> {record.nature_of_incident}</p>
                                <p><span className="font-semibold">Date:</span> {new Date(record.date_of_incident).toLocaleDateString()}</p>
                                <p><span className="font-semibold">Time:</span> {record.time_of_incident}</p>
                                <p><span className="font-semibold">Place:</span> {record.place_of_incident}</p>
                                <p><span className="font-semibold">Recorded By:</span> {record.school_nurse?.fname} {record.school_nurse?.lname}</p>
                                <p><span className="font-semibold">Description:</span> {record.history}</p>
                                <p><span className="font-semibold">Injury:</span> {record.description_of_injury || "N/A"}</p>
                                <p><span className="font-semibold">Management:</span> {record.management}</p>
                                {record.hospital_specification && (
                                    <p><span className="font-semibold">Hospital:</span> {record.hospital_specification}</p>
                                )}

                                {/* Separator between content and buttons */}
                                <div className="border-t border-green-300 mt-3 pt-3" />

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 mt-3">
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                                        onClick={() => onView(record.id)}
                                    >
                                        <Eye size={18} />
                                        View
                                    </button>

                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
                                        onClick={() => onPreview(record.id)}
                                    >
                                        <Printer size={18} />
                                        Print
                                    </button>

                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                                        onClick={() => setEditForm({ open: true, record })}
                                    >
                                        <Pencil size={18} />
                                        Edit
                                    </button>

                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
                                        onClick={() => handleDeleteClick(record.id)}
                                    >
                                        <Trash2 size={18} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))
            ) : (
                <p className="text-green-700 text-center">No incident reports found.</p>
            )}

            <PdfModal
                isOpen={previewUrl !== null}
                onClose={() => setPreviewUrl(null)}
                pdfUrl={previewUrl}
            />

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
                        transition={{ duration: 0.3 }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Spinning Loader */}
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
