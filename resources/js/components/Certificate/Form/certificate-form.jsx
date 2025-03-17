import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MedicalForm from "@/components/Certificate/Form/medical-form";
import DentalForm from "@/components/Certificate/Form/dental-form";

const CertificateForm = ({ open, setOpen, onSave, patient }) => {
  const [activeTab, setActiveTab] = useState("medical");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-green-50 shadow-xl rounded-lg p-6 w-full max-w-lg mx-auto overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800 text-center">Create Certificate</DialogTitle>
        </DialogHeader>

        {/* Tabs for Medical & Dental */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center bg-green-100 p-1 rounded-lg">
            <TabsTrigger
              value="medical"
              className={`px-4 py-2 rounded-lg transition ${activeTab === "medical" ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-200"}`}
            >
              Medical
            </TabsTrigger>
            <TabsTrigger
              value="dental"
              className={`px-4 py-2 rounded-lg transition ${activeTab === "dental" ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-200"}`}
            >
              Dental
            </TabsTrigger>
          </TabsList>

          {/* Medical and Dental Forms */}
          <TabsContent value="medical" className="w-full">
            <MedicalForm onSave={onSave} setOpen={setOpen} patient={patient}/>
          </TabsContent>
          <TabsContent value="dental" className="w-full">
            <DentalForm onSave={onSave} setOpen={setOpen} patient={patient}/>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateForm;
