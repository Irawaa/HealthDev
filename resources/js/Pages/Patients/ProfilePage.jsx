import React, { useState, useEffect, createContext, useContext } from "react";
import Layout from "@/components/layout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion"; // Import Framer Motion
import MedicalRecordDialog from "@/components/MedicalRecordForm/medical-records-dialog";
import FDARModal from "@/components/FDAR/fdar-records-dialog";
import BPModal from "@/components/BP/bp-modal";
import IncidentModal from "@/components/Incidents/incident-reports-modal";
import PrescriptionModal from "@/components/Prescription/prescription-modal";
import CertificatesModal from "@/components/Certificate/certificate-dialog";
import ReferralModal from "@/components/Referral/referral-dialog";
import PreParticipatoryModal from "../Pre-Participatory/preparticipatory-form-dialog";

export const CommonDiseasesContext = createContext();
export const useCommonDiseases = () => useContext(CommonDiseasesContext);

export const PhysicianStaffContext = createContext();
export const usePhysicianStaff = () => useContext(PhysicianStaffContext);

const PatientProfile = ({ patient, colleges, departments, commonDiseases, physicianStaff }) => {
  if (!patient) return null;
  console.log(patient);
  const [pageLoading, setPageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePatient, setEditablePatient] = useState({ ...patient });
  const [activeTab, setActiveTab] = useState("medical");
  const [showInfo, setShowInfo] = useState(false);
  const [age, setAge] = useState("0");

  useEffect(() => {
    const startLoading = () => setPageLoading(true);
    const stopLoading = () => setPageLoading(false);

    // Listen for page navigation events
    router.on("start", startLoading);
    router.on("finish", stopLoading);

    // Cleanup function to remove listeners
    return () => {
      router.on("start", () => { }); // Reset handler
      router.on("finish", () => { }); // Reset handler
    };
  }, []);

  // Get College
  const college = colleges?.find(col =>
    col.college_id === patient.student?.college_id ||
    col.college_id === patient.personnel?.college_id
  ) || null;

  // Get Program
  const program = college?.programs?.find(prog => prog.program_id === patient.student?.program_id) || null;

  // Get Department
  const department = departments?.find(dept => dept.dept_id === patient.personnel?.dept_id) || null;


  useEffect(() => {
    if (patient?.birthdate) {
      setAge(calculateAge(patient.birthdate));
    }
  }, [patient]);

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    if (isNaN(birthDate)) return "Invalid Date";
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

  const fullName = `${editablePatient.lname}, ${editablePatient.fname}${editablePatient.mname ? ' ' + editablePatient.mname.trim() + '.' : ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start position
      animate={{ opacity: 1, y: 0 }} // End position
      exit={{ opacity: 0, y: -20 }} // Exit animation
      transition={{ duration: 0.4, ease: "easeInOut" }} // Smooth transition
    >
      <Head title="Patient Profile" />
      <Layout>
        <CommonDiseasesContext.Provider value={commonDiseases}>
          <PhysicianStaffContext.Provider value={physicianStaff}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}  // Slide in from below
              animate={{ opacity: 1, y: 0 }}  // Move to position
              transition={{ duration: 0.4, ease: "easeOut" }}  // Smooth easing
              className="space-y-6 p-6"
            >
              <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-green-700">Patient Profile</h1>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      router.visit(`/patients?${params.toString()}`, { preserveState: true });
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Back
                  </button>
                </div>

                {/* Avatar & Name Section */}
                <Card className="w-full flex flex-col bg-white rounded-lg shadow-lg p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-gray-500 shadow-md">
                      <AvatarImage src={patient.avatar ? patient.avatar : "/images/default_avatar.jpg"} alt="Avatar" />
                      <AvatarFallback>{patient.fname?.charAt(0)}{patient.lname?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center text-center">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {fullName.charAt(0).toUpperCase() + fullName.slice(1)}
                      </h2>
                      <Badge className="mt-2 px-4 py-1 text-sm sm:text-md font-semibold rounded-md">
                        {patient.type.charAt(0).toUpperCase() + patient.type.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Patient Info Dropdown */}
                  <motion.button
                    onClick={() => setShowInfo(!showInfo)}
                    className="w-full flex justify-between items-center text-left py-4 text-lg font-semibold text-gray-800 bg-gray-100 rounded-lg shadow-md px-6 hover:bg-gray-200 transition"
                  >
                    Patient Information
                    {showInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </motion.button>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={showInfo ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full bg-white shadow-md rounded-lg border border-gray-300 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-md p-6">
                      {patient.birthdate && <p><strong>Birthdate:</strong> {patient.birthdate}</p>}
                      {age !== "0" && <p><strong>Age:</strong> {age}</p>}
                      {patient.gender !== null && (
                        <p><strong>Gender:</strong> {Number(patient.gender) === 0 ? "Female" : Number(patient.gender) === 1 ? "Male" : "Unspecified"}</p>
                      )}
                      {patient.emailaddress && <p><strong>Email:</strong> {patient.emailaddress}</p>}
                      {patient.mobile && <p><strong>Mobile:</strong> {patient.mobile}</p>}
                      {patient.telephone && <p><strong>Telephone:</strong> {patient.telephone}</p>}
                      {patient.status && <p><strong>Status:</strong> {patient.status.toUpperCase()}</p>}
                      {patient.civil_status && <p><strong>Civil Status:</strong> {patient.civil_status}</p>}
                      {patient.student?.stud_id && <p><strong>Student ID:</strong> {patient.student.stud_id}</p>}
                      {college?.college_description && <p><strong>College:</strong> {college.college_description}</p>}
                      {program?.program_description && <p><strong>Program:</strong> {program.program_description}</p>}
                      {patient.type === "employee" && department?.name && (
                        <p><strong>Department:</strong> {department.name}</p>
                      )}

                      {/* Address Section (Only if at least one part exists) */}
                      {(patient.student?.address_house || patient.student?.address_brgy || patient.student?.address_citytown || patient.student?.address_province || patient.student?.address_zipcode) && (
                        <p><strong>Address: </strong>
                          {[
                            patient.student?.address_house,
                            patient.student?.address_brgy,
                            patient.student?.address_citytown,
                            patient.student?.address_province,
                            patient.student?.address_zipcode
                          ].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Card>

                {/* Tabs Section */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <div className="overflow-x-auto">
                    <TabsList className="flex whitespace-nowrap gap-2 border-b border-gray-300 pb-2">
                      <TabsTrigger className="px-3 py-1 text-sm" value="medical">Medical</TabsTrigger>
                      <TabsTrigger className="px-3 py-1 text-sm" value="dental">Dental</TabsTrigger>
                      <TabsTrigger className="px-3 py-1 text-sm" value="fdar">FDAR</TabsTrigger>
                      <TabsTrigger className="px-3 py-1 text-sm" value="bp">BP</TabsTrigger>
                      <TabsTrigger className="px-3 py-1 text-sm" value="incident">Incidents</TabsTrigger>
                      <TabsTrigger className="px-3 py-1 text-sm" value="prescription">Rx</TabsTrigger>
                      <TabsTrigger className="px-3 py-1 text-sm" value="pre-participatory">Pre-Participation</TabsTrigger>
                      <TabsTrigger className="px-3 py-1 text-sm" value="certificates">Certificates</TabsTrigger>
                      <TabsTrigger className="px-3 py-1 text-sm" value="referrals">Referrals</TabsTrigger>
                    </TabsList>
                  </div>
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-3"
                  >
                    {activeTab === "medical" && <MedicalRecordDialog activeTab={activeTab} patient={patient} />}
                    {activeTab === "fdar" && <FDARModal activeTab={activeTab} patient={patient} />}
                    {activeTab === "bp" && <BPModal activeTab={activeTab} patient={patient} />}
                    {activeTab === "incident" && <IncidentModal activeTab={activeTab} patient={patient} />}
                    {activeTab === "prescription" && <PrescriptionModal activeTab={activeTab} patient={patient} />}
                    {activeTab === "certificates" && <CertificatesModal activeTab={activeTab} patient={patient} />}
                    {activeTab === "referrals" && <ReferralModal activeTab={activeTab} patient={patient} />}
                    {activeTab === "pre-participatory" && <PreParticipatoryModal activeTab={activeTab} patient={patient} />}
                  </motion.div>
                </Tabs>
              </div>

              {pageLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Smooth Spinning Loader */}
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-green-500 border-l-green-400 border-r-green-300 border-b-green-200"></div>
                    <p className="mt-4 text-green-300 text-lg font-semibold animate-pulse">Loading, please wait...</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </PhysicianStaffContext.Provider>
        </CommonDiseasesContext.Provider >
      </Layout>
    </motion.div>
  );
};

export default PatientProfile;
