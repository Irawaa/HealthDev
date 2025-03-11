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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name, value, checked) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked ? [...prev[name], value] : prev[name].filter((v) => v !== value),
        }));
    };

    const handleSingleCheckboxChange = (name, checked) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleRadioChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        setOpen(false);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-6 bg-green-50 shadow-xl rounded-lg border border-green-400">
            <div className="max-h-[60vh] overflow-y-auto px-3 space-y-5">
                <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address"
                    className="w-full border border-green-500 rounded-md p-2 bg-white focus:ring-2 focus:ring-green-600 transition" />
                <Textarea name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} placeholder="Diagnosis/Impression"
                    className="w-full border border-green-500 rounded-md p-2 bg-white focus:ring-2 focus:ring-green-600 transition" />

                <hr className="border-green-300" />
                <div className="flex items-center space-x-3">
                    <Checkbox checked={formData.advice} onCheckedChange={(checked) => handleSingleCheckboxChange("advice", checked)} />
                    <label className="text-green-700 font-medium">Advised to take medications and rest for:</label>
                </div>
                {formData.advice && (
                    <Input name="adviceDate" type="text" value={formData.adviceDate} onChange={handleInputChange} placeholder="Enter date"
                        className="border border-green-500 p-2 rounded-md w-full focus:ring-2 focus:ring-green-600 transition" />
                )}

                <hr className="border-green-300" />
                <label className="font-bold text-green-700">Purpose:</label>
                {["Excuse Slip", "Off-school activity", "OJT", "Sports", "ROTC", "Others:"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <Checkbox checked={formData.purpose.includes(option)} onCheckedChange={(checked) => handleCheckboxChange("purpose", option, checked)} />
                        <label className="text-green-700">{option}</label>
                    </div>
                ))}
                {formData.purpose.includes("Others:") && (
                    <Input name="otherPurpose" value={formData.otherPurpose} onChange={handleInputChange} placeholder="Specify other purpose"
                        className="border border-green-500 p-2 rounded-md w-full focus:ring-2 focus:ring-green-600 transition" />
                )}

                <hr className="border-green-300" />
                <label className="font-bold text-green-700">Recommendations:</label>
                {["Return to Class", "Sent home", "To hospital of choice"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <Checkbox checked={formData.recommendations.includes(option)} onCheckedChange={(checked) => handleCheckboxChange("recommendations", option, checked)} />
                        <label className="text-green-700">{option}</label>
                    </div>
                ))}

                <hr className="border-green-300" />
                <label className="font-bold text-green-700">Clearance:</label>
                {["Cleared without restrictions", "Further evaluation", "Not Cleared"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <Checkbox checked={formData.fitnessStatus === option} onCheckedChange={(checked) => handleRadioChange("fitnessStatus", checked ? option : "")} />
                        <label className="text-green-700">{option}</label>
                    </div>
                ))}
                {formData.fitnessStatus === "Further evaluation" && (
                    <Input name="fitnessNotes" value={formData.fitnessNotes} onChange={handleInputChange} placeholder="Specify condition"
                        className="border border-green-500 p-2 rounded-md w-full focus:ring-2 focus:ring-green-600 transition" />
                )}
                {formData.fitnessStatus === "Not Cleared" && (
                    <>
                        {["All sports", "Certain sports", "Activity:"].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox checked={formData.restrictedActivities.includes(option)} onCheckedChange={(checked) => handleCheckboxChange("restrictedActivities", option, checked)} />
                                <label className="text-green-700">{option}</label>
                            </div>
                        ))}
                        {formData.restrictedActivities.includes("Activity:") && (
                            <Input name="specifiedActivity" value={formData.specifiedActivity} onChange={handleInputChange} placeholder="Specify restricted activity"
                                className="border border-green-500 p-2 rounded-md w-full focus:ring-2 focus:ring-green-600 transition" />
                        )}
                    </>
                )}

                <hr className="border-green-300" />
                <label className="font-bold text-green-700">School Nurse:</label>
                <Select onValueChange={(value) => handleSelectChange("schoolNurse", value)}>
                    <SelectTrigger className="w-full border border-green-500 bg-white p-2 rounded-md focus:ring-2 focus:ring-green-600 transition">
                        <SelectValue placeholder="Select School Nurse" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Nurse A">Nurse A</SelectItem>
                        <SelectItem value="Nurse B">Nurse B</SelectItem>
                    </SelectContent>
                </Select>

                <hr className="border-green-300" />
                <label className="font-bold text-green-700">School Physician:</label>
                <Select onValueChange={(value) => handleSelectChange("schoolPhysician", value)}>
                    <SelectTrigger className="w-full border border-green-500 bg-white p-2 rounded-md focus:ring-2 focus:ring-green-600 transition">
                        <SelectValue placeholder="Select School Physician" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Physician A">Physician A</SelectItem>
                        <SelectItem value="Physician B">Physician B</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-4 mt-5">
                <Button onClick={handleSubmit} className="w-1/2 bg-green-600 hover:bg-green-700 text-white">Save</Button>
                <Button onClick={() => window.print()} className="w-1/2 bg-green-700 hover:bg-green-800 text-white">Print</Button>
            </div>
        </div>
    );
};

export default MedicalForm;
