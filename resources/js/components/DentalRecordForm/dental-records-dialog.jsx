import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import DentalRecordList from "./List/dental-records-list";

const DentalRecordDialog = ({ patient }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [records, setRecords] = useState(patient?.dental_records || []);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [step, setStep] = useState(1);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        patient_id: patient?.patient_id || null,
        school_dentist_id: 1,
        school_nurse_id: "",
        dental_record_chart: {},

        // Step 2: Initial Periodontal Examination
        gingival_status: "",  // Normal, Gingivitis, Periodontitis
        periodontitis_severity: "", // Early, Moderate, Severe (only if Periodontitis)
        plaque_deposit: "",    // Light, Moderate, Heavy
        other_treatments: "",  // Existing dentures, orthodontic, other treatments

        // Step 3: Recommended Treatment
        recommended_treatment: "",
    });

    const handleSave = async () => {
        if (!data.gingival_status || !data.plaque_deposit) {
            toast.error("Please complete required fields.");
            return;
        }

        if (data.gingival_status === "Periodontitis" && !data.periodontitis_severity) {
            toast.error("Please specify the severity for Periodontitis.");
            return;
        }

        let dentalRecordChartString;
        try {
            dentalRecordChartString = JSON.stringify(data.dental_record_chart);
            JSON.parse(dentalRecordChartString);  // Validate JSON
        } catch (error) {
            toast.error("Invalid dental record chart.");
            return;
        }

        const preparedData = { ...data, dental_record_chart: dentalRecordChartString };
        const confirmed = window.confirm(
            isEditMode ? "Update this Dental Record?" : "Create this Dental Record?"
        );

        if (!confirmed) return;

        try {
            if (isEditMode && selectedRecord) {
                // Update existing record
                await put(route("dental-records.update", selectedRecord.id), {
                    data: preparedData,
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Dental record updated successfully!");
                        clearForm();
                    },
                    onError: () => toast.error("Failed to update dental record."),
                });
            } else {
                // Create new record
                await post(route("dental-records.store"), {
                    data: preparedData,
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Dental record created successfully!");
                        clearForm();
                    },
                    onError: () => toast.error("Failed to create dental record."),
                });
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const clearForm = () => {
        reset();  // Reset the form using Inertia's reset function
        setIsEditMode(false);
        setSelectedRecord(null);
        setStep(1);

        // Explicitly reset data to initial state
        setData({
            patient_id: patient?.patient_id || null,
            school_dentist_id: 1,
            school_nurse_id: "",
            dental_record_chart: {},
            gingival_status: "",
            periodontitis_severity: "",
            plaque_deposit: "",
            other_treatments: "",
            recommended_treatment: "",
        });

        setIsOpen(false);
    };

    const handleEdit = (record) => {
        clearForm();  // Ensure there's no previous state residue
        setSelectedRecord(record);
        setIsEditMode(true);
        setIsOpen(true);

        // Load existing data for the selected record
        setData("dental_record_chart", record.dental_record_chart || "{}");
        setData("gingival_status", record.gingival_status);
        setData("periodontitis_severity", record.periodontitis_severity);
        setData("plaque_deposit", record.plaque_deposit);
        setData("other_treatments", record.other_treatments);
        setData("recommended_treatment", record.recommended_treatment);
    };

    return (
        <div>
            <div className="p-4 bg-green-50 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-800">Dental Records</h2>
                <Button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 mb-3 rounded shadow-md hover:bg-blue-700 transition"
                    onClick={() => {
                        clearForm();
                        setIsOpen(true);
                    }}>
                    New Dental Record
                </Button>

                <DentalRecordList
                    records={records}
                    patient={patient}
                    onEdit={handleEdit}
                />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-full max-w-5xl p-8 mx-auto bg-white rounded-lg shadow-lg flex flex-col items-center">
                    <DialogHeader className="w-full">
                        <DialogTitle className="text-2xl text-green-700 text-center">
                            {isEditMode ? "Edit Dental Record" : "New Dental Record"}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Step Components */}
                    <div className="flex flex-col items-center justify-center w-full">
                        {step === 1 && (
                            <Step1
                                data={data}
                                setData={setData}
                                errors={errors}
                                selectedRecord={selectedRecord}
                                isEditMode={isEditMode}
                                setIsEditMode={setIsEditMode}
                            />
                        )}
                        {step === 2 && <Step2 data={data} setData={setData} errors={errors} />}
                        {step === 3 && <Step3 data={data} setData={setData} errors={errors} />}
                    </div>

                    {/* Navigation Buttons */}
                    <DialogFooter className="w-full flex justify-center mt-4 gap-4">
                        {step > 1 && (
                            <Button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                        )}

                        {step < 3 ? (
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => setStep(step + 1)}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleSave}
                                disabled={processing}
                            >
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DentalRecordDialog;
