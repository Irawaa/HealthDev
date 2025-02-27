import React, { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePage } from "@inertiajs/react";
import PatientProfile from "./Profile";
import AddPatient from "@/components/add-patient";
import FilterDropdown from "@/components/patient-filter";

const PatientIndex = () => {
    const { patients } = usePage().props;
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        department: [],
        program: [],
        type: [],
        medicalStatus: []
    });

    // Function to capitalize first letter of each word
    const formatType = (type) => {
        if (!type) return "Unknown";
        return type
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
    };

    // Filter patients based on search and filter criteria
    const filteredPatients = patients.filter((patient) => {
        const fullName = `${patient.lname} ${patient.fname} ${patient.mname || ""}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());

        const matchesFilters = Object.entries(filters).every(([category, values]) => {
            if (!values.length) return true;
            return values.includes(patient[category]);
        });

        return matchesSearch && matchesFilters;
    });

    return (
        <Layout>
            <div className="space-y-4 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Patient Records</h1>
                    <Button onClick={() => setOpenAdd(true)}>Add Patient</Button>
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

                {/* Patient Records - Card View */}
                <div className="bg-white shadow rounded-lg p-4">
                    <ScrollArea className="h-[500px] overflow-y-auto">
                        <div className="flex flex-col gap-4 mr-[15px]">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <Card
                                        key={patient.patient_id}
                                        className="cursor-pointer border border-gray-200 rounded-lg"
                                        onClick={() => setSelectedPatient(patient)}
                                    >
                                        <CardHeader className="p-4 border-b border-gray-300">
                                            <CardTitle className="text-lg font-semibold">
                                                {`${patient.lname}, ${patient.fname} ${patient.mname || ""}`}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-2">
                                            <p><strong>Birthdate:</strong> {patient.birthdate || "-"}</p>
                                            <p className="flex items-center gap-2">
                                                <strong>Gender:</strong>
                                                <Badge variant="outline">
                                                    {patient.gender ? "Male" : "Female"}
                                                </Badge>
                                            </p>
                                            <p><strong>Type:</strong> {formatType(patient.type)}</p>
                                            <p><strong>Email:</strong> {patient.email || "-"}</p>
                                            <p>
                                                <strong>Contact:</strong>{" "}
                                                {patient.mobile || patient.telephone ? (
                                                    <>
                                                        {patient.mobile && <span>{patient.mobile}</span>}
                                                        {patient.telephone && <span> / {patient.telephone}</span>}
                                                    </>
                                                ) : "-"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 col-span-full">No records found.</p>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Patient Profile Popup */}
            {selectedPatient && <PatientProfile patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}

            {/* Add Patient Dialog */}
            <AddPatient open={openAdd} onClose={() => setOpenAdd(false)} />
        </Layout>
    );
};

export default PatientIndex;
