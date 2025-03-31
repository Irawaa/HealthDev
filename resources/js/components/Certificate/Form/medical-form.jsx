import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { usePhysicianStaff } from "@/Pages/Patients/ProfilePage";
import { AnimatePresence, motion } from "framer-motion";


const MedicalForm = ({ setOpen, patient, certificate }) => {
    const physicianStaff = usePhysicianStaff();
    const [pageLoading, setPageLoading] = useState(false);
    const [originalDate, setOriginalDate] = useState(null);
    const [dateModified, setDateModified] = useState(false);


    // ✅ useForm Hook with Laravel-validated fields
    const { data, setData, post, put, processing, errors } = useForm({
        patient_id: patient?.patient_id || null,
        diagnosis: "",
        advised_medication_rest_required: false, // Boolean
        advised_medication_rest: "", // Date
        purpose: "", // Single value (Enum)
        purpose_other: "",
        recommendation: "", // Integer (0,1,2)
        clearance_status: "", // Integer (0,1,2)
        further_evaluation: "",
        not_cleared_for: "", // Enum (Single Value)
        activity_specification: "",
        school_physician_id: "", // Foreign Key (Integer)
    });

    useEffect(() => {
        if (certificate) {
            setOriginalDate(certificate.advised_medication_rest || "")
            setData({
                patient_id: certificate.patient_id,
                diagnosis: certificate.diagnosis || "",
                advised_medication_rest_required: certificate.advised_medication_rest_required || false,
                advised_medication_rest: certificate.advised_medication_rest || "",
                purpose: certificate.purpose || "",
                purpose_other: certificate.purpose_other || "",
                recommendation: certificate.recommendation ?? 0,
                clearance_status: certificate.clearance_status ?? 0,
                further_evaluation: certificate.further_evaluation || "",
                not_cleared_for: certificate.not_cleared_for || "",
                activity_specification: certificate.activity_specification || "",
                school_physician_id: certificate.school_physician_id?.toString() || "",
            });
        }
    }, [certificate]);


    // ✅ Input Change Handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "advised_medication_rest") {
            if (value !== originalDate) {
                setDateModified(true); // Mark as changed
            } else {
                setDateModified(false); // Reset if reverted
            }
        }

        setData(name, value);
    };

    // ✅ Checkbox Change Handler (Single Selection)
    const handleCheckboxChange = (name, value, checked) => {
        setData(name, checked ? value : "");
    };

    // ✅ Boolean Checkbox Change Handler
    const handleSingleCheckboxChange = (name, checked) => {
        setData(name, checked);
    };

    // ✅ Radio Button Change Handler
    const handleRadioChange = (name, value) => {
        setData(name, parseInt(value, 10)); // Convert to Integer
    };

    // ✅ Select Dropdown Change Handler
    const handleSelectChange = (name, value) => {
        setData(name, value);
    };

    // ✅ Prevent Submission if `clearance_status` is 2 and `not_cleared_for` is empty
    const handleSubmit = (e) => {
        e.preventDefault();

        setPageLoading(true);

        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        let validationErrors = [];

        // ✅ Required Fields
        if (!data.diagnosis) validationErrors.push("Diagnosis is required.");
        if (!data.purpose) validationErrors.push("Purpose is required.");
        if (data.recommendation === undefined || data.recommendation === "") validationErrors.push("Recommendation is required.");
        if (data.clearance_status === undefined || data.clearance_status === "") validationErrors.push("Clearance status is required.");
        if (!data.school_physician_id) validationErrors.push("School Physician is required.");

        // ✅ Ensure 'not_cleared_for' is set when 'clearance_status' is 2 (Not Cleared)
        if (data.clearance_status === 2 && !data.not_cleared_for) {
            validationErrors.push("You must specify what the patient is NOT cleared for.");
        }

        // ✅ Prevent past dates for advised medication rest
        if (data.advised_medication_rest && dateModified) {
            const selectedDate = new Date(data.advised_medication_rest);
            const todayDate = new Date(today);

            if (selectedDate < todayDate) {
                validationErrors.push("The rest date must be today or a future date.");
            }
        }

        // ✅ Show all errors at once using toast
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => toast.error(`❌ ${error}`));
            return;
        }

        const routeName = certificate
            ? "medical-certificates.update"
            : "medical-certificates.store";

        const requestMethod = certificate ? put : post;

        // ✅ Proceed with form submission if no errors
        requestMethod(route(routeName, certificate?.id), {
            onSuccess: () => {
                toast.success("✅ Medical certificate created successfully!");
                setOpen(false);
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => toast.error(`❌ ${error}`));
                setPageLoading(false);
            },
            onFinish: () => {
                setPageLoading(false); // ✅ Hide loading after request finishes
            },
        });
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto p-6 bg-green-50 shadow-xl rounded-lg border border-green-400"
        >

            <div className="max-h-[60vh] overflow-y-auto px-3 space-y-5">

                {/* Diagnosis Field */}
                <div className="mb-4">
                    <label className="font-bold text-green-700">Diagnosis/Impression:
                        <span className="text-red-500"> *</span>
                    </label>
                    <Textarea
                        name="diagnosis"
                        value={data.diagnosis}
                        onChange={handleInputChange}
                        placeholder="Enter diagnosis here..."
                        className="w-full border border-green-500 rounded-md p-2 bg-white focus:ring-2 focus:ring-green-600 transition"
                        required
                    />
                </div>

                <hr className="border-green-300 my-4" />

                {/* Medication Rest */}
                <div className="mb-4">
                    <label className="font-bold text-green-700">
                        Medication & Rest: {data.advised_medication_rest_required && <span className="text-red-500">*</span>}
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                            id="advised_medication_rest_required"
                            checked={data.advised_medication_rest_required}
                            onCheckedChange={(checked) => handleSingleCheckboxChange("advised_medication_rest_required", checked)}
                        />
                        <span className="text-green-700">Advised to take medications and rest for:</span>
                    </label>
                    {data.advised_medication_rest_required && (
                        <input
                            type="date"
                            name="advised_medication_rest"
                            value={data.advised_medication_rest}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split("T")[0]} // ✅ Disable past dates
                            className="border border-green-500 p-2 rounded-md w-full bg-white focus:ring-2 focus:ring-green-600 transition mt-2"
                            required={data.advised_medication_rest_required}
                        />
                    )}
                </div>

                <hr className="border-green-300 my-4" />

                {/* Purpose Selection */}
                <div className="mb-4">
                    <label className="font-bold text-green-700">Purpose:
                        <span className="text-red-500"> *</span>
                    </label>
                    <div className="ml-3 space-y-2">
                        {["Excuse Slip", "Off School Duty", "OJT", "Sports", "ROTC", "Others"].map((option) => (
                            <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                <Checkbox
                                    checked={data.purpose === option}
                                    onCheckedChange={(checked) => handleCheckboxChange("purpose", option, checked)}
                                />
                                <span className="text-green-700">{option}</span>
                            </label>
                        ))}
                    </div>
                    {data.purpose === "Others" && (
                        <Input
                            name="purpose_other"
                            value={data.purpose_other}
                            onChange={handleInputChange}
                            placeholder="Specify other purpose"
                            className="border border-green-500 p-2 rounded-md w-full focus:ring-2 focus:ring-green-600 transition mt-2"
                            required
                        />
                    )}
                </div>

                <hr className="border-green-300 my-4" />

                {/* Recommendations */}
                <div className="mb-4">
                    <label className="font-bold text-green-700">Recommendations:
                        <span className="text-red-500"> *</span>
                    </label>
                    <div className="ml-3 space-y-2">
                        {["Return to Class", "Sent home", "To hospital of choice"].map((option, index) => (
                            <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                <Checkbox
                                    checked={data.recommendation === index}
                                    onCheckedChange={(checked) => handleRadioChange("recommendation", checked ? index : "")}
                                />
                                <span className="text-green-700">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <hr className="border-green-300 my-4" />

                {/* Clearance Status */}
                <div className="mb-4">
                    <label className="font-bold text-green-700">
                        Clearance Status: <span className="text-red-500"> *</span>
                    </label>
                    <div className="ml-3 space-y-2">
                        {["Cleared without restrictions", "Further evaluation", "Not Cleared"].map((option, index) => (
                            <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                <Checkbox
                                    checked={data.clearance_status === index}
                                    onCheckedChange={(checked) => handleRadioChange("clearance_status", checked ? index : "")}
                                />
                                <span className="text-green-700">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Not Cleared Section with Animation */}
                <AnimatePresence>
                    {data.clearance_status === 2 && (
                        <>
                            <hr className="border-green-300 my-4" />

                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }} // 👈 Animates out when unchecked
                                transition={{ duration: 0.3 }}
                                className="mb-4"
                            >
                                <label className="font-bold text-green-700">
                                    Not Cleared For: <span className="text-red-500"> *</span>
                                </label>
                                <div className="ml-3 space-y-2">
                                    {["All sports", "Certain sports", "Activity"].map((option) => (
                                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                            <Checkbox
                                                checked={data.not_cleared_for === option}
                                                onCheckedChange={(checked) => setData("not_cleared_for", checked ? option : "")}
                                            />
                                            <span className="text-green-700">{option}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Activity Specification Input with Animation */}
                                <AnimatePresence>
                                    {data.not_cleared_for === "Activity" && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }} // 👈 Animates out when unchecked
                                            transition={{ duration: 0.2 }}
                                            className="ml-6 mt-2"
                                        >
                                            <Input
                                                name="activity_specification"
                                                value={data.activity_specification}
                                                onChange={handleInputChange}
                                                placeholder="Specify Activity"
                                                className="border border-green-500 p-2 rounded-md w-full focus:ring-2 focus:ring-green-600 transition"
                                                required
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <hr className="border-green-300 my-4" />

                {/* School Physician Selection */}
                <div className="mb-4">
                    <label className="font-bold text-green-700">School Physician:
                        <span className="text-red-500"> *</span>
                    </label>
                    <Select
                        value={data.school_physician_id}
                        onValueChange={(value) => setData("school_physician_id", value)}
                        required
                        className="mt-2"
                    >
                        <SelectTrigger className="w-full border border-green-500 bg-white p-2 rounded-md focus:ring-2 focus:ring-green-600 transition">
                            <SelectValue>
                                {physicianStaff.find((physician) => physician.staff_id == data.school_physician_id)
                                    ? `${physicianStaff.find((physician) => physician.staff_id == data.school_physician_id)?.lname}, 
                                       ${physicianStaff.find((physician) => physician.staff_id == data.school_physician_id)?.fname} 
                                       ${physicianStaff.find((physician) => physician.staff_id == data.school_physician_id)?.mname || ""} 
                                       (Lic: ${physicianStaff.find((physician) => physician.staff_id == data.school_physician_id)?.license_no})`
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

            {/* Submit Button */}
            <div className="w-full mt-5">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        {processing ? "Saving..." : certificate ? "Update" : "Save & Print"}
                    </Button>
                </motion.div>
            </div>

            {pageLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Smooth Spinning Loader */}
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-green-500 border-l-green-400 border-r-green-300 border-b-green-200"></div>
                        <p className="mt-4 text-green-300 text-lg font-semibold animate-pulse">
                            Saving, please wait...
                        </p>
                    </motion.div>
                </div>
            )}
        </motion.form>
    );
};
export default MedicalForm;

