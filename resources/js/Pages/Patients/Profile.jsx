import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, StethoscopeIcon, HeartPulseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const PatientProfile = ({ patient, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editablePatient, setEditablePatient] = useState({ ...patient });

  if (!patient) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditablePatient((prev) => ({ ...prev, [name]: value }));
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fullName = `${patient.lname}, ${patient.fname} ${patient.mname || ""}`;
  const isStudent = patient.role === "Student";
  const isStaff = patient.role === "Personnel";
  const isNonPersonnel = patient.role === "Non-Personnel";

  return (
    <Dialog open={!!patient} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-6 md:p-8 rounded-xl shadow-xl bg-white">
        <Card className="w-full p-6 md:p-8 rounded-lg shadow-lg bg-gray-50 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex flex-col items-center w-full md:w-1/3 space-y-4 text-center">
            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-blue-500 shadow-md" src="/default-avatar.png" alt="Default Avatar" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {isEditing ? (
                <input type="text" name="lname" value={editablePatient.lname} onChange={handleChange} className="border rounded p-2 w-full text-center" />
              ) : (
                fullName
              )}
            </h2>
            <Badge className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-md">
              {patient.role}
            </Badge>
          </div>

          <CardContent className="w-full md:w-2/3">
            <ScrollArea className="w-full max-h-80 p-4 bg-white rounded-md shadow-inner overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm md:text-base">
                <div className="flex flex-col">
                  <label className="font-semibold flex items-center gap-1"><CalendarIcon size={18} /> Birthdate</label>
                  {isEditing ? (
                    <input type="date" name="birthdate" value={editablePatient.birthdate || ""} onChange={handleChange} className="border rounded p-2 w-full" />
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{patient.birthdate || "N/A"}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Age</label>
                  <p className="p-2 bg-gray-100 rounded">{calculateAge(editablePatient.birthdate)}</p>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Gender</label>
                  {isEditing ? (
                    <select name="gender" value={editablePatient.gender} onChange={handleChange} className="border rounded p-2 w-full">
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{patient.gender === "1" ? "Male" : "Female"}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Civil Status</label>
                  {isEditing ? (
                    <select name="civil_status" value={editablePatient.civil_status} onChange={handleChange} className="border rounded p-2 w-full">
                      <option value="0">Single</option>
                      <option value="1">Married</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-gray-100 rounded">{patient.civil_status === "1" ? "Married" : "Single"}</p>
                  )}
                </div>

                {!isNonPersonnel && (
                  <div className="flex flex-col">
                    <label className="font-semibold flex items-center gap-1"><StethoscopeIcon size={18} /> Department</label>
                    {isEditing ? (
                      <input type="text" name="department" value={editablePatient.department || ""} onChange={handleChange} className="border rounded p-2 w-full" />
                    ) : (
                      <p className="p-2 bg-gray-100 rounded">{patient.department || "N/A"}</p>
                    )}
                  </div>
                )}

                {isStudent && (
                  <>
                    <div className="flex flex-col">
                      <label className="font-semibold flex items-center gap-1"><HeartPulseIcon size={18} /> Program</label>
                      {isEditing ? (
                        <input type="text" name="program" value={editablePatient.program || ""} onChange={handleChange} className="border rounded p-2 w-full" />
                      ) : (
                        <p className="p-2 bg-gray-100 rounded">{patient.program || "N/A"}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>

            <div className="flex justify-end mt-4 space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={() => { onSave(editablePatient); setIsEditing(false); }}>Save</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PatientProfile;