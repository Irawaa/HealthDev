import { useState } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Import Steps
import Step1 from "@/components/EmployeePatients/Steps/Step1";
import Step2 from "@/components/EmployeePatients/Steps/Step2";
import Step3 from "@/components/EmployeePatients/Steps/Step3";
import Step4 from "@/components/EmployeePatients/Steps/Step4";
import Step5 from "@/components/EmployeePatients/Steps/Step5";

export default function AddEmployeeDialog({ open, onClose, colleges }) {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, reset } = useForm({
        type: "employee",
        lname: "", fname: "", mname: "", ext: "",
        birthdate: "", gender: "1", civil_status: "",
        emailaddress: "", mobile: "", telephone: "",
        updated_by: null, // Foreign key for users

        employee_no: "", date_hired: "",
        is_active: "1", height: "", weight: "", blood_type: "",
        father_name: "", mother_name: "",
        spouse_name: "", spouse_occupation: "",
        emergency_contact_person: "", emergency_contact_number: "",
        
        res_brgy: "", res_city: "", res_prov: "",
        res_region: "", res_zipcode: "",
        
        dept_id: "", college_id: "", patient_id: ""
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (step < 5) {
            nextStep();
            return;
        }

        post(route("employees.store"), {
            onSuccess: () => {
                toast.success("Employee added successfully");
                onClose();
                reset();
                setStep(1);
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => toast.error(error));
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-5xl w-full bg-white border border-green-400 shadow-2xl rounded-2xl flex flex-col p-6 md:p-8 max-h-[95vh]">
                    
                {/* ✅ Step Progress Indicator */}
                <div className="sticky top-0 bg-white z-10 pb-3">
                    <div className="flex justify-between items-center mb-3">
                        {["Basic Info", "Employment Details", "Address Info", "Other Details", "Review & Submit"].map((title, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className={`w-9 h-9 flex items-center justify-center font-bold rounded-full transition-all duration-300 text-sm ${
                                    step === index + 1 
                                        ? "bg-green-600 text-white ring-2 ring-green-300 shadow-md"
                                        : "bg-gray-300 text-gray-600"
                                }`}>
                                    {index + 1}
                                </div>
                                <p className={`text-xs md:text-sm mt-1 font-medium transition-all ${
                                    step === index + 1 ? "text-green-700" : "text-gray-500"
                                }`}>
                                    {title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ✅ Compact Form Header */}
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-lg md:text-xl font-bold text-green-700">
                        Step {step}: {["Basic Info", "Employment Details", "Address Info", "Other Details", "Review & Submit"][step - 1]}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-xs md:text-sm">
                        Fill out the necessary information to proceed.
                    </DialogDescription>
                </DialogHeader>

                {/* ✅ Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto pr-4 max-h-[80vh] pb-3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && <Step1 data={data} setData={setData} colleges={colleges} />}
                        {step === 2 && <Step2 data={data} setData={setData} />}
                        {step === 3 && <Step3 data={data} setData={setData} />}
                        {step === 4 && <Step4 data={data} setData={setData} />}
                        {step === 5 && <Step5 data={data} />}
                    </form>
                </div>

                {/* ✅ Compact Footer */}
                <div className="w-full bg-white py-2 mt-3 flex justify-between items-center shadow-md border-t border-gray-300 px-6">
                    {step > 1 && (
                        <Button 
                            type="button" 
                            onClick={prevStep} 
                            className="bg-gray-300 text-gray-700 hover:bg-gray-400 transition px-5 py-2 rounded-lg text-sm"
                        >
                            Back
                        </Button>
                    )}
                    <div>
                        {step < 5 ? (
                            <Button 
                                type="button" 
                                onClick={nextStep} 
                                className="bg-green-600 text-white hover:bg-green-700 transition px-5 py-2 rounded-lg text-sm shadow-md"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="bg-green-700 text-white hover:bg-green-800 transition px-5 py-2 rounded-lg text-sm shadow-md"
                            >
                                {processing ? "Submitting..." : "Submit"}
                            </Button>
                        )}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
