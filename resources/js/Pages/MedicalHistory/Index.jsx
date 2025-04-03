import React from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Head, router } from "@inertiajs/react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";

// ShadCN Table components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Index = ({ medicalHistory, filter }) => {
    // Handle filter change and use Inertia.js visit method to update the URL
    const handleFilterChange = (event) => {
        const selectedFilter = event.target.value;
        console.log("Selected filter:", selectedFilter); // Debugging log for filter change

        router.visit(`/medical-history?filter=${selectedFilter}`, {
            method: "get", // Ensure it uses the GET method for the request
            preserveState: true, // Preserve the state (optional)
        });
    };

    const formatDate = (date) => {
        const newDate = new Date(date);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // 12-hour format with AM/PM
        };
        return newDate.toLocaleString('en-US', options); // Format date using locale-based formatting
    };

    // Render the correct records based on the selected type
    const renderRecordsTable = () => {
        const records = medicalHistory[filter] || [];
        return (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <Card>
                    <CardTitle className="font-bold text-xl p-4 bg-gray-50 border-b">
                        {(filter || "").replace(/([A-Z])/g, " $1").toUpperCase()}
                    </CardTitle>
                    <CardContent>
                        <div className="overflow-x-auto p-4">
                            <Table className="min-w-full text-sm text-gray-700">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="p-3">Patient Name</TableHead>
                                        <TableHead className="p-3">Record Date</TableHead>
                                        <TableHead className="p-3">Status</TableHead>
                                        <TableHead className="p-3">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map((record, index) => {
                                        const patient = record.patient || {};
                                        const fullName = `${patient.fname} ${patient.mname || ""} ${patient.lname}`;
                                        return (
                                            <TableRow key={index} className="hover:bg-gray-100 transition-colors">
                                                <TableCell className="p-3">{fullName || "N/A"}</TableCell>
                                                <TableCell className="p-3">{formatDate(record.created_at)}</TableCell>
                                                <TableCell className="p-3">{record.status || "N/A"}</TableCell>
                                                <TableCell className="p-3">
                                                    {/* Button to view more details */}
                                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-all">
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <>
            <Head title="Medical History" />
            <Layout>
                <div className="flex justify-between items-center mb-7 flex-wrap">
                    <h1 className="text-3xl sm:text-2xl font-bold">Medical History</h1>

                    <div className="flex items-center gap-2 ml-auto mt-2 sm:mt-0">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-all">
                            <Filter className="h-4 mr-1" /> Filter
                        </Button>
                    </div>
                </div>

                {/* Filter Dropdown to select the record type */}
                <div className="mb-7">
                    <select
                        value={filter} // Use `filter` prop passed from the backend
                        onChange={handleFilterChange}
                        className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="medicalRecordsAsNurse">Medical Records</option>
                        <option value="dentalRecordsAsNurse">Dental Records</option>
                        <option value="bpFormsAsNurse">BP Forms</option>
                        <option value="fdarFormsAsNurse">FDAR Forms</option>
                        <option value="incidentReportsAsNurse">Incident Reports</option>
                        <option value="medicalCertificatesAsNurse">Medical Certificates</option>
                        <option value="dentalCertificatesAsNurse">Dental Certificates</option>
                        <option value="prescriptionsAsNurse">Prescriptions</option>
                        <option value="preParticipatoriesAsNurse">Pre-Participatories</option>
                        <option value="generalReferralsAsNurse">General Referrals</option>
                        <option value="laboratoryExamReferralsAsNurse">Laboratory Exam Referrals</option>
                    </select>
                </div>

                <div className="space-y-10">
                    {/* Render the table based on selected record type */}
                    {renderRecordsTable()}
                </div>
            </Layout>
        </>
    );
};

export default Index;
