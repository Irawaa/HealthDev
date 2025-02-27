'use client';

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Briefcase, Users } from "lucide-react";
import AddStudentDialog from "@/components/StudentPatients/add-student-dialog";
import AddEmployeeDialog from "./EmployeePatients/add-employee-dialog";

export default function PatientRoleDialog({ open, onClose, colleges, onSelect }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(null); // Manage both student and employee dialogs
    const [isTransitioning, setIsTransitioning] = useState(false);

    const isOpen = open ?? internalOpen;

    const handleSelect = async (role) => {
        console.log(`${role} Selected`);
        setIsTransitioning(true); // Start transition effect

        onSelect?.(role);

        // Directly set the dialog based on the role
        if (role === "student") {
            setShowDialog("student");
        }

        if (role === "employee") {
            setTimeout(() => {
                setShowDialog("employee");
                setIsTransitioning(false);
            }, 300); // Smooth delay transition for next dialog
        }

        // Close PatientRoleDialog after a short delay
        setTimeout(() => {
            onClose?.();
        }, 200); // Close dialog after 200ms for smooth transition
    };

    useEffect(() => {
        if (!open) {
            setIsTransitioning(false);
            setShowDialog(null); // Reset when dialog is closed
        }
    }, [open]);

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(isOpen) => {
                    setInternalOpen(isOpen);
                    if (!isOpen) onClose?.();
                }}
            >
                {/* ✅ Backdrop Blur with Smooth Green Tint */}
                <div className="fixed inset-0 bg-green-900/50 backdrop-blur-md transition-opacity duration-300 ease-in-out" />

                <DialogContent
                    className={`max-w-lg sm:max-w-2xl transition-all duration-300 ease-in-out bg-green-100 border border-green-600 shadow-lg rounded-lg ${
                        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center font-bold text-green-700">
                            Select User Type
                        </DialogTitle>
                        <DialogDescription className="text-center text-green-600">
                            Please select the type of patient to proceed with the registration.
                        </DialogDescription>
                    </DialogHeader>

                    {/* ✅ Responsive Grid for Role Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {/* 🎓 Student Card */}
                        <Card
                            className="cursor-pointer bg-green-50 hover:bg-green-200 shadow-md transition-transform transform hover:scale-105 border border-green-500"
                            onClick={() => handleSelect("student")}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
                                <GraduationCap className="text-green-700 w-12 h-12" />
                                <span className="text-base font-semibold text-green-700">Student</span>
                            </CardContent>
                        </Card>

                        {/* 👔 Personnel Card */}
                        <Card
                            className="cursor-pointer bg-green-50 hover:bg-green-200 shadow-md transition-transform transform hover:scale-105 border border-green-500"
                            onClick={() => handleSelect("employee")}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
                                <Briefcase className="text-green-700 w-12 h-12" />
                                <span className="text-base font-semibold text-green-700">Personnel</span>
                            </CardContent>
                        </Card>

                        {/* 🏢 Non-Personnel Card */}
                        <Card
                            className="cursor-pointer bg-green-50 hover:bg-green-200 shadow-md transition-transform transform hover:scale-105 border border-green-500"
                            onClick={() => handleSelect("non_personnel")}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
                                <Users className="text-green-700 w-12 h-12" />
                                <span className="text-base font-semibold text-green-700">Non-Personnel</span>
                            </CardContent>
                        </Card>

                        {/* 📂 Old Records Card */}
                        <Card
                            className="cursor-pointer bg-green-50 hover:bg-green-200 shadow-md transition-transform transform hover:scale-105 border border-green-500"
                            onClick={() => handleSelect("old_records")}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
                                <Users className="text-green-700 w-12 h-12" />
                                <span className="text-base font-semibold text-green-700">Old Records</span>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ✅ Add Student Dialog */}
            {showDialog === "student" && (
                <AddStudentDialog
                    key="open"
                    open={showDialog === "student"}
                    onClose={() => {
                        setShowDialog(null);
                        setInternalOpen(false); // Reset parent dialog
                    }}
                    colleges={colleges}
                />
            )}

            {/* ✅ Add Employee Dialog */}
            {showDialog === "employee" && (
                <AddEmployeeDialog
                    key="open"
                    open={showDialog === "employee"}
                    onClose={() => {
                        setShowDialog(null);
                        setInternalOpen(false); // Reset parent dialog
                    }}
                    colleges={colleges}
                />
            )}
        </>
    );
}
