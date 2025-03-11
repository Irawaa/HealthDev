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

    return (
        <div className="w-full max-w-lg mx-auto p-4 bg-green-50 shadow-lg rounded-lg border border-green-300">
            <div className="max-h-[60vh] overflow-y-auto px-2 space-y-4">
                <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full border border-green-400 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                />
                <Textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    placeholder="Diagnosis/Impression"
                    className="w-full border border-green-400 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                />

                <div className="border-t border-green-300 my-4"></div>

                <div className="flex flex-wrap items-center space-x-2">
                    <Checkbox
                        checked={formData.advice}
                        onCheckedChange={() => handleSingleCheckboxChange("advice")}
                        className="text-green-600 border-green-500 focus:ring-green-400"
                    />
                    <label className="text-green-800">Advised to take medications and rest for:</label>
                    {formData.advice && (
                        <Input
                            name="adviceDate"
                            type="text"
                            value={formData.adviceDate}
                            onChange={handleInputChange}
                            placeholder="Enter date"
                            className="w-full sm:w-auto border border-green-400 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                        />
                    )}
                </div>

                <div className="border-t border-green-300 my-4"></div>

                <div className="space-y-2">
                    <label className="font-bold text-green-900">Purpose:</label>
                    {["Excuse Slip", "Off-school activity", "OJT", "Sports", "ROTC", "Others"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                checked={formData.purpose.includes(option)}
                                onCheckedChange={() => handleCheckboxChange("purpose", option)}
                                className="text-green-600 border-green-500 focus:ring-green-400"
                            />
                            <label className="text-green-800">{option}</label>
                        </div>
                    ))}
                </div>

                <div className="border-t border-green-300 my-4"></div>

                <div className="space-y-2">
                    <label className="font-bold text-green-900">Recommendations:</label>
                    {["Return to Class", "Sent home", "To hospital of choice"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                checked={formData.recommendations.includes(option)}
                                onCheckedChange={() => handleCheckboxChange("recommendations", option)}
                                className="text-green-600 border-green-500 focus:ring-green-400"
                            />
                            <label className="text-green-800">{option}</label>
                        </div>
                    ))}
                </div>

                <div className="border-t border-green-300 my-4"></div>

                <label className="font-bold text-green-900">School Nurse:</label>
                <Select onValueChange={(value) => setFormData({ ...formData, schoolNurse: value })}>
                    <SelectTrigger className="w-full border border-green-400 p-2 rounded-md bg-white text-green-800 hover:bg-green-100">
                        <SelectValue placeholder="Select School Nurse" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-50 border border-green-300">
                        <SelectItem value="Nurse A" className="hover:bg-green-200">Nurse A</SelectItem>
                        <SelectItem value="Nurse B" className="hover:bg-green-200">Nurse B</SelectItem>
                    </SelectContent>
                </Select>

                <label className="font-bold text-green-900 mt-4">School Physician:</label>
                <Select onValueChange={(value) => setFormData({ ...formData, schoolPhysician: value })}>
                    <SelectTrigger className="w-full border border-green-400 p-2 rounded-md bg-white text-green-800 hover:bg-green-100">
                        <SelectValue placeholder="Select School Physician" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-50 border border-green-300">
                        <SelectItem value="Physician A" className="hover:bg-green-200">Physician A</SelectItem>
                        <SelectItem value="Physician B" className="hover:bg-green-200">Physician B</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                onClick={() => window.print()}
                className="w-full bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 mt-4 transition-all">
                Save & Print
            </Button>
        </div>
    );
};

export default MedicalForm;
