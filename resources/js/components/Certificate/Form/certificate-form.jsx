import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MedicalForm from "@/components/Certificate/Form/medical-form";
import DentalForm from "@/components/Certificate/Form/dental-form";

const CertificateForm = ({ open, setOpen, onSave, patient, certificate = null }) => {
    const [activeTab, setActiveTab] = useState("medical");
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        // Check if it's edit mode based on the certificate prop
        if (certificate) {
            setIsEditMode(true);
            setActiveTab(certificate.diagnosis ? "medical" : "dental"); // Check type
        }
    }, [certificate]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-white p-0 w-full">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-green-800 text-center">
                        {isEditMode ? "Edit Certificate" : "Create Certificate"}
                    </DialogTitle>
                </DialogHeader>

                {/* Tabs for Medical & Dental */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex flex-wrap justify-center bg-green-100 p-1 rounded-lg">
                        <TabsTrigger
                            value="medical"
                            disabled={isEditMode && activeTab !== "medical"} // Disable if editing dental
                            className={`px-4 py-2 rounded-lg transition ${activeTab === "medical" ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-200"} ${isEditMode && activeTab !== "medical" ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Medical
                        </TabsTrigger>

                        <TabsTrigger
                            value="dental"
                            disabled={isEditMode && activeTab !== "dental"} // Disable if editing medical
                            className={`px-4 py-2 rounded-lg transition ${activeTab === "dental" ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-200"} ${isEditMode && activeTab !== "dental" ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Dental
                        </TabsTrigger>
                    </TabsList>

                    {/* Medical and Dental Forms */}
                    <TabsContent value="medical" className="w-full">
                        <MedicalForm onSave={onSave} setOpen={setOpen} patient={patient} certificate={certificate} />
                    </TabsContent>

                    <TabsContent value="dental" className="w-full">
                        <DentalForm onSave={onSave} setOpen={setOpen} patient={patient} certificate={certificate} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default CertificateForm;
