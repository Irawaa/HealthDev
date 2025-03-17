import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const DentalForm = ({ onSave, setOpen, patient }) => {
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
        <div className="w-full max-w-lg mx-auto p-4 bg-green-50 shadow-lg rounded-lg border border-green-300">
            <div className="max-h-[60vh] overflow-y-auto px-2 space-y-4">
                <label className="font-bold text-lg text-green-900">Dental Procedures:</label>
                <div className="grid grid-cols-2 gap-2 border-b border-green-300 pb-2">
                    {["Mouth Examination", "Gum Treatment", "Oral Prophylaxis", "Extraction"].map((procedure) => (
                        <div key={procedure} className="flex items-center space-x-2">
                            <Checkbox
                                checked={formData.procedures.includes(procedure)}
                                onCheckedChange={(checked) => handleCheckboxChange(procedure)}
                                className="text-green-600 border-green-500 focus:ring-green-400"
                            />
                            <label className="text-green-800">{procedure}</label>
                        </div>
                    ))}
                </div>

                <label className="font-bold text-lg text-green-900">Remarks:</label>
                <Textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Enter remarks..."
                    className="w-full border border-green-400 p-2 rounded-md focus:ring-2 focus:ring-green-500"
                />

                <div className="border-t border-green-300 my-4"></div>

                <div className="border-t border-green-300 my-4"></div>

                <label className="font-bold text-lg text-green-900">School Dentist:</label>
                <Select onValueChange={(value) => handleSelectChange("schoolDentist", value)}>
                    <SelectTrigger className="w-full border border-green-400 p-2 rounded-md bg-white text-green-800 hover:bg-green-100">
                        <SelectValue placeholder="Select School Dentist" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-50 border border-green-300">
                        <SelectItem value="Dentist A" className="hover:bg-green-200">Dentist A</SelectItem>
                        <SelectItem value="Dentist B" className="hover:bg-green-200">Dentist B</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Button Group */}
            <div className="flex gap-4 mt-4">
                <Button
                    onClick={handleSubmit}
                    className="w-1/2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all">
                    Save
                </Button>
                <Button
                    onClick={() => window.print()}
                    className="w-1/2 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-all">
                    Print
                </Button>
            </div>
        </div>
    );
};

export default DentalForm;


                {/* <label className="font-bold text-lg text-green-900">School Nurse:</label>
                <Select onValueChange={(value) => handleSelectChange("schoolNurse", value)}>
                    <SelectTrigger className="w-full border border-green-400 p-2 rounded-md bg-white text-green-800 hover:bg-green-100">
                        <SelectValue placeholder="Select School Nurse" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-50 border border-green-300">
                        <SelectItem value="Nurse A" className="hover:bg-green-200">Nurse A</SelectItem>
                        <SelectItem value="Nurse B" className="hover:bg-green-200">Nurse B</SelectItem>
                    </SelectContent>
                </Select> */}