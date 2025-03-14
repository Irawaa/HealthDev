import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Printer, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import EditFDARModal from "./FDARSteps/edit-fdar-forms"; // ✅ Use the modal

const FDARRecords = ({ fdarForms, onEdit, onDelete }) => {
    const [expandedForms, setExpandedForms] = useState({});
    const [editingForm, setEditingForm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const toggleForm = (id) => {
        setExpandedForms((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const onView = (id) => {
        window.open(`/fdar/${id}/pdf`, "_blank");
    };

    const onPreview = (id) => {
        const printWindow = window.open(`/fdar/preview/${id}`, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus(); // Ensure it's in focus
                printWindow.print(); // Auto-trigger print dialog
            };
        }
    };

    const handleEditClick = (fdarData) => {
        const common_disease_ids = fdarData.all_diseases
            ? fdarData.all_diseases
                .filter(d => d.common_disease_id !== null)
                .map(d => d.common_disease_id)
            : [];

        const custom_diseases = fdarData.all_diseases
            ? fdarData.all_diseases
                .filter(d => d.custom_disease !== null)
                .map(d => d.custom_disease)
            : [];

        setEditingForm({
            ...fdarData,
            common_disease_ids,
            custom_diseases,
        });

        setIsModalOpen(true);
    };

    const handleSaveEdit = (updatedForm) => {
        onEdit(updatedForm);
        setIsModalOpen(false);
        setEditingForm(null);
    };

    return (
        <div className="mt-4 space-y-3">
            {fdarForms.length > 0 ? (
                fdarForms.map((form) => (
                    <motion.div
                        key={form.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 transition hover:shadow-lg"
                    >
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleForm(form.id)}
                        >
                            <p className="font-medium text-gray-800">
                                <span className="font-semibold">FDAR Entry:</span>{" "}
                                {new Date(form.created_at).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                            <div className="flex items-center gap-3">
                                {expandedForms[form.id] ? (
                                    <ChevronUp size={20} className="text-gray-600" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-600" />
                                )}
                            </div>
                        </div>

                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: expandedForms[form.id] ? "auto" : 0,
                                opacity: expandedForms[form.id] ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className={`overflow-hidden ${expandedForms[form.id] ? "mt-3" : ""}`}
                        >
                            <div className="space-y-2 bg-gray-50 border border-gray-300 p-4 rounded-md shadow-sm">
                                <div className="grid grid-cols-2 gap-3 text-gray-700">
                                    {/* FDAR Main Structure */}
                                    <p>
                                        <span className="font-semibold">Focus:</span> {form.all_diseases && form.all_diseases.length > 0
                                            ? form.all_diseases.map(d => d.disease_name || d.custom_disease).join(", ")
                                            : "No specific disease recorded"}
                                    </p>
                                    <p><span className="font-semibold">Data:</span> {form.data || "No data recorded"}</p>
                                    <p><span className="font-semibold">Action:</span> {form.action || "No action recorded"}</p>
                                    <p><span className="font-semibold">Response:</span> {form.response || "No response recorded"}</p>

                                    {/* Medical Information Section */}
                                    <div className="col-span-2 border-t border-gray-300 pt-2 mt-2">
                                        <p><span className="font-semibold">Blood Pressure:</span> {form.blood_pressure || "N/A"}</p>
                                        <p><span className="font-semibold">Weight:</span> {form.weight || "N/A"} kg</p>
                                        <p><span className="font-semibold">Height:</span> {form.height || "N/A"} m</p>
                                        <p><span className="font-semibold">Temperature:</span> {form.temperature || "N/A"}°C</p>
                                        <p><span className="font-semibold">Oxygen Saturation:</span> {form.oxygen_saturation || "N/A"}%</p>
                                        <p><span className="font-semibold">Cardiac Rate:</span> {form.cardiac_rate || "N/A"} bpm</p>
                                        <p><span className="font-semibold">Respiratory Rate:</span> {form.respiratory_rate || "N/A"} bpm</p>
                                        {form.last_menstrual_period && (
                                            <p><span className="font-semibold">Last Menstrual Period:</span> {form.last_menstrual_period}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-3">
                                    {/* View Button */}
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                        onClick={() => onView(form.id)}
                                    >
                                        <Eye size={18} />
                                        View
                                    </button>

                                    {/* Print Button */}
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                                        onClick={() => onPreview(form.id)}
                                    >
                                        <Printer size={18} />
                                        Print
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                                        onClick={() => handleEditClick(form)}
                                    >
                                        <Pencil size={18} />
                                        Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                                        onClick={() => onDelete(form.id)}
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
                <p className="text-green-700 text-center">No FDAR records found.</p>
            )}

            {previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
                        <button
                            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full"
                            onClick={() => setPreviewUrl(null)}
                        >
                            Close
                        </button>
                        <iframe src={previewUrl} className="w-full h-[500px]"></iframe>
                    </div>
                </div>
            )}

            {/* ✅ Render EditFDARModal when editingForm is set */}
            {editingForm && (
                <EditFDARModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingForm(null);
                    }}
                    formData={editingForm}
                    handleChange={(e) =>
                        setEditingForm((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default FDARRecords;
