import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Printer, Trash2, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "@/components/confirmation-modal";
import ReferralForm from "@/components/Referral/Form/referral-form"; // ✅ Import Referral Form

const ReferralList = ({ patient }) => {
    const [filterType, setFilterType] = useState("general");
    const [expanded, setExpanded] = useState(null);
    const [referrals, setReferrals] = useState(patient?.laboratory_exam_referrals ?? []);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedRefId, setSelectedRefId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editingReferral, setEditingReferral] = useState(null);

    useEffect(() => {
        setReferrals(patient?.laboratory_exam_referrals ?? []);
    }, [patient]);

    const generalReferrals = patient?.general_referrals ?? [];
    const labExamReferrals = referrals;
    const filteredReferrals = filterType === "general" ? generalReferrals : labExamReferrals;

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleDeleteClick = (id) => {
        setSelectedRefId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedRefId) return;

        router.delete(route("laboratory-exam-referrals.destroy", selectedRefId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Referral deleted successfully!");
                setReferrals(referrals.filter((ref) => ref.id !== selectedRefId));
                setExpanded(null);
            },
            onError: () => {
                toast.error("Failed to delete the referral.");
            },
            onFinish: () => {
                setConfirmOpen(false);
                setSelectedRefId(null);
            },
        });
    };

    const handlePrint = (id) => {
        const printWindow = window.open(`/referrals/${id}/print`, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        }
    };

    const handleEdit = (referral) => {
        setEditingReferral(referral);
        setEditMode(true);
    };

    return (
        <div className="mt-4">
            {/* 🔽 Filter Dropdown */}
            <div className="mb-4">
                <label className="font-semibold text-green-700">Filter Referrals:</label>
                <select
                    className="w-full border border-green-500 rounded-md p-2 bg-white focus:ring-2 focus:ring-green-600 transition mt-2"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="general">General Referrals</option>
                    <option value="lab_exam">Lab Exam Referrals</option>
                </select>
            </div>

            {/* 📄 Display Referrals */}
            {filteredReferrals.length > 0 ? (
                filteredReferrals.map((ref) => (
                    <div key={ref.id} className="bg-white p-4 rounded-lg shadow my-2">
                        {/* Clickable Header */}
                        <div
                            className="flex justify-between items-center cursor-pointer p-2 border-b border-gray-300"
                            onClick={() => toggleExpand(ref.id)}
                        >
                            <p className="font-semibold text-gray-800">
                                <span className="text-green-700">
                                    {filterType === "general" ? "General Referral" : "Lab Exam Referral"} #{ref.id}
                                </span>
                            </p>
                            {expanded === ref.id ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {/* Expandable Details */}
                        <AnimatePresence>
                            {expanded === ref.id && (
                                <motion.div
                                    initial={{ opacity: 0, maxHeight: 0 }}
                                    animate={{ opacity: 1, maxHeight: "500px" }}
                                    exit={{ opacity: 0, maxHeight: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 bg-gray-50 rounded overflow-hidden"
                                >
                                    {/* Render General Referrals Fields Properly */}
                                    {filterType === "general" ? (
                                        <>
                                            <p><strong>Examined Due To:</strong> {ref.examined_due_to}</p>
                                            <p><strong>Examined On:</strong> {ref.examined_on}</p>
                                            <p><strong>Duration:</strong> {ref.duration} days</p>
                                            <p><strong>Impression:</strong> {ref.impression}</p>
                                            <p><strong>To:</strong> {ref.to}</p>

                                            {/* Display School Nurse */}
                                            <p><strong>Recorded By:</strong> {ref.school_nurse?.fname} {ref.school_nurse?.lname}</p>

                                            {/* Display School Physician */}
                                            <p>
                                                <strong>Physician:</strong> {ref.school_physician?.fname} {ref.school_physician?.lname}
                                                (License No: {ref.school_physician?.license_no})
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Recorded By:</strong> {ref.school_nurse?.fname} {ref.school_nurse?.lname}</p>
                                            <p><strong>Physician:</strong> {ref.school_physician?.fname} {ref.school_physician?.lname} (License: {ref.school_physician?.license_no})</p>

                                            {/* Grid Display for Lab Exam Details */}
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {Object.entries(ref).map(([key, value]) => {
                                                    if (
                                                        typeof value === "number" &&
                                                        !["id", "patient_id", "recorded_by", "updated_by", "school_nurse_id", "school_physician_id"].includes(key)
                                                    ) {
                                                        return (
                                                            <p key={key}>
                                                                <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value ? "Yes" : "No"}
                                                            </p>
                                                        );
                                                    }

                                                    if (key === "others" && value) {
                                                        return (
                                                            <p key={key}>
                                                                <strong>Others:</strong> {value}
                                                            </p>
                                                        );
                                                    }

                                                    return null;
                                                })}
                                            </div>
                                        </>
                                    )}

                                    {/* 📌 Action Buttons */}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                            onClick={() => alert(`Viewing referral #${ref.id}`)}
                                        >
                                            <Eye size={18} /> View
                                        </button>

                                        <button
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                                            onClick={() => handlePrint(ref.id)}
                                        >
                                            <Printer size={18} /> Print
                                        </button>

                                        <button
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                                            onClick={() => handleEdit(ref)}
                                        >
                                            <Edit3 size={18} /> Edit
                                        </button>

                                        <button
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                                            onClick={() => handleDeleteClick(ref.id)}
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
                <p className="text-green-600 text-center mt-4">No referrals available.</p>
            )}

            {/* 📝 Edit Form Modal */}
            {editMode && (
                <ReferralForm
                    open={editMode}
                    setOpen={setEditMode}
                    patient={patient}
                    referral={editingReferral} // Prefill with selected referral data
                />
            )}

            {/* 🔴 Confirmation Modal */}
            <ConfirmationModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Referral"
                message="Are you sure you want to delete this referral? This action cannot be undone."
                actionType="Remove"
            />
        </div>
    );
};

export default ReferralList;
