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

export default function AddEmployeeDialog({ open, onClose, colleges }) {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, reset } = useForm({
        type: "student",
        lname: "", fname: "", mname: "", ext: "",
        birthdate: "", gender: "1", civil_status: "",
        email: "", mobile: "", telephone: "",
        stud_id: "", is_vaccinated: "1", college_id: "",
        program_id: "", father_name: "", father_birthdate: "",
        father_occupation: "", mother_name: "", mother_birthdate: "",
        mother_occupation: "", guardian_name: "", guardian_relation: "",
        guardian_contactno: "", address_house: "", address_brgy: "",
        address_citytown: "", address_province: "", address_zipcode: "",
        emergency_contact_name: "", emergency_contact_no: ""
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (step < 4) {
            nextStep();
            return;
        }

        post(route("students.store"), {
            onSuccess: () => {
                toast.success("Student added successfully");
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
                <Button variant="default">Add Student</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Step {step}: {["Basic Info", "Personal Details", "Address Info", "Review & Submit"][step - 1]}</DialogTitle>
                    <DialogDescription>Fill out the necessary information to proceed.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    {step === 1 && <Step1 data={data} setData={setData} colleges={colleges} />}
                    {step === 2 && <Step2 data={data} setData={setData} />}
                    {step === 3 && <Step3 data={data} setData={setData} />}
                    {step === 4 && <Step4 data={data} />}

                    <DialogFooter className="flex gap-4 mt-2">
                        {step > 1 && <Button type="button" onClick={prevStep}>Back</Button>}
                        {step < 4 ? (
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
