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
import PatientRoleDialog from "@/components/patient-role-dialog"; // Import Patient Role Dialog
import AddEmployeeDialog from "@/components/EmployeePatients/add-employee-dialog"; // Assuming the employee dialog exists

const Index = () => {
    const { patients, colleges } = usePage().props;
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [openStudent, setOpenStudent] = useState(false);  // For AddStudentDialog
    const [openEmployee, setOpenEmployee] = useState(false); // For AddEmployeeDialog
    const [openRoleDialog, setOpenRoleDialog] = useState(false); // For PatientRoleDialog
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        department: [],
        program: [],
        type: [],
        medicalStatus: [],
    });

    const patientTypeColors = {
        student: "bg-green-100",
        employee: "bg-blue-100",
        non_personnel: "bg-yellow-100",
        clinic_staff: "bg-red-100",
        default: "bg-gray-100",
    };

    const formatType = (type) => {
        if (!type) return "Unknown";
        return type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
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
        setOpenRoleDialog(false); // Close PatientRoleDialog first
        if (role === "student") {
            setOpenStudent(true); // Open AddStudentDialog when student is selected
        } else if (role === "employee") {
            setOpenEmployee(true); // Open AddEmployeeDialog when employee is selected
        }
    };

    return (
        <>
            <Head title="Patients" />
            <Layout>
                <div className="space-y-4 p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Patient Records</h1>
                        <div className="flex gap-2">
                            <Button onClick={() => setOpenRoleDialog(true)} variant="outline">
                                Select Role
                            </Button>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-wrap gap-4 mb-3">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border p-2 text-base rounded w-full md:w-2/5"
                        />
                        <FilterDropdown filters={filters} setFilters={setFilters} />
                    </div>

                    {/* Patient Records */}
                    <div className="bg-white shadow rounded-lg p-4">
                        <ScrollArea className="h-[500px] overflow-y-auto">
                            <div className="flex flex-col gap-4 mr-[15px]">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => {
                                        const bgColor = patientTypeColors[patient.type] || patientTypeColors.default;

                                        return (
                                            <Card
                                                key={patient.patient_id}
                                                className={`cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 ease-in-out border border-gray-200 rounded-lg ${bgColor}`}
                                                onClick={() => setSelectedPatient(patient)}
                                            >
                                                <CardHeader className="p-4 border-b border-gray-300">
                                                    <CardTitle className="text-lg font-semibold text-gray-800">
                                                        {`${patient.lname}, ${patient.fname} ${patient.mname || ""}`}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 space-y-2 text-gray-700">
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
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-gray-500 col-span-full">No records found.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Patient Profile Popup */}
                {selectedPatient && <PatientProfile patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}

                {/* Add Student Dialog */}
                <AddStudentDialog key={`add-student-${openStudent}`} open={openStudent} onClose={handleCloseDialog} colleges={colleges} />

                {/* Add Employee Dialog */}
                <AddEmployeeDialog key={`add-employee-${openEmployee}`} open={openEmployee} onClose={handleCloseDialog} colleges={colleges} />

                {/* Patient Role Dialog */}
                {openRoleDialog && (
                    <PatientRoleDialog
                        open={openRoleDialog}
                        onClose={() => setOpenRoleDialog(false)}
                        onSelect={handleRoleSelect} // 🔥 Pass the handler here
                        colleges={colleges}
                    />
                )}
            </Layout>
        </>
    );
};

export default Index;
