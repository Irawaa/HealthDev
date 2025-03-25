import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Printer, Trash2, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "@/components/confirmation-modal";
import CertificateForm from "@/components/Certificate/Form/certificate-form"; // ✅ Import the CertificateForm

const CertificateList = ({ patient }) => {
    const [filterType, setFilterType] = useState("medical");
    const [expanded, setExpanded] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedCertId, setSelectedCertId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState(null);

    const filteredCertificates =
        filterType === "medical"
            ? patient?.medical_certificates ?? []
            : patient?.dental_certificates ?? [];

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const onView = (id) => {
        window.open(`/${filterType}-certificates/${id}/pdf`, "_blank");
    };

    const onPreview = (id) => {
        const printWindow = window.open(`/${filterType}-certificates/preview/${id}`, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        }
    };

    const onEdit = (certificate) => {
        setEditingCertificate(certificate); // Prefill the data
        setEditMode(true); // Open the form in edit mode
    };

    const handleDeleteClick = (id) => {
        setSelectedCertId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedCertId) return;

        setPageLoading(true);

        router.delete(route(`${filterType}-certificates.destroy`, selectedCertId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${filterType.charAt(0).toUpperCase() + filterType.slice(1)} certificate deleted successfully!`);
                setExpanded(null);
            },
            onError: () => {
                toast.error(`Failed to delete the ${filterType} certificate.`);
            },
            onFinish: () => {
                setConfirmOpen(false);
                setSelectedCertId(null);
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
                        {/* Clickable Header */}
                        <div
                            className="flex justify-between items-center cursor-pointer p-2 border-b border-gray-300"
                            onClick={() => toggleExpand(cert.id)}
                        >
                            <p className="font-semibold text-gray-800">
                                <span className="text-green-700">
                                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)} Certificate #{index + 1}
                                </span>
                            </p>
                            {expanded === cert.id ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {/* Expandable Details */}
                        <AnimatePresence>
                            {expanded === cert.id && (
                                <motion.div
                                    initial={{ opacity: 0, maxHeight: 0 }}
                                    animate={{ opacity: 1, maxHeight: "500px" }}
                                    exit={{ opacity: 0, maxHeight: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 bg-gray-50 rounded overflow-hidden"
                                >
                                    {filterType === "medical" ? (
                                        <>
                                            <p><strong>Diagnosis:</strong> {cert.diagnosis}</p>
                                            <p><strong>Purpose:</strong> {cert.purpose}</p>
                                            <p><strong>Recommendation:</strong> 
                                                {["Return to Class", "Sent Home", "Hospitalized"][cert.recommendation]}
                                            </p>
                                            <p><strong>Physician:</strong> {cert.school_physician?.fname} {cert.school_physician?.lname}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Procedures:</strong> 
                                                {["Mouth Examination", "Gum Treatment", "Oral Prophylaxis", "Extraction"]
                                                    .filter((_, i) => cert[Object.keys(cert)[i + 2]])
                                                    .join(", ")}
                                            </p>
                                            <p><strong>Remarks:</strong> {cert.remarks}</p>
                                            <p><strong>Dentist:</strong> {cert.school_dentist?.fname} {cert.school_dentist?.lname}</p>
                                        </>
                                    )}

                                    {/* 📌 Action Buttons */}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => onView(cert.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                        >
                                            <Eye size={18} /> View
                                        </button>

                                        <button
                                            onClick={() => onPreview(cert.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                                        >
                                            <Printer size={18} /> Print
                                        </button>

                                        <button
                                            onClick={() => onEdit(cert)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                                        >
                                            <Edit3 size={18} /> Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteClick(cert.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                                        >
                                            <Trash2 size={18} /> Delete
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))
            ) : (
                <p className="text-green-600 text-center mt-4">No certificates available.</p>
            )}

            {/* Edit Form Modal */}
            {editMode && (
                <CertificateForm
                    open={editMode}
                    setOpen={setEditMode}
                    patient={patient}
                    certificate={editingCertificate} // Pass prefilled data
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={`Delete ${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Certificate`}
                message={`Are you sure you want to delete this ${filterType} certificate? This action cannot be undone.`}
                actionType="Remove"
            />
        </div>
    );
};

export default CertificateList;
