import { useState } from "react";
import { router } from "@inertiajs/react"; // Import Inertia router
import { Button } from "@/components/ui/button"; // ShadCN button
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // ShadCN tabs
import { Eye, Trash2, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // ShadCN dialog
import { ScrollArea } from "@/components/ui/scroll-area"; // ShadCN scroll area
import ConfirmationModal from "@/components/confirmation-modal"; // Import the Confirmation Modal

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
        <div className="mt-4">
            {preParticipatories.length > 0 ? (
                preParticipatories.map((evalItem) => (
                    <div key={evalItem.id} className="bg-white p-4 rounded-lg shadow my-2 flex justify-between items-center">
                        <div>
                            <p className="text-gray-800">
                                <strong>Activity:</strong> {evalItem.activity_specification}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Final Evaluation:</strong> {evalItem.final_evaluation}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Cleared For:</strong> {evalItem.not_cleared_for || "No"}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {/* View Details Button */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={() => setSelectedEval(evalItem)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                    >
                                        <Eye size={18} /> View
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

                            {/* Edit Button */}
                            <Button
                                onClick={() => onEdit(evalItem)} // Pass the entire evaluation object
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition"
                            >
                                <Edit size={18} /> Edit
                            </Button>

                            {/* Delete Button */}
                            <Button
                                onClick={() => handleDeleteClick(evalItem.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                            >
                                <Trash2 size={18} /> Delete
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-green-600 text-center mt-4">No evaluations available.</p>
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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

export default PreParticipatoryList;
