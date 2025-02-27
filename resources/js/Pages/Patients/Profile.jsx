import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import Medical from "@/components/PatientForms/Medical";

const InfoField = ({ label, value, name, type = "text", options = [], isEditing, handleChange }) => (
  <div className="flex flex-col w-full space-y-1">
    <label className="text-xs sm:text-sm font-semibold text-gray-700">{label}</label>
    {isEditing ? (
      type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      )
    ) : (
      <p className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-800">{value || "N/A"}</p>
    )}
  </div>
);

const PatientProfile = ({ patient, onClose, onSave }) => {
  if (!patient) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editablePatient, setEditablePatient] = useState({ ...patient });
  const [activeTab, setActiveTab] = useState("medical");
  const [showInfo, setShowInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditablePatient((prev) => ({ ...prev, [name]: value }));
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const fullName = `${editablePatient.lname}, ${editablePatient.fname} ${editablePatient.mname || ""}`;

  return (
    <Dialog open={!!patient} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen sm:max-w-[95vw] sm:max-h-[95vh] p-6 rounded-xl shadow-xl bg-gray-50 flex flex-col overflow-hidden">
        {/* ✅ Scrollable Content Wrapper - Fullscreen */}
        <div className="w-full h-full flex flex-col overflow-y-auto">
          <Card className="w-full flex flex-col bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* ✅ Avatar & Name Section - Centered & Improved */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-gray-500 shadow-md" src="/default-avatar.png" alt="Avatar" />
              <div className="flex flex-col items-center text-center">
                {isEditing ? (
                  <input
                    type="text"
                    name="lname"
                    value={editablePatient.lname}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-xl font-bold text-gray-900 w-full max-w-xs"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                )}
                <Badge className="mt-2 px-4 py-1 text-sm sm:text-md font-semibold bg-gray-200 text-gray-800 rounded-md">
                  {editablePatient.role}
                </Badge>
              </div>
            </div>

            {/* ✅ Patient Info Dropdown - Scrollable & Lower Position */}
            <div className="w-full">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-full flex justify-between items-center text-left py-4 text-lg font-semibold text-gray-800 bg-gray-100 rounded-lg shadow-md px-6 hover:bg-gray-200 transition"
              >
                Patient Information
                {showInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {/* 🔥 Scrollable Dropdown for Easy Access */}
              <div
                className={`w-full bg-white shadow-md rounded-lg border border-gray-300 transition-all duration-300 ${
                  showInfo ? "max-h-[400px] p-6 mt-4 overflow-y-auto" : "max-h-0 overflow-hidden"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-md">
                  <InfoField label="Birthdate" value={editablePatient.birthdate} name="birthdate" type="date" isEditing={isEditing} handleChange={handleChange} />
                  <InfoField label="Age" value={calculateAge(editablePatient.birthdate)} />
                  <InfoField
                    label="Gender"
                    value={editablePatient.gender === "1" ? "Male" : "Female"}
                    name="gender"
                    type="select"
                    options={[
                      { value: "1", text: "Male" },
                      { value: "0", text: "Female" },
                    ]}
                    isEditing={isEditing}
                    handleChange={handleChange}
                  />
                  <InfoField label="Address" value={editablePatient.address} name="address" type="text" isEditing={isEditing} handleChange={handleChange} />
                  <InfoField label="Department" value={editablePatient.department} name="department" type="text" isEditing={isEditing} handleChange={handleChange} />
                  <InfoField label="Program" value={editablePatient.program} name="program" type="text" isEditing={isEditing} handleChange={handleChange} />
                </div>
              </div>
            </div>
          </Card>

          {/* ✅ Tabs - Fixed (No More Scroll) */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="flex flex-wrap justify-center gap-2 sm:gap-4 border-b border-gray-300 pb-2">
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="dental">Dental</TabsTrigger>
              <TabsTrigger value="fdar">FDAR</TabsTrigger>
              <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
              <TabsTrigger value="incident">Incident Reports</TabsTrigger>
            </TabsList>
            <div className="mt-3">{activeTab === "medical" && <Medical activeTab={activeTab} />}</div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientProfile;
