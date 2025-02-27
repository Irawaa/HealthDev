import { useState } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
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
        // Patient Fields
        type: "employee",
        lname: "", fname: "", mname: "", ext: "",
        birthdate: "", gender: "1", civil_status: "",
        email: "", mobile: "", telephone: "",
        updated_by: null, // Foreign key for users

        // Employee Fields
        employee_no: "", date_hired: "",
        is_active: "1", height: "", weight: "", blood_type: "",
        father_name: "", mother_name: "",
        spouse_name: "", spouse_occupation: "",
        emergency_contact_person: "", emergency_contact_number: "",
        
        // Address
        res_brgy: "", res_city: "", res_prov: "",
        res_region: "", res_zipcode: "",
        
        // Foreign Keys
        dept_id: "", college_id: "", patient_id: ""
    });

    const departments = [
        { dept_id: "1", dept_description: "Office of the University President", dept_code: "OUP" },
        { dept_id: "2", dept_description: "Office of the Executive Vice President", dept_code: "OEVP" },
        { dept_id: "3", dept_description: "Office of the Vice President for Academic Affairs", dept_code: "OVPAA" },
        { dept_id: "4", dept_description: "Office of the Vice President for Administration & Finance", dept_code: "OVPAF" },
        { dept_id: "5", dept_description: "Office of the Vice President for Planning, Research & Extension", dept_code: "OVPPRE" },
        { dept_id: "6", dept_description: "Office of the Vice President for Student Development & Auxiliary Services", dept_code: "OVPSDAS" },
        { dept_id: "7", dept_description: "Office of the University Secretary", dept_code: "OUS" },
        { dept_id: "8", dept_description: "Management Information Systems Department", dept_code: "MISD" },
        { dept_id: "9", dept_description: "College of Business, Accountancy & Administration", dept_code: "CBAA" },
        { dept_id: "10", dept_description: "College of Computing Studies", dept_code: "CCS" },
        { dept_id: "12", dept_description: "College of Engineering", dept_code: "COE" },
        { dept_id: "13", dept_description: "College of Health & Allied Sciences", dept_code: "CHAS" },
        { dept_id: "14", dept_description: "Graduate School", dept_code: "GS" },
        { dept_id: "18", dept_description: "University Library", dept_code: "ULIB" },
        { dept_id: "19", dept_description: "Office of the University Registrar", dept_code: "OUR" },
        { dept_id: "38", dept_description: "College of Arts and Sciences", dept_code: "CAS" },
        { dept_id: "39", dept_description: "College of Education", dept_code: "COED" }
    ];    

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
            <DialogTrigger asChild>
                <Button variant="default">Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Step {step}: {["Basic Info", "Employment Details", "Address Info", "Review & Submit"][step - 1]}</DialogTitle>
                    <DialogDescription>Fill out the necessary information to proceed.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    {step === 1 && <Step1 data={data} setData={setData} colleges={colleges} />}
                    {step === 2 && <Step2 data={data} setData={setData} departments={departments}/>}
                    {step === 3 && <Step3 data={data} setData={setData} />}
                    {step === 4 && <Step4 data={data} setData={setData} />}
                    {step === 5 && <Step5 data={data} />}

                    <DialogFooter className="flex gap-4 mt-2">
                        {step > 1 && <Button type="button" onClick={prevStep}>Back</Button>}
                        {step < 5 ? (
                            <Button type="button" onClick={nextStep}>Next</Button>
                        ) : (
                            <Button type="submit" disabled={processing}>
                                {processing ? "Submitting..." : "Submit"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
