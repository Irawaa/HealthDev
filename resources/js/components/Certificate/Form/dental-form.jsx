import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const DentalForm = ({ onSave, setOpen }) => {
    const [formData, setFormData] = useState({
        procedures: [],
        remarks: "",
        schoolNurse: "",
        schoolDentist: "",
    });

    const handleCheckboxChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            procedures: prev.procedures.includes(value)
                ? prev.procedures.filter((v) => v !== value)
                : [...prev.procedures, value],
        }));
    };

    const handleSelectChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        setOpen(false);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="max-h-[60vh] overflow-y-auto px-2 space-y-4">
                <label className="font-bold text-lg">Dental Procedures:</label>
                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                    {["Mouth Examination", "Gum Treatment", "Oral Prophylaxis", "Extraction"].map((procedure) => (
                        <div key={procedure} className="flex items-center space-x-2">
                            <Checkbox checked={formData.procedures.includes(procedure)} onCheckedChange={() => handleCheckboxChange(procedure)} />
                            <label>{procedure}</label>
                        </div>
                    ))}
                </div>

                <label className="font-bold text-lg">Remarks:</label>
                <Textarea name="remarks" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Enter remarks..." className="w-full border border-gray-300 p-2 rounded-md" />

                <div className="border-t border-gray-300 my-4"></div>

                <label className="font-bold text-lg">School Nurse:</label>
                <Select onValueChange={(value) => handleSelectChange("schoolNurse", value)}>
                    <SelectTrigger className="w-full border border-gray-300 p-2 rounded-md">
                        <SelectValue placeholder="Select School Nurse" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Nurse A">Nurse A</SelectItem>
                        <SelectItem value="Nurse B">Nurse B</SelectItem>
                    </SelectContent>
                </Select>

                <div className="border-t border-gray-300 my-4"></div>

                <label className="font-bold text-lg">School Dentist:</label>
                <Select onValueChange={(value) => handleSelectChange("schoolDentist", value)}>
                    <SelectTrigger className="w-full border border-gray-300 p-2 rounded-md">
                        <SelectValue placeholder="Select School Dentist" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Dentist A">Dentist A</SelectItem>
                        <SelectItem value="Dentist B">Dentist B</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                onClick={() => window.print()}
                className="w-full bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 mt-4">
                Save & Print
            </Button>
        </div>
    );
};

export default DentalForm;
