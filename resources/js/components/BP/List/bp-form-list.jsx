import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Eye, Printer, Pencil, Trash2 } from "lucide-react";

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

const BPFormList = ({
    bpForms,
    expandedForms,
    toggleForm,
    onView,
    onPreview,
    handleEditClick,
    handleDeleteClick
}) => {
    return (
        <div className="mt-4 space-y-3">
            {bpForms.length > 0 ? (
                bpForms.map((form) => (
                    <motion.div
                        key={form.id}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-green-300 transition hover:shadow-2xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Title Card */}
                        <div className="flex justify-between items-center cursor-pointer">
                            <div>
                                <h3 className="text-lg font-semibold text-green-600">
                                    BP Form #{form.id}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Recorded: {formatDateTime(form.created_at)}
                                </p>
                            </div>
                            {/* Button for expanding/collapsing */}
                            <button
                                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-green-500 hover:via-green-600 hover:to-green-700 transition"
                                onClick={() => toggleForm(form.id)}
                            >
                                {expandedForms[form.id] ? (
                                    <ChevronUp size={20} className="text-white" />
                                ) : (
                                    <ChevronDown size={20} className="text-white" />
                                )}
                                {expandedForms[form.id] ? "Collapse" : "Expand"}
                            </button>
                        </div>

                        {/* Nested BP Readings - Show only when expanded */}
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: expandedForms[form.id] ? "auto" : 0,
                                opacity: expandedForms[form.id] ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className={`overflow-hidden ${expandedForms[form.id] ? "mt-3" : ""}`}
                        >
                            <div className="space-y-3 bg-green-50 border border-green-200 p-4 rounded-md shadow-sm">
                                <div className="grid grid-cols-2 gap-3 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Status:</span> {form.status}
                                    </p>
                                    <p><span className="font-semibold">Recorded:</span> {formatDateTime(form.created_at)}</p>
                                </div>

                                {/* BP Readings Table */}
                                {form.readings.length > 0 ? (
                                    <div className="overflow-x-auto bg-white border border-green-200 rounded-lg shadow-md">
                                        <table className="min-w-full text-left">
                                            <thead className="bg-green-100 text-gray-700">
                                                <tr>
                                                    <th className="px-4 py-2">Date</th>
                                                    <th className="px-4 py-2">Time</th>
                                                    <th className="px-4 py-2">BP</th>
                                                    <th className="px-4 py-2">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700">
                                                {form.readings.map((reading) => (
                                                    <tr key={reading.id} className="border-b hover:bg-gray-50">
                                                        <td className="px-4 py-2">{reading.date}</td>
                                                        <td className="px-4 py-2">{reading.time}</td>
                                                        <td className="px-4 py-2">{reading.blood_pressure}</td>
                                                        <td className="px-4 py-2">{reading.remarks || "None"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No readings recorded.</p>
                                )}
                                
                                <div className="border-t border-green-300 mt-3 pt-3" />

                                {/* Action Buttons inside expanded section */}
                                <div className="flex justify-end gap-3 mt-3">
                                    {/* Separator between content and buttons */}
                                    <motion.button
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                                        onClick={() => onView(form.id)}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Eye size={18} />
                                        View
                                    </motion.button>

                                    <motion.button
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
                                        onClick={() => onPreview(form.id)}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Printer size={18} />
                                        Print
                                    </motion.button>

                                    <motion.button
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                                        onClick={() => handleEditClick(form)}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Pencil size={18} />
                                        Edit
                                    </motion.button>

                                    <motion.button
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
                                        onClick={() => handleDeleteClick(form.id)}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Trash2 size={18} />
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))
            ) : (
                <p className="text-green-700 text-center">No BP forms found.</p>
            )}
        </div>
    );
};

export default BPFormList;
