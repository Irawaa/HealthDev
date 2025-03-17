import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Printer, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "@/components/confirmation-modal";

const CertificateList = ({ patient }) => {
    const [filterType, setFilterType] = useState("medical"); // Default: Medical Certificates
    const [expanded, setExpanded] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedMedCertId, setSelectedMedCertId] = useState(null);

    // ✅ Ensure patient & medical_certificates exist before accessing
    const filteredCertificates =
        filterType === "medical"
            ? patient?.medical_certificates ?? [] // Use default empty array if undefined
            : []; // Replace [] with dental_certificates when available

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const onView = (id) => {
        window.open(`/medical-certificates/${id}/pdf`, "_blank");
    };

    const onPreview = (id) => {
        const printWindow = window.open(`/medical-certificates/preview/${id}`, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus(); // Ensure it's in focus
                printWindow.print(); // Auto-trigger print dialog
            };
        }
    };
    const handleDeleteClick = (id) => {
        setSelectedMedCertId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedMedCertId) return;

        setPageLoading(true);

        router.delete(route("medical-certificates.destroy", selectedMedCertId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Medical certificate deleted successfully!");
                setExpanded(null); // Close any open details
            },
            onError: (errors) => {
                toast.error("Failed to delete the medical certificate.");
                console.error("Delete Error:", errors);
            },
            onFinish: () => {
                setConfirmOpen(false);
                setSelectedMedCertId(null);
                setPageLoading(false);
            },
        });
    };

    return (
        <div className="mt-4">
            {/* 🔽 Dropdown Filter */}
            <div className="mb-4">
                <label className="font-semibold text-green-700">Filter Certificates:</label>
                <select
                    className="w-full border border-green-500 rounded-md p-2 bg-white focus:ring-2 focus:ring-green-600 transition mt-2"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="medical">Medical Certificates</option>
                    <option value="dental">Dental Certificates</option>
                </select>
            </div>

            {/* 📄 Display Certificates */}
            {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert, index) => (
                    <div key={cert.id} className="bg-white p-4 rounded-lg shadow my-2">
                        {/* 🔽 Clickable Header */}
                        <div
                            className="flex justify-between items-center cursor-pointer p-2 border-b border-gray-300"
                            onClick={() => toggleExpand(cert.id)}
                        >
                            <p className="font-semibold text-gray-800">
                                <span className="text-green-700">Medical Certificate #{index + 1}</span>
                            </p>
                            {expanded === cert.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                        </div>

                        {/* ✅ Expandable Details */}
                        <AnimatePresence>
                            {expanded === cert.id && (
                                <motion.div
                                    initial={{ opacity: 0, maxHeight: 0, y: -10 }}
                                    animate={{ opacity: 1, maxHeight: "500px", y: 0 }}
                                    exit={{ opacity: 0, maxHeight: 0, y: -10 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="p-4 bg-gray-50 rounded overflow-hidden"
                                >
                                    <p className="text-gray-700"><strong>Diagnosis:</strong> {cert.diagnosis}</p>
                                    <p className="text-gray-700"><strong>Date:</strong> {cert.advised_medication_rest}</p>
                                    <p className="text-gray-700"><strong>Purpose:</strong> {cert.purpose}</p>
                                    <p className="text-gray-700"><strong>Recommendation:</strong>
                                        {cert.recommendation === 0 ? "Return to Class"
                                            : cert.recommendation === 1 ? "Sent Home"
                                                : "Hospitalized"}
                                    </p>
                                    <p className="text-gray-700"><strong>Clearance Status:</strong>
                                        {cert.clearance_status === 1 ? "Needs Further Evaluation" : "Cleared"}
                                    </p>
                                    <p className="text-gray-700"><strong>Physician:</strong>
                                        {cert.school_physician?.fname} {cert.school_physician?.lname} (Lic: {cert.school_physician?.license_no})
                                    </p>

                                    {/* 📌 Action Buttons - Aligned to the Right */}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <motion.button
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                            onClick={() => onView(cert.id)}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Eye size={18} />
                                            View
                                        </motion.button>

                                        <motion.button
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                                            onClick={() => onPreview(cert.id)}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Printer size={18} />
                                            Print
                                        </motion.button>

                                        <motion.button
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                                            onClick={() => handleDeleteClick(cert.id)}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 mt-2">No certificates available.</p>
            )}

            {/* ✅ Delete Confirmation Modal */}
            <ConfirmationModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Medical Certificate"
                message="Are you sure you want to delete this medical certificate? This action cannot be undone."
                actionType="Remove"
            />

            {/* ✅ Page Loading Indicator */}
            {pageLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative flex flex-col items-center"
                    >
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

export default CertificateList;
