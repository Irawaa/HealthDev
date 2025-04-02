import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { usePhysicianStaff } from "@/Pages/Patients/ProfilePage"; // Import context

// ✅ Lists for Physical Examination
const bodyParts = [
    "General Survey", "Eyes/Ear/Nose/Throat", "Hearing", "Vision", "Lymph Nodes",
    "Heart", "Lungs", "Abdomen", "Skin", "Extremities",
];

const schoolPhysicians = ["Dr. Smith", "Dr. Johnson", "Dr. Lee"];

const Step3 = ({ formData, setFormData }) => {
    const [expandedSections, setExpandedSections] = useState({ PhysicalExam: true });
    const physicianStaff = usePhysicianStaff();

    const toggleSection = () => {
        setExpandedSections((prev) => ({ ...prev, PhysicalExam: !prev.PhysicalExam }));
    };

    // ✅ Handle updates for physical examinations (Fixed Overwriting Issue)
    const handleExamChange = (part, field, value) => {
        setFormData((prev) => {
            const updatedExams = prev.physical_examinations.map((exam) =>
                exam.name === part ? { ...exam, [field]: value } : exam
            );

            return { ...prev, physical_examinations: updatedExams };
        });
    };

    // ✅ Handle updates for final evaluation
    const handleFinalEvalChange = (field, value) => {
        setFormData((prev) => {
            const updatedFormData = { ...prev, [field]: value };

            // Automatically set 'further_evaluation' when 'final_evaluation' is 1 (Cleared, with recommendations)
            if (field === "final_evaluation" && value === "1") {
                updatedFormData.further_evaluation = prev.further_evaluation || ""; // Ensure it's not null
            }

            // If 'final_evaluation' is 2 (Not Cleared), ensure 'not_cleared_for' is updated as well
            if (field === "final_evaluation" && value === "2") {
                updatedFormData.not_cleared_for = prev.not_cleared_for || ""; // Set a default value if necessary
                updatedFormData.activity_specification = ""; // Set default
            }

            // Handle "Activity, please specify:" - store 'Activity' in the database and handle activity_specification separately
            if (field === "not_cleared_for" && value === "Activity, please specify:") {
                updatedFormData.not_cleared_for = "Activity"; // Store 'Activity' for the enum field
                updatedFormData.activity_specification = "";
            }

            // If 'not_cleared_for' is 'Activity', make sure 'activity_specification' is filled out
            if (field === "not_cleared_for" && value === "Activity") {
                updatedFormData.activity_specification = prev.activity_specification || ""; // Ensure activity_specification has a value
            }

            return updatedFormData;
        });
    };

    // ✅ Handle checkbox changes
    const handleCheckboxChange = (field) => {
        setFormData((prev) => ({
            ...prev,
            [field]: !prev[field], // Toggle the field's boolean value
        }));
    };

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
                                    const exam = formData.physical_examinations?.find((exam) => exam.name === part) || { result: "", remarks: "" };
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

                {/* Final Evaluation Options */}
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="final_evaluation"
                        value="0"
                        checked={formData.final_evaluation === "0"}
                        onChange={(e) => handleFinalEvalChange("final_evaluation", e.target.value)}
                    />
                    <span>Physically fit / Cleared without restrictions</span>
                </label>

                <label className="flex items-center space-x-2 mt-2">
                    <input
                        type="radio"
                        name="final_evaluation"
                        value="1"
                        checked={formData.final_evaluation === "1"}
                        onChange={(e) => handleFinalEvalChange("final_evaluation", e.target.value)}
                    />
                    <span>Cleared, with recommendations for further evaluation or treatment for:</span>
                </label>
                {formData.final_evaluation === "1" && (
                    <input
                        type="text"
                        value={formData.further_evaluation || ""}
                        onChange={(e) => handleFinalEvalChange("further_evaluation", e.target.value)}
                        className="border border-green-400 rounded p-2 w-full focus:ring-green-500 mt-2"
                    />
                )}

                <label className="flex items-center space-x-2 mt-2">
                    <input
                        type="radio"
                        name="final_evaluation"
                        value="2"
                        checked={formData.final_evaluation === "2"}
                        onChange={(e) => handleFinalEvalChange("final_evaluation", e.target.value)}
                    />
                    <span>Not Cleared</span>
                </label>

                {formData.final_evaluation === "2" && (
                    <div className="ml-6 space-y-2 mt-2">
                        {/* Not Cleared For: Options */}
                        {["All sports", "Certain sports", "Activity, please specify:"].map((option, index) => {
                            const value = option === "Activity, please specify:" ? "Activity" : option; // Change value to 'Activity' for 'Activity, please specify:'

                            return (
                                <label key={option} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="not_cleared_for"
                                        value={value} // Use 'Activity' as the value for 'Activity, please specify:'
                                        checked={formData.not_cleared_for === value}
                                        onChange={(e) => handleFinalEvalChange("not_cleared_for", e.target.value)}
                                    />
                                    <span>{option}</span> {/* Display the original text */}
                                </label>
                            );
                        })}

                        {/* Activity Specification */}
                        {formData.not_cleared_for === "Activity" && (
                            <input
                                type="text"
                                value={formData.activity_specification || ""}
                                onChange={(e) => handleFinalEvalChange("activity_specification", e.target.value)}
                                placeholder="Specify the restricted activity"
                                className="border border-green-400 rounded p-2 w-full focus:ring-green-500 mt-2"
                            />
                        )}
                    </div>
                )}
            </div>

            {/* ✅ School Physician Selection - Dynamic from useContext */}
            <div className="mb-4">
                <label className="font-bold text-green-700">
                    School Physician: <span className="text-red-500">*</span>
                </label>
                <Select
                    value={formData.school_physician_id || ""}
                    onValueChange={(value) => handleFinalEvalChange("school_physician_id", value)}
                    required
                    className="mt-2"
                >
                    <SelectTrigger className="w-full border border-green-500 bg-white p-2 rounded-md focus:ring-2 focus:ring-green-600 transition">
                        <SelectValue>
                            {physicianStaff.find((physician) => physician.staff_id == formData.school_physician_id)
                                ? `${physicianStaff.find((physician) => physician.staff_id == formData.school_physician_id)?.lname}, 
                       ${physicianStaff.find((physician) => physician.staff_id == formData.school_physician_id)?.fname} 
                       ${physicianStaff.find((physician) => physician.staff_id == formData.school_physician_id)?.mname || ""} 
                       (Lic: ${physicianStaff.find((physician) => physician.staff_id == formData.school_physician_id)?.license_no})`
                                : "Select School Physician"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {physicianStaff.map((physician) => (
                            <SelectItem key={physician.staff_id} value={physician.staff_id}>
                                {physician.lname}, {physician.fname} {physician.mname || ""} (Lic: {physician.license_no})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default Step3;
