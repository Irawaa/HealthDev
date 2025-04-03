import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { usePage, Head, router } from "@inertiajs/react";
import AddStudentDialog from "@/components/StudentPatients/add-student-dialog";
import FilterDropdown from "@/components/patient-filter";
import PatientRoleDialog from "@/components/patient-role-dialog";
import AddEmployeeDialog from "@/components/EmployeePatients/add-employee-dialog";
import AddNonPersonnelDialog from "@/components/NonPersonnelPatients/add-non-personnel-dialog";
import { CheckCircle, AlertCircle, Stethoscope, Heart } from 'lucide-react';

const Index = () => {
    const { patients, colleges, departments, search } = usePage().props;
    console.log(patients);
    const [pageLoading, setPageLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(search || ""); // Preserve search input
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [openStudent, setOpenStudent] = useState(false);
    const [openEmployee, setOpenEmployee] = useState(false);
    const [openNonPersonnel, setOpenNonPersonnel] = useState(false);
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        department: [],
        program: [],
        type: [],
        medicalStatus: [],
    });

    const handleSearch = () => {
        // Check if the searchTerm is empty
        if (!searchTerm.trim()) {
            // Reset the filters and search query when no search term is provided
            router.get("/patients", { search: "", ...filters }, { preserveState: true, replace: true });
            return;
        }

        setLoading(true); // Start loading

        // When there's a search term, include the search and filters in the request
        router.get(
            "/patients",
            { search: searchTerm, ...filters },  // Include filters and search query
            {
                preserveState: true,
                replace: true,
                onFinish: () => setLoading(false), // Stop loading when request is done
            }
        );
    };

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

    const getMedicalStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CheckCircle className="text-green-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Healthy</p>
                        </TooltipContent>
                    </Tooltip>
                );
            case 'sick':
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertCircle className="text-red-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Sick</p>
                        </TooltipContent>
                    </Tooltip>
                );
            case 'under_treatment':
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Stethoscope className="text-yellow-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Under Treatment</p>
                        </TooltipContent>
                    </Tooltip>
                );
            default:
                return null;
        }
    };

    const formatType = (type) => {
        if (!type) return "Unknown";
        return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handleCloseDialog = () => {
        setOpenStudent(false);
        setOpenEmployee(false);
        setOpenNonPersonnel(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRoleSelect = (role) => {
        setOpenRoleDialog(false);
        if (role === "student") {
            setOpenStudent(true);
        } else if (role === "employee") {
            setOpenEmployee(true);
        } else if (role === "non_personnel") {
            setOpenNonPersonnel(true);
        }
    };

    return (
        <>
            <Head title="Patients" />
            <Layout>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-6 p-6"
                >
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
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()} // Press Enter to search
                            className="border border-green-400 p-2 text-base rounded-md w-full md:w-2/5 focus:ring-2 focus:ring-green-500"
                        />
                        <Button onClick={handleSearch} className="bg-green-600 text-white hover:bg-green-700 transition">
                            Search
                        </Button>
                        {/* <FilterDropdown filters={filters} setFilters={setFilters} /> */}
                        {/* Type Filter Dropdown */}
                        <FilterDropdown filters={filters} setFilters={setFilters} />
                    </div>

                    {/* Patient Records */}
                    <div className="bg-white shadow-lg rounded-lg p-4 border border-green-300">
                        <ScrollArea className="h-[400px] overflow-y-auto">
                            <div className="grid grid-cols-1 gap-6">
                                {loading ? (
                                    <div className="flex justify-center items-center h-[300px]">
                                        <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                    </div>
                                ) : patients.length > 0 ? (
                                    patients.map((patient) => {
                                        // Find the corresponding college and program
                                        const college = colleges.find(col => col.college_id === patient.student?.college_id);
                                        const program = college?.programs.find(prog => prog.program_id === patient.student?.program_id);

                                        return (

                                            <motion.div
                                                key={patient.patient_id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <Card
                                                    key={patient.patient_id}
                                                    className={`cursor-pointer border rounded-lg relative overflow-hidden`}
                                                    onClick={() => {
                                                        const params = new URLSearchParams();
                                                        if (searchTerm) params.set("search", searchTerm); // Add search query
                                                        router.visit(`/patients/${patient.patient_id}?${params.toString()}`, { preserveState: true });
                                                    }}
                                                >
                                                    <CardHeader className="p-3 border-b border-green-300 relative">
                                                        <CardTitle className="text-lg font-semibold text-green-800">
                                                            {`${patient.lname}, ${patient.fname} ${patient.mname || ""}`}
                                                        </CardTitle>

                                                        {/* Icon in the top-right corner based on medical status */}
                                                        <div className="absolute right-5 top-3 bottom-3">
                                                            {getMedicalStatusIcon(patient.status)}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-3 text-sm text-green-900">
                                                        <table className="w-full">
                                                            <tbody>
                                                                {/* Gender and Type Row */}
                                                                <tr>
                                                                    <td className="py-2 font-semibold text-green-700">Gender:</td>
                                                                    <td className="py-2">
                                                                        <Badge variant="outline" className={patient.gender ? "bg-blue-200" : "bg-pink-200"}>
                                                                            {patient.gender ? "Male" : "Female"}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="py-2 font-semibold text-green-700">Type:</td>
                                                                    <td className="py-2">
                                                                        <Badge variant="outline" className="bg-yellow-200">
                                                                            {formatType(patient.type)}
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                                {/* Contact Info Row */}
                                                                <tr>
                                                                    <td className="py-2 font-semibold text-green-700">Contact:</td>
                                                                    <td className="py-2" colSpan={1}>
                                                                        {patient.mobile || patient.telephone ? (
                                                                            <>
                                                                                {patient.mobile && <span>{patient.mobile}</span>}
                                                                                {patient.telephone && <span> / {patient.telephone}</span>}
                                                                            </>
                                                                        ) : (
                                                                            "-"
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                {/* Medical Records Row */}
                                                                {patient.medical_records && patient.medical_records.length > 0 && (
                                                                    <tr>
                                                                        <td className="py-2 font-semibold text-green-700">Medical Records:</td>
                                                                        <td className="py-2" colSpan={1}>
                                                                            <Badge variant="outline" className="bg-green-200">
                                                                                {`Has ${patient.medical_records.length} Records`}
                                                                            </Badge>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                                {/* College and Program Row (For Students) */}
                                                                {patient.type === "student" && (
                                                                    <>
                                                                        <tr>
                                                                            <td className="py-2 font-semibold text-green-700">College:</td>
                                                                            <td className="py-2" colSpan={3}>
                                                                                {college?.college_description || "N/A"}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="py-2 font-semibold text-green-700">Program:</td>
                                                                            <td className="py-2" colSpan={3}>
                                                                                {program?.program_description || "N/A"}
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                        );
                                    })
                                ) : (
                                    <p className="text-center text-green-600 col-span-full">Please enter a search query to find patients.</p>
                                )}
                            </div >
                        </ScrollArea>
                    </div>
                </motion.div>

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

                {/* Patient Profile Popup */}
                {/* {selectedPatient && <PatientProfile patient={selectedPatient} onClose={() => setSelectedPatient(null)} colleges={colleges} departments={departments} />} */}

                {/* Add Student Dialog */}
                {/* <AddStudentDialog key={`add-student-${openStudent}`} open={openStudent} onClose={handleCloseDialog} colleges={colleges} /> */}

                {/* Add Employee Dialog */}
                {/* <AddEmployeeDialog key={`add-employee-${openEmployee}`} open={openEmployee} onClose={handleCloseDialog} colleges={colleges} /> */}

                {/* Add Non-Personnel Dialog */}
                <AddNonPersonnelDialog open={openNonPersonnel} onClose={handleCloseDialog} />
                {/* Patient Role Dialog */}
                {openRoleDialog && (
                    <PatientRoleDialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} onSelect={handleRoleSelect} colleges={colleges} />
                )}
            </Layout >
        </>
    );
};

export default Index;
