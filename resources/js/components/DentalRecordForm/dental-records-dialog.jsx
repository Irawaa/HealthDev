import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

const DentalRecordDialog = ({ patient }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [records, setRecords] = useState(patient?.dental_records || []);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, reset, errors } = useForm({
        patient_id: patient?.patient_id || null,
        dentist_id: 1,
        dentalRecordChart: {},

        // Step 2: Initial Periodontal Examination
        gingival_status: "", // Normal, Gingivitis, Periodontitis
        plaque_deposit: "", // Light, Moderate, Heavy
        other_treatments: "", // Existing dentures, orthodontic, other treatments

        // Step 3: Recommended Treatment
        recommended_treatment: ""
    });

    const handleSave = async () => {
        if (!data.chief_complaint || !data.present_condition) {
            toast.error("Please complete required fields.");
            return;
        }

        const confirmed = window.confirm(
            selectedRecord
                ? "Are you sure you want to update this Dental Record?"
                : "Are you sure you want to create this Dental Record?"
        );
        if (!confirmed) return;

        if (selectedRecord) {
            post(route("dental-records.update", selectedRecord.id), {
                data,
                method: "post",
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("✅ Dental record updated successfully!");
                    setRecords((prev) =>
                        prev.map((record) =>
                            record.id === selectedRecord.id ? { ...data, id: record.id } : record
                        )
                    );
                    reset();
                    setSelectedRecord(null);
                    setIsOpen(false);
                },
            });
        } else {
            post(route("dental-records.store"), {
                data,
                method: "post",
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("✅ Dental record created successfully!");
                    setRecords([{ id: Date.now(), ...data }, ...records]);
                    reset();
                    setIsOpen(false);
                },
            });
        }
    };

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>New Dental Record</Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-full max-w-5xl p-8 mx-auto bg-white rounded-lg shadow-lg flex flex-col items-center">
                    <DialogHeader className="w-full">
                        <DialogTitle className="text-2xl text-green-700 text-center">
                            {selectedRecord ? "Edit Dental Record" : "New Dental Record"}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Centered Step Navigation */}
                    <div className="flex flex-col items-center justify-center w-full">
                        {step === 1 && <Step1 data={data} setData={setData} errors={errors} />}
                        {step === 2 && <Step2 data={data} setData={setData} errors={errors} />}
                        {step === 3 && <Step3 data={data} setData={setData} errors={errors} />}
                    </div>

                    {/* Navigation Buttons - Centered */}
                    <DialogFooter className="w-full flex justify-center mt-4 gap-4">
                        {step > 1 && (
                            <Button variant="outline" onClick={() => setStep((prev) => prev - 1)}>
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button
                                onClick={() => {
                                    console.log("Current data:", data);
                                    setStep((prev) => prev + 1);
                                }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSave} disabled={processing}>
                                {selectedRecord ? "Update" : "Save"}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DentalRecordDialog;
