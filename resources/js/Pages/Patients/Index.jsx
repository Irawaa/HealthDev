import React, { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePage, Head } from "@inertiajs/react";
import PatientProfile from "./Profile";
import AddStudentDialog from "@/components/StudentPatients/add-student-dialog";
import FilterDropdown from "@/components/patient-filter";
import PatientRoleDialog from "@/components/patient-role-dialog";
import AddEmployeeDialog from "@/components/EmployeePatients/add-employee-dialog";

const Index = () => {
    const { patients, colleges, departments } = usePage().props;
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [openStudent, setOpenStudent] = useState(false);
    const [openEmployee, setOpenEmployee] = useState(false);
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        department: [],
        program: [],
        type: [],
        medicalStatus: [],
    });

    const patientTypeColors = {
        student: "bg-green-100 border-green-400",
        employee: "bg-blue-100 border-blue-400",
        non_personnel: "bg-yellow-100 border-yellow-400",
        clinic_staff: "bg-red-100 border-red-400",
        default: "bg-gray-100 border-gray-300",
    };

    const formatType = (type) => {
        if (!type) return "Unknown";
        return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const filteredPatients = patients.filter((patient) => {
        const fullName = `${patient.lname} ${patient.fname} ${patient.mname || ""}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());

        const matchesFilters = Object.entries(filters).every(([category, values]) => {
            if (!values.length) return true;
            return values.includes(patient[category]);
        });

        return matchesSearch && matchesFilters;
    });

    const handleCloseDialog = () => {
        setOpenStudent(false);
        setOpenEmployee(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRoleSelect = (role) => {
        setOpenRoleDialog(false);
        if (role === "student") {
            setOpenStudent(true);
        } else if (role === "employee") {
            setOpenEmployee(true);
        }
    };

    return (
        <>
            <Head title="Patients" />
            <Layout>
                <div className="space-y-6 p-6">
                    {/* Header & Add Button */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-green-700">Patient Records</h1>
                        <Button onClick={() => setOpenRoleDialog(true)} className="bg-green-600 text-white hover:bg-green-700 transition">
                            Add Patient
                        </Button>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-wrap gap-4 mb-3">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-green-400 p-2 text-base rounded-md w-full md:w-2/5 focus:ring-2 focus:ring-green-500"
                        />
                        <FilterDropdown filters={filters} setFilters={setFilters} />
                    </div>

                    {/* Patient Records */}
                    <div className="bg-white shadow-lg rounded-lg p-4 border border-green-300">
                        <ScrollArea className="h-[500px] overflow-y-auto">
                            <div className="flex flex-col gap-4 mr-[15px]">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => {
                                        const bgColor = patientTypeColors[patient.type] || patientTypeColors.default;

                                        // Find the corresponding college and program
                                        const college = colleges.find(col => col.college_id === patient.student?.college_id);
                                        const program = college?.programs.find(prog => prog.program_id === patient.student?.program_id);


                                        return (
                                            <Card
                                                key={patient.patient_id}
                                                className={`cursor-pointer border rounded-lg ${bgColor}`}
                                                onClick={() => setSelectedPatient(patient)}
                                            >
                                                <CardHeader className="p-4 border-b border-green-300">
                                                    <CardTitle className="text-lg font-semibold text-green-800">
                                                        {`${patient.lname}, ${patient.fname} ${patient.mname || ""}`}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 space-y-2 text-green-900">
                                                    <p>
                                                        <strong>Birthdate:</strong> {patient.birthdate || "-"}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <strong>Gender:</strong>
                                                        <Badge variant="outline" className={patient.gender ? "bg-blue-200" : "bg-pink-200"}>
                                                            {patient.gender ? "Male" : "Female"}
                                                        </Badge>
                                                    </div>
                                                    <p>
                                                        <strong>Type:</strong> {formatType(patient.type)}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {patient.email || "-"}
                                                    </p>
                                                    <p>
                                                        <strong>Contact:</strong>{" "}
                                                        {patient.mobile || patient.telephone ? (
                                                            <>
                                                                {patient.mobile && <span>{patient.mobile}</span>}
                                                                {patient.telephone && <span> / {patient.telephone}</span>}
                                                            </>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </p>

                                                    {/* Fix: Use divs instead of <p> inside the condition */}
                                                    {patient.type === "student" && (
                                                        <div>
                                                            <div><strong>College:</strong> {college?.college_description || "N/A"}</div>
                                                            <div><strong>Program:</strong> {program?.program_description || "N/A"}</div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-green-600 col-span-full">No records found.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Patient Profile Popup */}
                {selectedPatient && <PatientProfile patient={selectedPatient} onClose={() => setSelectedPatient(null)} colleges={colleges} departments={departments} />}

                {/* Add Student Dialog */}
                <AddStudentDialog key={`add-student-${openStudent}`} open={openStudent} onClose={handleCloseDialog} colleges={colleges} />

                {/* Add Employee Dialog */}
                <AddEmployeeDialog key={`add-employee-${openEmployee}`} open={openEmployee} onClose={handleCloseDialog} colleges={colleges} />

                {/* Patient Role Dialog */}
                {openRoleDialog && (
                    <PatientRoleDialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} onSelect={handleRoleSelect} colleges={colleges} />
                )}
            </Layout>
        </>
    );
};

export default Index;
