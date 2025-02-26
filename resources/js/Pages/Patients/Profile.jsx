import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Medical from "@/components/PatientForms/Medical"; 


// ✅ Reusable InfoField with Soft Green Styling
const InfoField = ({ label, value, name, type = "text", options = [], isEditing, handleChange }) => {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-green-700">{label}</label>
      {isEditing ? (
        type === "select" ? (
          <select name={name} value={value} onChange={handleChange} className="border border-green-400 rounded-lg p-2 w-full bg-white focus:ring-2 focus:ring-green-500">
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.text}</option>
            ))}
          </select>
        ) : (
          <input type={type} name={name} value={value} onChange={handleChange} className="border border-green-400 rounded-lg p-2 w-full bg-white focus:ring-2 focus:ring-green-500" />
        )
      ) : (
        <p className="p-2 bg-green-100 rounded-lg">{value || "N/A"}</p>
      )}
    </div>
  );
};

const PatientProfile = ({ patient, onClose, onSave }) => {
  if (!patient) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editablePatient, setEditablePatient] = useState({ ...patient });
  const [activeTab, setActiveTab] = useState("medical");

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditablePatient((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save Changes & Exit Edit Mode
  const handleSave = () => {
    if (onSave) onSave(editablePatient);
    setIsEditing(false);
  };

  // ✅ Calculate Age from Birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fullName = `${editablePatient.lname}, ${editablePatient.fname} ${editablePatient.mname || ""}`;

  return (
    <Dialog open={!!patient} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-full h-[90vh] p-4 rounded-xl shadow-xl bg-green-50 flex flex-col">

        {/* ✅ Soft Green Styled Layout */}
        <Card className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-green-100 rounded-lg shadow-lg p-4 space-y-4 lg:space-y-0 lg:space-x-6">

          {/* Left Section: Avatar & Info */}
          <div className="flex flex-col items-center w-full lg:w-1/4 min-w-[200px] space-y-4 text-center">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-green-500 shadow-md" src="/default-avatar.png" alt="Avatar" />
            <h2 className="text-lg sm:text-xl font-bold text-green-900">
              {isEditing ? (
                <input type="text" name="lname" value={editablePatient.lname} onChange={handleChange} className="border border-green-400 rounded-lg p-2 w-full text-center" />
              ) : (
                fullName
              )}
            </h2>
            <Badge className="px-4 py-1 text-sm sm:text-md font-semibold bg-green-200 text-green-800 rounded-md">
              {editablePatient.role}
            </Badge>
          </div>

          {/* Right Section: Scrollable Patient Details */}
          <ScrollArea className="w-full lg:w-3/4 h-full overflow-auto p-4 bg-green-50 rounded-md shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-base sm:text-lg">

              <InfoField label="Birthdate" value={editablePatient.birthdate} name="birthdate" type="date" isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Age" value={calculateAge(editablePatient.birthdate)} />
              <InfoField label="Gender" value={editablePatient.gender === "1" ? "Male" : "Female"} name="gender" type="select" options={[{ value: "1", text: "Male" }, { value: "0", text: "Female" }]} isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Civil Status" value={editablePatient.civil_status === "1" ? "Married" : "Single"} name="civil_status" type="select" options={[{ value: "1", text: "Married" }, { value: "0", text: "Single" }]} isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Address" value={editablePatient.address} name="address" type="text" isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Position/Year Level" value={editablePatient.positionYearLevel} name="positionYearLevel" type="text" isEditing={isEditing} handleChange={handleChange} />

              <InfoField label="Department" value={editablePatient.department} name="department" type="text" isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Program" value={editablePatient.program} name="program" type="text" isEditing={isEditing} handleChange={handleChange} />
            </div>
          </ScrollArea>

        </Card>

        {/* ✅ Soft Green Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} className="bg-green-300 text-green-900 hover:bg-green-400">Cancel</Button>
              <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700">Save</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-green-500 text-white hover:bg-green-600">Edit</Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="flex space-x-4 sm:space-x-6 border-b border-green-300 pb-2">
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="dental">Dental</TabsTrigger>
            <TabsTrigger value="bp">BP</TabsTrigger>
            <TabsTrigger value="incident">Incident Reports</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {activeTab === "medical" && <Medical activeTab={activeTab} />}
          </div>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
};

export default PatientProfile;
