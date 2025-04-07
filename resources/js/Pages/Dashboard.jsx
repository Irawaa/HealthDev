import React, { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"; // Shadcn Cards
import { Head } from "@inertiajs/react";
import { Sun, Clock, Users, BarChart, ArrowUpCircle } from "lucide-react"; // Additional icons for enhanced UI
import { Line } from "react-chartjs-2"; // Import the Line chart component from react-chartjs-2
import { Pie } from "react-chartjs-2"; // Import the Pie chart component from react-chartjs-2
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Shadcn Table components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // For Pie chart
} from "chart.js"; // Import required chart.js components
import { usePage } from "@inertiajs/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement // For Pie chart
);

const Dashboard = ({
    totalFdarRecords,
    totalBpRecords,
    totalDentalCertificates,
    totalLaboratoryExamReferrals,
    totalMedicalCertificates,
    totalPreParticipatoryRecords,
    totalPrescriptions,
    totalDentalRecords,
    totalMedicalRecords,
    totalGeneralReferrals,
    totalConsultations,
    totalRecords,
    totalReferred,
    recentPatients = [],
}) => {


    console.log("Dashboard Props:", totalBpRecords);
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [weather, setWeather] = useState("Sunny");

    // Dummy data for records
    const dashboardData = {
        records: totalRecords ?? 0, // Use 0 if totalRecords is undefined or null
        consultations: totalConsultations ?? 0, // Use 0 if totalConsultations is undefined or null
        referrals: totalReferred ?? 0, // Use 0 if totalReferred is undefined or null
        otherMetrics: totalPrescriptions ?? 0, // Use 0 if totalPrescriptions is undefined or null
    };

    // Dummy chart data for Line Chart
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Consultations",
                data: [100, 150, 200, 175, 225, 250],
                borderColor: "rgba(75, 192, 192, 1)", // Gradient color for line
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Gradient fill
                fill: true, // To fill the area under the line
            },
        ],
    };

    // Dummy pie chart data
    const pieChartData = {
        labels: ["Consultations", "Referrals", "Records", "Prescriptions"],
        datasets: [
            {
                data: [
                    totalConsultations ?? 0, // Use 0 if totalConsultations is undefined or null
                    totalReferred ?? 0, // Use 0 if totalReferred is undefined or null
                    totalRecords ?? 0, // Use 0 if totalRecords is undefined or null
                    totalPrescriptions ?? 0 // Use 0 if totalPrescriptions is undefined or null
                ],
                backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0", "#FF6384"],
            },
        ],
    };

    // Update time every minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 60000); // Update every minute
        return () => clearInterval(intervalId); // Clean up on unmount
    }, []);

    return (
        <>
            <Head title="Dashboard" />
            <Layout>
                <div className="flex justify-between items-center mb-7 flex-wrap px-4">
                    <h1 className="text-3xl sm:text-2xl font-bold">Dashboard</h1>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Card 1 - Records */}
                    <Card className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white">
                        <CardHeader>
                            <h2 className="text-xl font-bold">Number of Records</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl">{dashboardData.records}</p>
                            <p className="text-sm">Total records in the system</p>
                        </CardContent>
                        <CardFooter>
                            <ArrowUpCircle className="w-6 h-6" />
                        </CardFooter>
                    </Card>

                    {/* Card 2 - Consultations */}
                    <Card className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white">
                        <CardHeader>
                            <h2 className="text-xl font-bold">Consultations</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl">{dashboardData.consultations}</p>
                            <p className="text-sm">Total consultations this month</p>
                        </CardContent>
                        <CardFooter>
                            <Users className="w-6 h-6" />
                        </CardFooter>
                    </Card>

                    {/* Card 3 - Referrals */}
                    <Card className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white">
                        <CardHeader>
                            <h2 className="text-xl font-bold">Referrals</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl">{dashboardData.referrals}</p>
                            <p className="text-sm">Total referrals made</p>
                        </CardContent>
                        <CardFooter>
                            <BarChart className="w-6 h-6" />
                        </CardFooter>
                    </Card>
                </div>

                {/* Main Content with Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
                    {/* Recent Patient Consultations Table with Shadcn Table */}
                    <div className="col-span-2 overflow-x-auto">
                        <Card className="mb-6">
                            <CardHeader>
                                <h2 className="text-xl font-bold">Recent Patient Consultations</h2>
                            </CardHeader>
                            <CardContent>
                                {/* Using Shadcn Table */}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="px-4 py-2 text-left">Patient Name</TableHead>
                                            <TableHead className="px-4 py-2 text-left">Diagnosis</TableHead>
                                            <TableHead className="px-4 py-2 text-left">Consultation Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(recentPatients ?? []).map((patient) => (
                                            <TableRow key={`${patient.id}-${patient.consultationDate}-${patient.createdAt}`} className="cursor-pointer hover:bg-gray-100">
                                                <TableCell className="border px-4 py-2">{patient.name}</TableCell>
                                                <TableCell className="border px-4 py-2">{patient.record}</TableCell>
                                                <TableCell className="border px-4 py-2">{patient.consultationDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Weather, Time, and New Card (Positioned on the Right) */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Weather Card */}
                        <Card className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white mb-6">
                            <CardHeader>
                                <h2 className="text-xl font-bold">Weather</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <Sun className="w-6 h-6 mr-2" />
                                    <p className="text-2xl">{weather}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Time Card */}
                        <Card className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 text-white mb-6">
                            <CardHeader>
                                <h2 className="text-xl font-bold">Time</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <Clock className="w-6 h-6 mr-2" />
                                    <p className="text-2xl">{time}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* New Card */}
                        <Card className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white mb-6">
                            <CardHeader>
                                <h2 className="text-xl font-bold">New Card</h2>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl">Some data or info</p>
                                <p className="text-sm">This is a new card added on the right side.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Chart Section - Shadcn-styled chart */}
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-xl font-bold">Consultations Over Time</h2>
                    </CardHeader>
                    <CardContent>
                        {/* Grid container to position the charts side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                            <div className="w-full">
                                {/* Line Chart */}
                                <Line data={chartData} options={{ responsive: true }} />
                            </div>
                            <div className="w-full">
                                {/* Pie Chart */}
                                <Pie data={pieChartData} options={{ responsive: true }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Layout>
        </>
    );
};

export default Dashboard;
