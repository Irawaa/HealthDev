import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import MedicalRecordDialog from "@/components/MedicalRecordForm/medical-records-dialog";
import FDARModal from "@/components/FDAR/FDARModal";
import BPModal from "@/components/BP/BPModal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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

const PatientProfile = ({ patient, onClose, onSave, colleges, departments }) => {
  if (!patient) return null;

  // console.log(patient);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePatient, setEditablePatient] = useState({ ...patient });
  const [activeTab, setActiveTab] = useState("medical");
  const [showInfo, setShowInfo] = useState(false);
  const [age, setAge] = useState("0"); // State for age

  const college = colleges?.find(col =>
    col.college_id === patient.student?.college_id ||
    col.college_id === patient.personnel?.college_id
  ) || null;
  
  const program = college?.programs?.find(prog => prog.program_id === patient.student?.program_id) || null;
  
  const department = departments?.find(dept => dept.dept_id === patient.personnel?.dept_id) || null;  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditablePatient((prev) => {
      const updatedPatient = { ...prev, [name]: value };

      if (name === "birthdate") {
        const newAge = calculateAge(value);
        setAge(newAge);
      }

      return updatedPatient;
    });
  };

  useEffect(() => {
    if (patient && patient.birthdate) {
      const calculatedAge = calculateAge(patient.birthdate);
      setAge(calculatedAge);

      // console.log("Patient Birthdate:", patient.birthdate);
      // console.log("Calculated Age:", calculatedAge);
    }
  }, [patient]); // Ensure it runs when `patient` changes

  const calculateAge = (birthdate) => {
    if (!birthdate) {
      // console.log("Birthdate is missing or invalid.");
      return "N/A";
    }

    const birthDate = new Date(birthdate);
    if (isNaN(birthDate.getTime())) {
      // console.log("Invalid birthdate format:", birthdate);
      return "Invalid Date";
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    // Check if the birthday has already occurred this year
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    // console.log(`Birthdate: ${birthDate.toISOString()} | Age: ${age}`);
    return age;
  };

  const fullName = `${editablePatient.lname}, ${editablePatient.fname} ${editablePatient.mname || ""}`;

  return (
    <Dialog open={!!patient} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen sm:max-w-[95vw] sm:max-h-[95vh] p-6 rounded-xl shadow-xl bg-gray-50 flex flex-col overflow-hidden">
        {/* ✅ Accessibility Fix: Add DialogTitle */}
        <VisuallyHidden>
          <DialogTitle>Patient Profile</DialogTitle>
          <DialogDescription>View and manage patient details.</DialogDescription>
        </VisuallyHidden>
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
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-full flex justify-between items-center text-left py-4 text-lg font-semibold text-gray-800 bg-gray-100 rounded-lg shadow-md px-6 hover:bg-gray-200 transition"
            >
              Patient Information
              {showInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <div
              className={`w-full bg-white shadow-md rounded-lg border border-gray-300 transition-all duration-300 overflow-hidden ${showInfo ? "max-h-[500px] p-6 mt-4 overflow-y-auto" : "max-h-0"
                }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-md">
                <InfoField label="Birthdate" value={patient.birthdate} name="birthdate" type="date" isEditing={isEditing} handleChange={handleChange} />
                <InfoField label="Age" value={age} />

                <InfoField
                  label="Gender"
                  value={patient.gender == "0" ? "Female" : patient.gender == "1" ? "Male" : "Unspecified"}
                  name="gender"
                  type="select"
                  options={[
                    { value: "1", text: "Male" },
                    { value: "0", text: "Female" },
                  ]}
                  isEditing={isEditing}
                  handleChange={handleChange}
                />

                <InfoField
                  label="Address"
                  value={
                    patient.type === "student"
                      ? `${patient.student?.address_house || ''}, ${patient.student?.address_brgy || ''}, ${patient.student?.address_citytown || ''}, ${patient.student?.address_province || ''} ${patient.student?.address_zipcode || ''}`
                      : patient.type === "employee"
                        ? `${patient.personnel?.res_brgy || ''}, ${patient.personnel?.res_city || ''}, ${patient.personnel?.res_prov || ''}, ${patient.personnel?.res_region || ''} ${patient.personnel?.res_zipcode || ''}`
                        : patient.type === "non_personnel"
                          ? `${patient.nonpersonnel?.res_brgy || ''}, ${patient.nonpersonnel?.res_city || ''}, ${patient.nonpersonnel?.res_prov || ''}, ${patient.nonpersonnel?.res_region || ''} ${patient.nonpersonnel?.res_zipcode || ''}`
                          : "N/A"
                  }
                />

                {/* Dynamic Fields Based on Role */}
                {editablePatient.type === "student" && (
                  <>
                    <InfoField label="Program" value={program?.program_description || "N/A"} />
                    <InfoField label="College" value={college?.college_description || "N/A"} />
                  </>
                )}

                {editablePatient.type === "employee" && (
                  <>
                    <InfoField label="Department" value={department ? `${department.name} (${department.acronym})` : "N/A"} />
                    {college && <InfoField label="College" value={college.college_description} />}
                  </>
                )}

                <InfoField label="Email" value={patient.emailaddress || "-"} name="email" isEditing={isEditing} handleChange={handleChange} />

                <InfoField
                  label="Civil Status"
                  value={editablePatient.civil_status === "1" ? "Married" : "Single"}
                  name="civil_status"
                  type="select"
                  options={[
                    { value: "0", text: "Single" },
                    { value: "1", text: "Married" },
                  ]}
                  isEditing={isEditing}
                  handleChange={handleChange}
                />
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
              <TabsTrigger value="perscription">Perscription</TabsTrigger>
            </TabsList>
            <div className="mt-3">
              {activeTab === "medical" && <MedicalRecordDialog activeTab={activeTab} patient={patient} />}
              {activeTab === "fdar" && <FDARModal activeTab={activeTab} patient={patient} />}
              {activeTab === "bp" && <BPModal activeTab={activeTab} patient={patient} />} 
            </div>
          </Tabs>
        </div >
      </DialogContent >
    </Dialog >
  );
};

export default PatientProfile; // ✅ Ensure this is present