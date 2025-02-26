import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ✅ Reusable InfoField Component (Supports Editing)
const InfoField = ({ label, value, name, type = "text", options = [], isEditing, handleChange }) => {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        type === "select" ? (
          <select name={name} value={value} onChange={handleChange} className="border rounded-lg p-2 w-full bg-white focus:ring-2 focus:ring-blue-500">
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.text}</option>
            ))}
          </select>
        ) : (
          <input type={type} name={name} value={value} onChange={handleChange} className="border rounded-lg p-2 w-full bg-white focus:ring-2 focus:ring-blue-500" />
        )
      ) : (
        <p className="p-2 bg-gray-100 rounded-lg">{value || "N/A"}</p>
      )}
    </div>
  );
};

const PatientProfile = ({ patient, onClose, onSave }) => {
  if (!patient) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editablePatient, setEditablePatient] = useState({ ...patient });
  const [activeTab, setActiveTab] = useState("medical");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditablePatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editablePatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditablePatient({ ...patient });
    setIsEditing(false);
  };

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
      {/* 🔥 Full-screen modal with better spacing */}
      <DialogContent className="max-w-full w-full h-[90vh] p-6 rounded-xl shadow-xl bg-white flex flex-col">
        
        {/* Main Horizontal Card */}
        <Card className="w-full h-full flex flex-row overflow-x-auto bg-gray-50 rounded-lg shadow-lg p-6 space-x-6">
          
          {/* Left Section: Avatar & Name */}
          <div className="flex flex-col items-center w-1/4 min-w-[250px] space-y-4 text-center">
            <Avatar className="w-32 h-32 border-4 border-blue-500 shadow-md" src="/default-avatar.png" alt="Avatar" />
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? (
                <input type="text" name="lname" value={editablePatient.lname} onChange={handleChange} className="border rounded-lg p-2 w-full text-center" />
              ) : (
                fullName
              )}
            </h2>
            <Badge className="px-4 py-1 text-md font-semibold bg-blue-100 text-blue-800 rounded-md">
              {editablePatient.role}
            </Badge>
          </div>

          {/* Right Section: Scrollable Patient Details */}
          <ScrollArea className="w-3/4 h-full overflow-y-auto p-4 bg-white rounded-md shadow-inner">
            <div className="grid grid-cols-2 gap-6 text-lg">
              
              <InfoField label="Birthdate" value={editablePatient.birthdate} name="birthdate" type="date" isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Age" value={calculateAge(editablePatient.birthdate)} />
              <InfoField label="Gender" value={editablePatient.gender === "1" ? "Male" : "Female"} name="gender" type="select" options={[{ value: "1", text: "Male" }, { value: "0", text: "Female" }]} isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Civil Status" value={editablePatient.civil_status === "1" ? "Married" : "Single"} name="civil_status" type="select" options={[{ value: "1", text: "Married" }, { value: "0", text: "Single" }]} isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Address" value={editablePatient.address} name="address" type="text" isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Position/Year Level" value={editablePatient.positionYearLevel} name="positionYearLevel" type="text" isEditing={isEditing} handleChange={handleChange} />

              {/* ✅ Department & Program fields */}
              <InfoField label="Department" value={editablePatient.department} name="department" type="text" isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Program" value={editablePatient.program} name="program" type="text" isEditing={isEditing} handleChange={handleChange} />
              
              {/* Emergency Contact Section */}
              <div className="col-span-2">
                <h3 className="text-lg font-bold mt-6">Emergency Contact</h3>
              </div>
              <InfoField label="Contact Name" value={editablePatient.emergency_contact_name} name="emergency_contact_name" type="text" isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Relationship" value={editablePatient.emergency_contact_relationship} name="emergency_contact_relationship" type="text" isEditing={isEditing} handleChange={handleChange} />
              <InfoField label="Contact Number" value={editablePatient.emergency_contact_number} name="emergency_contact_number" type="text" isEditing={isEditing} handleChange={handleChange} />
            
            </div>
          </ScrollArea>

        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="flex space-x-6 border-b pb-2">
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="dental">Dental</TabsTrigger>
            <TabsTrigger value="bp">BP</TabsTrigger>
            <TabsTrigger value="incident">Incident Reports</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
};

export default PatientProfile;
