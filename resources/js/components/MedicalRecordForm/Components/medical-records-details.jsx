import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MedicalRecordDetails = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <Dialog open={!!record} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-6 bg-green-100 text-green-900 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Medical Record Details</DialogTitle>
          <DialogClose asChild>
            <Button className="absolute top-3 right-3 bg-green-600 text-white rounded-full px-3 py-1 hover:bg-green-700">
              ×
            </Button>
          </DialogClose>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="flex bg-green-200 p-2 rounded-lg mb-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="vital-signs">Vital Signs</TabsTrigger>
            <TabsTrigger value="review">Review of Systems</TabsTrigger>
            <TabsTrigger value="physical">Physical Exam</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="labs">Lab Results</TabsTrigger>
          </TabsList>

          {/* General Info */}
          <TabsContent value="general">
            <div className="space-y-2">
              <p><strong>Final Evaluation:</strong> {record.final_evaluation}</p>
              <p><strong>Plan Recommendation:</strong> {record.plan_recommendation}</p>
              <p><strong>Chief Complaint:</strong> {record.medical_record_detail.chief_complaint}</p>
              <p><strong>Present Illness:</strong> {record.medical_record_detail.present_illness}</p>
              <p><strong>Medication:</strong> {record.medical_record_detail.medication}</p>
              <p><strong>Hospitalized:</strong> {record.medical_record_detail.hospitalized ? "Yes" : "No"}</p>
              {record.medical_record_detail.hospitalized_reason && (
                <p><strong>Hospitalization Reason:</strong> {record.medical_record_detail.hospitalized_reason}</p>
              )}
            </div>
          </TabsContent>

          {/* Vital Signs */}
          <TabsContent value="vital-signs">
            <div className="bg-green-200 p-3 rounded-lg">
              <h3 className="font-semibold">Vital Signs</h3>
              <p><strong>Blood Pressure:</strong> {record.vital_signs.bp}</p>
              <p><strong>Temperature:</strong> {record.vital_signs.temperature}°C</p>
              <p><strong>Heart Rate:</strong> {record.vital_signs.hr} bpm</p>
              <p><strong>Respiratory Rate:</strong> {record.vital_signs.rr} cpm</p>
              <p><strong>Weight:</strong> {record.vital_signs.weight} kg</p>
              <p><strong>Height:</strong> {record.vital_signs.height} m</p>
              <p><strong>BMI:</strong> {record.vital_signs.bmi}</p>
            </div>
          </TabsContent>

          {/* Review of Systems */}
          <TabsContent value="review">
            <ul className="list-disc pl-5">
              {record.review_of_systems.map((symptom, index) => (
                <li key={index}>{symptom.symptom}</li>
              ))}
            </ul>
          </TabsContent>

          {/* Physical Examinations */}
          <TabsContent value="physical">
            <ul className="list-disc pl-5">
              {record.physical_examinations.map((exam, index) => (
                <li key={index}>{exam.name}</li>
              ))}
            </ul>
          </TabsContent>

          {/* Medical History */}
          <TabsContent value="history">
            <h3 className="font-semibold">Past Medical History:</h3>
            <ul className="list-disc pl-5">
              {record.past_medical_histories.map((history, index) => (
                <li key={index}>{history.condition_name}</li>
              ))}
            </ul>

            <h3 className="font-semibold mt-3">Personal & Social History:</h3>
            <p><strong>Alcoholic Drinker:</strong> {record.personal_social_history.alcoholic_drinker}</p>
            <p><strong>Smoker:</strong> {record.personal_social_history.smoker ? "Yes" : "No"}</p>
            <p><strong>Use of Illicit Drugs:</strong> {record.personal_social_history.illicit_drugs ? "Yes" : "No"}</p>
            <p><strong>Eye Glasses:</strong> {record.personal_social_history.eye_glasses ? "Yes" : "No"}</p>
            <p><strong>Contact Lens:</strong> {record.personal_social_history.contact_lens ? "Yes" : "No"}</p>
          </TabsContent>

          {/* Lab Results */}
          <TabsContent value="labs">
            <h3 className="font-semibold">Laboratory Results:</h3>
            <p><strong>Blood Chemistry:</strong> {record.medical_record_detail.blood_chemistry}</p>
            <p><strong>FBS:</strong> {record.medical_record_detail.fbs}</p>
            <p><strong>Uric Acid:</strong> {record.medical_record_detail.uric_acid}</p>
            <p><strong>Triglycerides:</strong> {record.medical_record_detail.triglycerides}</p>
            <p><strong>Total Cholesterol:</strong> {record.medical_record_detail.t_cholesterol}</p>
            <p><strong>Creatinine:</strong> {record.medical_record_detail.creatinine}</p>

            {record.medical_record_detail.chest_xray && (
              <div className="mt-2">
                <h3 className="font-semibold">Chest X-ray:</h3>
                <img
                  src={record.medical_record_detail.chest_xray}
                  alt="Chest X-ray"
                  className="w-full max-h-64 object-cover rounded-lg border border-green-500"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordDetails;
