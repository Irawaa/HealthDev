import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import ConfirmationModal from "@/components/confirmation-modal";
import { toast } from "react-hot-toast";
import DentalViewChart from "../components/dental-view-chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react"; // Add icons for actions

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

const DentalRecordsList = ({ patient, onEdit }) => {
    const [records, setRecords] = useState(patient?.dental_records || []);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [previewRecord, setPreviewRecord] = useState(null);
    const [expandedRecord, setExpandedRecord] = useState(null);

    useEffect(() => {
        setRecords(patient?.dental_records || []);
    }, [patient]);

    const handleDeleteClick = (id) => {
        setSelectedRecordId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedRecordId) return;

        setPageLoading(true);

        router.delete(route("dental-records.destroy", selectedRecordId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Dental record deleted successfully!");
                setRecords((prevRecords) => prevRecords.filter((record) => record.id !== selectedRecordId));
            },
            onError: () => {
                toast.error("Failed to delete the dental record.");
            },
            onFinish: () => {
                setConfirmOpen(false);
                setSelectedRecordId(null);
                setPageLoading(false);
            },
        });
    };

    const handlePreview = (record) => {
        setPreviewRecord(record);
    };

    const closePreview = () => {
        setPreviewRecord(null);
    };

    const toggleRecordDetails = (id) => {
        if (expandedRecord === id) {
            setExpandedRecord(null);
        } else {
            setExpandedRecord(id);
        }
    };

    return (
        <div className="space-y-6">
            {records.length > 0 ? (
                records.map((record, index) => (
                    <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
                    >
                        <div className="flex justify-between items-center cursor-pointer">
                            <div>
                                <h3 className="text-lg font-semibold text-green-600">
                                    Dental Record #{index + 1}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Recorded: {formatDateTime(record.created_at)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button onClick={() => handlePreview(record)} className="bg-blue-600 text-white p-2 rounded-md flex items-center gap-2">
                                    <Eye size={16} /> View Chart
                                </Button>
                                <Button onClick={() => onEdit(record)} className="bg-green-600 text-white p-2 rounded-md flex items-center gap-2">
                                    <Pencil size={16} /> Edit
                                </Button>
                                <Button onClick={() => handleDeleteClick(record.id)} className="bg-red-600 text-white p-2 rounded-md flex items-center gap-2">
                                    <Trash2 size={16} /> Delete
                                </Button>
                            </div>
                        </div>

                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: expandedRecord === record.id ? "auto" : 0,
                                opacity: expandedRecord === record.id ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className={`overflow-hidden mt-4`}
                        >
                            <div className="border-t border-green-300 mt-1 pt-3" />
                            <div className="space-y-3 text-gray-700">
                                <p><strong>Gingival Status:</strong> {record.gingival_status}</p>
                                <p><strong>Plaque Deposit:</strong> {record.plaque_deposit}</p>
                                <p><strong>Other Treatments:</strong> {record.other_treatments || "None"}</p>
                                <p><strong>Recommended Treatment:</strong> {record.recommended_treatment || "None"}</p>
                            </div>
                        </motion.div>

                        <Button
                            onClick={() => toggleRecordDetails(record.id)}
                            className="mt-4 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 p-2 rounded-md transition-colors"
                        >
                            {expandedRecord === record.id ? "Hide Details" : "Show Details"}
                        </Button>
                    </motion.div>
                ))
            ) : (
                <p className="text-center text-green-600">No dental records available.</p>
            )}

            <ConfirmationModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Dental Record"
                message="Are you sure you want to delete this dental record? This action cannot be undone."
                actionType="Remove"
            />

            <AnimatePresence>
                {previewRecord && (
                    <Dialog open={!!previewRecord} onOpenChange={closePreview}>
                        <DialogContent className="w-full max-w-5xl p-8 mx-auto bg-white rounded-lg shadow-lg flex flex-col items-center">
                            <DialogHeader className="w-full">
                                <DialogTitle className="text-2xl text-green-700 text-center">
                                    Dental Record Chart Preview
                                </DialogTitle>
                            </DialogHeader>
                            <Button
                                className="absolute top-2 right-2 bg-red-500 text-white z-50"
                                onClick={closePreview}
                            >
                                Close
                            </Button>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="flex justify-center items-center w-full"
                            >
                                <DentalViewChart record={previewRecord} />
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>

            {pageLoading && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="relative flex flex-col items-center"
                    >
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-red-500 border-l-red-400 border-r-red-300 border-b-red-200"></div>
                        <p className="mt-4 text-red-300 text-lg font-semibold animate-pulse">Deleting, please wait...</p>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default DentalRecordsList;
