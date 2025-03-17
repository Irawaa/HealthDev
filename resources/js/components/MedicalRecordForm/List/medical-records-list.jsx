import { useState } from "react";
import { Button } from "@/components/ui/button";
import MedicalRecordDetails from "../Components/medical-records-details";

const MedicalRecordsList = ({ patient }) => {
    const records = patient?.medical_records || [];
    const [selectedRecord, setSelectedRecord] = useState(null);

    return (
        <div>
            {records.length > 0 ? (
                records.map((record, index) => (
                    <div
                        key={index}
                        className="p-4 bg-white shadow-md rounded-lg flex justify-between"
                    >
                        <div>
                            <p><strong>Final Evaluation:</strong> {record.final_evaluation}</p>
                            <p><strong>Plan:</strong> {record.plan_recommendation}</p>
                            <p><strong>Date:</strong> {new Date(record.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="space-x-2">
                            <Button
                                onClick={() => setSelectedRecord(record)}
                                className="bg-blue-600 text-white"
                            >
                                Details
                            </Button>
                            <Button
                                onClick={() => console.log("Edit clicked", record)}
                                className="bg-green-600 text-white"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => console.log("Delete clicked", record.id)}
                                className="bg-red-600 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-700 mt-4">No medical records available.</p>
            )}

            {/* Render MedicalRecordDetails if a record is selected */}
            {selectedRecord && (
                <MedicalRecordDetails
                    record={selectedRecord}
                    onClose={() => setSelectedRecord(null)}
                />
            )}
        </div>
    );
};

export default MedicalRecordsList;
