import { useState } from "react";
import { router } from "@inertiajs/react"; // Import Inertia router
import { Button } from "@/components/ui/button"; // ShadCN button
import { Eye, Trash2, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // ShadCN tabs
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // ShadCN dialog
import { ScrollArea } from "@/components/ui/scroll-area"; // ShadCN scroll area
import ConfirmationModal from "@/components/confirmation-modal"; // Import the Confirmation Modal
import { motion } from "framer-motion"; // Import motion from Framer Motion


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


const PreParticipatoryList = ({ patient, onEdit }) => {
    const preParticipatories = patient?.pre_participatories ?? [];
    const [selectedEval, setSelectedEval] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedEvalId, setSelectedEvalId] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDeleteClick = (id) => {
        setSelectedEvalId(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedEvalId) return;

        setLoading(true);
        router.delete(route("pre-participatory.destroy", selectedEvalId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Evaluation deleted successfully!");
            },
            onError: () => {
                toast.error("Failed to delete evaluation.");
            },
            onFinish: () => {
                setConfirmOpen(false);
                setSelectedEvalId(null);
                setLoading(false);
            },
        });
    };

    return (
        <div className="mt-4 space-y-3">
            {preParticipatories.length > 0 ? (
                preParticipatories.map((evalItem, index) => (
                    <motion.div
                        key={evalItem.id}
                        className="bg-white p-6 rounded-2xl shadow-xl border border-green-300 transition hover:shadow-2xl"
                        initial={{ opacity: 0, y: 20 }} // Initial state: hidden and slightly translated
                        animate={{ opacity: 1, y: 0 }} // Animate to full visibility and default position
                        exit={{ opacity: 0, y: 20 }} // Exit state: hidden and slightly translated
                        transition={{ duration: 0.3 }} // Transition duration
                    >
                        {/* Title Card */}
                        <div className="flex justify-between items-center cursor-pointer">
                            <div>
                                <h3 className="text-lg font-semibold text-green-600">
                                    Pre-Participatory #{index + 1}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Recorded: {formatDateTime(evalItem.created_at)}
                                </p>
                            </div>
                            {/* Button for expanding/collapsing */}
                            <div className="flex gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => setSelectedEval(evalItem)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                        >
                                            <Eye size={18} /> View Details
                                        </Button>
                                    </DialogTrigger>

                                    {selectedEval && (
                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                                            <DialogHeader>
                                                <DialogTitle>Pre-Participatory Details</DialogTitle>
                                            </DialogHeader>

                                            {/* Scrollable Content */}
                                            <ScrollArea className="max-h-[70vh] overflow-auto p-2">
                                                <Tabs defaultValue="interview" className="w-full">
                                                    <TabsList className="flex space-x-4 bg-gray-100 p-2 rounded-md">
                                                        <TabsTrigger value="interview">Interview</TabsTrigger>
                                                        <TabsTrigger value="medical_history">Medical History</TabsTrigger>
                                                        <TabsTrigger value="physical_exams">Physical Exams</TabsTrigger>
                                                        <TabsTrigger value="vital_signs">Vital Signs</TabsTrigger>
                                                    </TabsList>

                                                    <div className="min-h-[300px]">
                                                        <TabsContent value="interview">
                                                            <div className="mt-4">
                                                                {selectedEval.interview?.map((item) => (
                                                                    <div key={item.id} className="p-2 bg-gray-100 my-2 rounded-lg">
                                                                        <strong>Question:</strong> {item.question?.question}
                                                                        <p><strong>Response:</strong> {item.response}</p>
                                                                        {item.remarks && <p><strong>Remarks:</strong> {item.remarks}</p>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="medical_history">
                                                            <div className="mt-4">
                                                                {selectedEval.past_medical_histories?.map((history) => (
                                                                    <div key={history.id} className="p-2 bg-gray-100 my-2 rounded-lg">
                                                                        <strong>Condition:</strong> {history.condition_name}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="physical_exams">
                                                            <div className="mt-4">
                                                                {selectedEval.physical_examinations?.map((exam) => (
                                                                    <div key={exam.id} className="p-2 bg-gray-100 my-2 rounded-lg">
                                                                        <strong>Examination:</strong> {exam.name}
                                                                        <p><strong>Result:</strong> {exam.pivot?.result}</p>
                                                                        {exam.pivot?.remarks && <p><strong>Remarks:</strong> {exam.pivot?.remarks}</p>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="vital_signs">
                                                            <div className="mt-4">
                                                                {selectedEval.vital_signs && (
                                                                    <div className="p-2 bg-gray-100 my-2 rounded-lg">
                                                                        <strong>Blood Pressure:</strong> {selectedEval.vital_signs.bp}
                                                                        <p><strong>Heart Rate:</strong> {selectedEval.vital_signs.hr}</p>
                                                                        <p><strong>Respiratory Rate:</strong> {selectedEval.vital_signs.rr}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TabsContent>
                                                    </div>
                                                </Tabs>
                                            </ScrollArea>
                                        </DialogContent>
                                    )}
                                </Dialog>

                                <Button
                                    onClick={() => onEdit(evalItem)} // Pass the entire evaluation object
                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition"
                                >
                                    <Edit size={18} /> Edit
                                </Button>

                                <Button
                                    onClick={() => handleDeleteClick(evalItem.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                                >
                                    <Trash2 size={18} /> Delete
                                </Button>
                            </div>
                        </div>

                        {/* Detailed Information
                        <div className="space-y-4 bg-green-50 border border-green-200 p-4 mt-4 rounded-lg shadow-sm">
                            <div className="grid grid-cols-2 gap-4 text-gray-700">
                                <p>
                                    <strong>Activity:</strong> {evalItem.activity_specification}
                                </p>
                                <p>
                                    <strong>Final Evaluation:</strong> {evalItem.final_evaluation}
                                </p>
                                <p>
                                    <strong>Cleared For:</strong> {evalItem.not_cleared_for || "No"}
                                </p>
                            </div>
                        </div> */}
                    </motion.div>
                ))
            ) : (
                <p className="text-green-700 text-center">No pre-participatory evaluations found.</p>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Pre-Participatory Evaluation"
                message="Are you sure you want to delete this evaluation? This action cannot be undone."
                actionType="Remove"
            />

            {/* Deletion Loading Overlay */}
            {loading && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    initial={{ opacity: 0 }} // Start from transparent
                    animate={{ opacity: 1 }} // Fade in
                    exit={{ opacity: 0 }} // Fade out when removed
                    transition={{ duration: 0.3 }} // Transition duration
                >
                    <div className="relative flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-red-500 border-l-red-400 border-r-red-300 border-b-red-200"></div>
                        <p className="mt-4 text-red-300 text-lg font-semibold animate-pulse">
                            Deleting, please wait...
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default PreParticipatoryList;
