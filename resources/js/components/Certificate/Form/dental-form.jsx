import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useDentistStaff } from "@/Pages/Patients/ProfilePage";
import { toast } from "react-hot-toast";

const DentalForm = ({ setOpen, patient, certificate = null }) => {
    const dentistStaff = useDentistStaff(); // ✅ Dentist Staff Context
    const isEditMode = Boolean(certificate);

    // ✅ useForm Hook for state and validation
    const { data, setData, put, post, processing, errors } = useForm({
        patient_id: patient?.patient_id || null,
        mouth_examination: false,
        gum_treatment: false,
        oral_prophylaxis: false,
        extraction: false,
        remarks: "",
        school_dentist_id: "",
    });

    // ✅ Prefill form in edit mode
    useEffect(() => {
        if (isEditMode && certificate) {
            setData({
                patient_id: certificate.patient_id,
                mouth_examination: certificate.mouth_examination,
                gum_treatment: certificate.gum_treatment,
                oral_prophylaxis: certificate.oral_prophylaxis,
                extraction: certificate.extraction,
                remarks: certificate.remarks || "",
                school_dentist_id: certificate.school_dentist_id?.toString() || "",
            });
        }
    }, [certificate]);

    // ✅ Checkbox Handler
    const handleCheckboxChange = (field) => {
        setData(field, !data[field]); // Toggle value
    };

    // ✅ Input Handler for Remarks
    const handleInputChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    // ✅ Dropdown Select Handler
    const handleSelectChange = (field, value) => {
        setData(field, value);
    };

    // ✅ Submit Handler
    const handleSubmit = (e) => {
        e.preventDefault();

        const submitRoute = isEditMode
            ? route("dental-certificates.update", certificate.id)
            : route("dental-certificates.store");

        const requestMethod = isEditMode ? put : post;

        requestMethod(submitRoute, {
            onSuccess: () => {
                toast.success(`✅ Dental certificate ${isEditMode ? "updated" : "created"} successfully!`);
                setOpen(false);
            },
            onError: (errors) => {
                Object.values(errors).forEach((message) => toast.error(`❌ ${message}`));
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto p-4 bg-green-50 shadow-lg rounded-lg border border-green-300"
        >
            <div className="max-h-[60vh] overflow-y-auto px-2 space-y-4">

                {/* Dental Procedures */}
                <label className="font-bold text-lg text-green-900">Dental Procedures:</label>
                <div className="grid grid-cols-2 gap-2 border-b border-green-300 pb-2">
                    {[
                        { label: "Mouth Examination", field: "mouth_examination" },
                        { label: "Gum Treatment", field: "gum_treatment" },
                        { label: "Oral Prophylaxis", field: "oral_prophylaxis" },
                        { label: "Extraction", field: "extraction" },
                    ].map(({ label, field }) => (
                        <label key={field} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                                checked={data[field]}
                                onCheckedChange={() => handleCheckboxChange(field)}
                                className="text-green-600 border-green-500 focus:ring-green-400"
                            />
                            <span className="text-green-800">{label}</span>
                        </label>
                    ))}
                </div>

                {/* Remarks */}
                <label className="font-bold text-lg text-green-900">Remarks:</label>
                <Textarea
                    name="remarks"
                    value={data.remarks}
                    onChange={handleInputChange}
                    placeholder="Enter remarks..."
                    className="w-full border border-green-400 p-2 rounded-md focus:ring-2 focus:ring-green-500"
                />
                {errors.remarks && <p className="text-red-500">{errors.remarks}</p>}

                <hr className="border-green-300 my-4" />

                {/* School Dentist Selection */}
                {/* School Dentist Selection */}
                <label className="font-bold text-lg text-green-900">School Dentist:</label>
                <Select
                    value={data.school_dentist_id}
                    onValueChange={(value) => handleSelectChange("school_dentist_id", value)}
                >
                    <SelectTrigger className="w-full border border-green-400 p-2 rounded-md bg-white text-green-800 hover:bg-green-100">
                        <SelectValue>
                            {data.school_dentist_id
                                ? `${dentistStaff.find(dentist => dentist.staff_id.toString() === data.school_dentist_id)?.lname || ''}, 
           ${dentistStaff.find(dentist => dentist.staff_id.toString() === data.school_dentist_id)?.fname || ''} 
           ${dentistStaff.find(dentist => dentist.staff_id.toString() === data.school_dentist_id)?.mname || ''} 
           (Lic: ${dentistStaff.find(dentist => dentist.staff_id.toString() === data.school_dentist_id)?.license_no || ''})`
                                : "Select School Dentist"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-green-50 border border-green-300">
                        {dentistStaff.map((dentist) => (
                            <SelectItem
                                key={dentist.staff_id}
                                value={dentist.staff_id.toString()} // Ensure consistent comparison
                                className="hover:bg-green-200"
                            >
                                {`${dentist.lname}, ${dentist.fname} ${dentist.mname || ""} (Lic: ${dentist.license_no})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.school_dentist_id && <p className="text-red-500">{errors.school_dentist_id}</p>}
            </div>

            {/* Button Group */}
            {/* Button Group */}
            <div className={`flex gap-4 mt-4 ${isEditMode ? "justify-center" : ""}`}>
                <Button
                    type="submit"
                    disabled={processing}
                    className="w-1/2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                    {processing ? "Saving..." : isEditMode ? "Update" : "Save"}
                </Button>

                {/* Print Button - Hidden in Edit Mode */}
                {!isEditMode && (
                    <Button
                        onClick={() => window.print()}
                        className="w-1/2 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-all"
                    >
                        Print
                    </Button>
                )}
            </div>
        </form>
    );
};

export default DentalForm;
