import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// ✅ Lists for Physical Examination
const bodyParts = [
    "General Survey", "Eyes/Ear/Nose/Throat", "Hearing", "Vision", "Lymph Nodes",
    "Heart", "Lungs", "Abdomen", "Skin", "Extremities",
];

// ✅ Lists for School Staff
const schoolNurses = ["Nurse Alice", "Nurse Bob", "Nurse Charlie"];
const schoolPhysicians = ["Dr. Smith", "Dr. Johnson", "Dr. Lee"];

const Step3 = ({ formData = {}, setFormData = () => { } }) => {
    const [expandedSections, setExpandedSections] = useState({ PhysicalExam: true });

    const toggleSection = () => {
        setExpandedSections((prev) => ({ ...prev, PhysicalExam: !prev.PhysicalExam }));
    };

    // ✅ Handle updates for physical examinations (Fixed Overwriting Issue)
    const handleExamChange = (part, field, value) => {
        setFormData((prev) => {
            const updatedExams = prev.physical_examinations ? [...prev.physical_examinations] : [];
            const index = updatedExams.findIndex((exam) => exam.name === part);

            if (index === -1) {
                updatedExams.push({ name: part, [field]: value });
            } else {
                updatedExams[index] = { ...updatedExams[index], [field]: value };
            }

            return { ...prev, physical_examinations: updatedExams };
        });
    };

    // ✅ Handle updates for final evaluation
    const handleFinalEvalChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            final_evaluation: {
                ...(prev.final_evaluation || {}),
                [field]: value,
            },
        }));
    };

    // ✅ Handle checkbox changes
    const handleCheckboxChange = (field) => {
        handleFinalEvalChange(field, !formData.final_evaluation?.[field]);
    };

    // ✅ Ensure formData structure is always defined
    const {
        cleared,
        requires_evaluation,
        evaluation_details,
        not_cleared,
        specified_activity,
        "Activity, please specify:": activitySpecifyChecked,
        nurse = "",
        physician = "",
    } = formData.final_evaluation || {};

    return (
        <div className="p-4 space-y-6">
            <h3 className="text-xl font-semibold text-green-800">Step 3: Physical Examination & Final Evaluation</h3>

            {/* ✅ Physical Examination Section */}
            <div className="border border-green-400 rounded-lg shadow-sm bg-green-50">
                <button
                    className="w-full flex justify-between p-4 bg-green-200 text-green-900 font-semibold"
                    onClick={toggleSection}
                >
                    Physical Examination <span>{expandedSections.PhysicalExam ? "▲" : "▼"}</span>
                </button>

                {expandedSections.PhysicalExam && (
                    <div className="overflow-x-auto mt-4 p-4">
                        <table className="min-w-full bg-white border border-green-300 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-green-200 text-green-900">
                                    <th className="border border-green-300 px-4 py-2 text-left">Body Part</th>
                                    <th className="border border-green-300 px-4 py-2 text-left">Normal / Abnormal</th>
                                    <th className="border border-green-300 px-4 py-2 text-left">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bodyParts.map((part) => {
                                    const exam = formData.physical_examinations?.find((exam) => exam.name === part) || {};

                                    return (
                                        <tr key={part} className="border-t border-green-300">
                                            <td className="border border-green-300 px-4 py-2 font-semibold text-green-800">{part}</td>

                                            {/* ✅ Normal/Abnormal Selection */}
                                            <td className="border border-green-300 px-4 py-2">
                                                <div className="flex items-center space-x-4">
                                                    {["Normal", "Abnormal"].map((status) => (
                                                        <label key={status} className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                name={`${part}-result`}
                                                                value={status}
                                                                checked={exam.result === status}
                                                                onChange={(e) => handleExamChange(part, "result", e.target.value)}
                                                            />
                                                            <span className={status === "Normal" ? "text-green-800" : "text-red-800"}>{status}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* ✅ Remarks Field */}
                                            <td className="border border-green-300 px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={exam.remarks || ""}
                                                    onChange={(e) => handleExamChange(part, "remarks", e.target.value)}
                                                    placeholder={exam.result === "Abnormal" ? "Describe abnormality" : "Remarks"}
                                                    className="border border-green-400 rounded p-2 w-full focus:ring-green-500"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ✅ Final Evaluation Section */}
            <div className="border border-green-400 rounded-lg shadow-sm bg-green-50 p-4">
                <h4 className="text-lg font-semibold text-green-800">Final Evaluation</h4>

                <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={cleared || false} onChange={() => handleCheckboxChange("cleared")} />
                    <span>Physically fit / Cleared without restrictions</span>
                </label>

                <label className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" checked={requires_evaluation || false} onChange={() => handleCheckboxChange("requires_evaluation")} />
                    <span>Cleared, with recommendations for further evaluation or treatment for:</span>
                </label>
                {requires_evaluation && (
                    <input type="text" value={evaluation_details || ""} onChange={(e) => handleFinalEvalChange("evaluation_details", e.target.value)} className="border border-green-400 rounded p-2 w-full focus:ring-green-500 mt-2" />
                )}

                <label className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" checked={not_cleared || false} onChange={() => handleCheckboxChange("not_cleared")} />
                    <span>Not Cleared:</span>
                </label>

                {not_cleared && (
                    <div className="ml-6 space-y-2 mt-2">
                        {["All Sports", "Certain Sports", "Activity, please specify:"].map((option) => (
                            <label key={option} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.final_evaluation?.[option] || false}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}

                        {/* ✅ Activity Input (Restored) */}
                        {formData.final_evaluation?.["Activity, please specify:"] && (
                            <input
                                type="text"
                                value={specified_activity || ""}
                                onChange={(e) => handleFinalEvalChange("specified_activity", e.target.value)}
                                placeholder="Specify the restricted activity"
                                className="border border-green-400 rounded p-2 w-full focus:ring-green-500 mt-2"
                            />
                        )}
                    </div>
                )}
            </div>


            {/* ✅ Nurse & Physician Dropdowns (Fixed Undefined Values) */}
            <div className="space-y-4">
                <div>
                    <label className="block font-semibold text-green-800 mb-1">School Nurse:</label>
                    <Select value={nurse} onValueChange={(value) => handleFinalEvalChange("nurse", value)}>
                        <SelectTrigger className="border border-gray-300 rounded p-2 w-full bg-white">
                            <SelectValue placeholder="Select Nurse" />
                        </SelectTrigger>
                        <SelectContent>
                            {schoolNurses.map((nurse) => (
                                <SelectItem key={nurse} value={nurse}>{nurse}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block font-semibold text-green-800 mb-1">School Physician:</label>
                    <Select value={physician} onValueChange={(value) => handleFinalEvalChange("physician", value)}>
                        <SelectTrigger className="border border-gray-300 rounded p-2 w-full bg-white">
                            <SelectValue placeholder="Select Physician" />
                        </SelectTrigger>
                        <SelectContent>
                            {schoolPhysicians.map((physician) => (
                                <SelectItem key={physician} value={physician}>{physician}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default Step3;
