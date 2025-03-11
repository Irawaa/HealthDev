import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const MedicalForm = ({ onSave, setOpen }) => {
    const [formData, setFormData] = useState({
        address: "",
        diagnosis: "",
        advice: false,
        adviceDate: "",
        purpose: [],
        otherPurpose: "",
        recommendations: [],
        schoolNurse: "",
        schoolPhysician: "",
        fitnessStatus: "",
        fitnessNotes: "",
        restrictedActivities: [],
        specifiedActivity: "",
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: prev[name].includes(value)
                ? prev[name].filter((v) => v !== value)
                : [...prev[name], value],
        }));
    };

    const handleSingleCheckboxChange = (name) => {
        setFormData((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const handleRadioChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: prev[name] === value ? "" : value, // Toggle off if clicked again
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        setOpen(false);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="max-h-[60vh] overflow-y-auto px-2">
                <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full mb-4" // Added margin-bottom for spacing
                />
                <Textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    placeholder="Diagnosis/Impression"
                    className="w-full"
                />

                <div className="border-t border-gray-300 my-4"></div>

                <div className="flex flex-wrap items-center space-x-2">
                    <Checkbox checked={formData.advice} onCheckedChange={() => handleSingleCheckboxChange("advice")} />
                    <label className="whitespace-nowrap">Advised to take medications and rest for:</label>
                    {formData.advice && (
                        <Input name="adviceDate" type="text" value={formData.adviceDate} onChange={handleInputChange} placeholder="Enter date" className="w-full sm:w-auto" />
                    )}
                </div>

                <div className="border-t border-gray-300 my-4"></div>

                <div className="space-y-2">
                    <label className="font-bold block">Purpose:</label>
                    {["Excuse Slip", "Off-school activity", "OJT", "Sports", "ROTC", "Others:"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox checked={formData.purpose.includes(option)} onCheckedChange={() => handleCheckboxChange("purpose", option)} />
                            <label className="whitespace-nowrap">{option}</label>
                            {option === "Others" && formData.purpose.includes("Others") && (
                                <Input name="otherPurpose" value={formData.otherPurpose} onChange={handleInputChange} className="w-full" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-300 my-4"></div>

                <div className="space-y-2">
                    <label className="font-bold block">Recommendations:</label>
                    {["Return to Class", "Sent home", "To hospital of choice"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox checked={formData.recommendations.includes(option)} onCheckedChange={() => handleCheckboxChange("recommendations", option)} />
                            <label className="whitespace-nowrap">{option}</label>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-300 my-4"></div>

                <div className="space-y-2">
                    <label className="font-bold block">Clearance:</label>
                    <div className="flex items-center space-x-2">
                        <Checkbox checked={formData.fitnessStatus === "cleared"} onCheckedChange={() => handleRadioChange("fitnessStatus", "cleared")} />
                        <label>Physically fit / Cleared without restrictions</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox checked={formData.fitnessStatus === "clearedWithEval"} onCheckedChange={() => handleRadioChange("fitnessStatus", "clearedWithEval")} />
                        <label>Cleared, with recommendations for further evaluation or treatment for:</label>
                        {formData.fitnessStatus === "clearedWithEval" && (
                            <Input name="fitnessNotes" value={formData.fitnessNotes} onChange={handleInputChange} className="w-full" />
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox checked={formData.fitnessStatus === "notCleared"} onCheckedChange={() => handleRadioChange("fitnessStatus", "notCleared")} />
                        <label>Not Cleared:</label>
                    </div>

                    {formData.fitnessStatus === "notCleared" && (
                        <div className="space-y-2 pl-4">
                            {["All sports", "Certain sports", "Activity"].map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <Checkbox checked={formData.restrictedActivities.includes(option)} onCheckedChange={() => handleCheckboxChange("restrictedActivities", option)} />
                                    <label>{option}</label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <label>Please specify:</label>
                                <Input name="specifiedActivity" value={formData.specifiedActivity} onChange={handleInputChange} className="w-full" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-300 my-4"></div>

                <div className="space-y-2">
                    <label className="font-bold block">School Nurse:</label>
                    <Select onValueChange={(value) => setFormData({ ...formData, schoolNurse: value })}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select School Nurse" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Nurse A">Nurse A</SelectItem>
                            <SelectItem value="Nurse B">Nurse B</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="font-bold block">School Physician:</label>
                    <Select onValueChange={(value) => setFormData({ ...formData, schoolPhysician: value })}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select School Physician" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Physician A">Physician A</SelectItem>
                            <SelectItem value="Physician B">Physician B</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button
                onClick={() => window.print()}
                className="w-full bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 mt-4">
                Save & Print
            </Button>

        </div>
    );
};

export default MedicalForm;
