import React, { useState } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import Layout from "@/components/layout";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Index = () => {
    const { reviewOfSystemCategories = [], medicalRecords = [], patients = [] } = usePage().props;
    const { reviewOfSystems = [] } = usePage().props;

    const [modalOpen, setModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        patient_id: "",
        review_of_systems: [],
        deformities: [],
    });

    const handleMultiSelect = (value) => {
        const selected = data.review_of_systems.includes(value)
            ? data.review_of_systems.filter((item) => item !== value)
            : [...data.review_of_systems, value];

        setData("review_of_systems", selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("medical-records.store"), {
            onSuccess: () => {
                toast.success("Medical record added successfully!");
                reset();
                setModalOpen(false);
            },
            onError: () => {
                toast.error("Failed to add medical record. Please try again.");
            },
        });
    };

    return (
        <>
            <Head title="Medical Records" />
            <Layout>
                <div className="space-y-6 p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-green-700">Medical Records</h1>
                        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                            <DialogTrigger asChild>
                                <Button>Add Medical Record</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Medical Record</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Select Patient */}
                                    <div>
                                        <Label>Select Patient</Label>
                                        <Select onValueChange={(value) => setData("patient_id", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a patient" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {patients.map((patient) => (
                                                    <SelectItem key={patient.patient_id} value={patient.patient_id}>
                                                        {patient.lname}, {patient.fname}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Review of Systems (Multiple Combo Selection) */}
                                    <div>
                                        <Label>Review of Systems</Label>
                                        <Select onValueChange={handleMultiSelect}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Symptoms" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {reviewOfSystems
                                                    .filter((ros) => ros.category_name === "General Symptoms")
                                                    .map((ros) => (
                                                        <SelectItem key={ros.id} value={ros.id}>
                                                            {ros.symptom_name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>

                                        {/* Selected Items Badges */}
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {data.review_of_systems.map((id) => {
                                                const selectedItem = reviewOfSystems.find((ros) => ros.id === id);
                                                return (
                                                    <Badge key={id} className="bg-green-700 text-white">
                                                        {selectedItem?.symptom_name}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? "Saving..." : "Save"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Display Medical Records */}
                    <div className="bg-white shadow-lg rounded-lg p-4 border border-green-300">
                        <ScrollArea className="h-[500px] overflow-y-auto">
                            {medicalRecords.length > 0 ? (
                                medicalRecords.map((record) => (
                                    <Card key={record.id} className="border rounded-lg">
                                        <CardHeader className="p-4 border-b border-green-300">
                                            <CardTitle>
                                                {record.patient?.lname}, {record.patient?.fname}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <p>
                                                <strong>Review of Systems:</strong>{" "}
                                                {record.reviewOfSystems
                                                    ?.map((ros) => ros.reviewOfSystem?.symptom_name)
                                                    .join(", ") || "N/A"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-center text-green-600">No medical records found.</p>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Index;
