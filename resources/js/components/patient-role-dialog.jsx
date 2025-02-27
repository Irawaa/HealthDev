'use client'

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Briefcase, Users } from "lucide-react"
import AddStudentDialog from "@/components/StudentPatients/add-student-dialog"
import AddEmployeeDialog from "./EmployeePatients/add-employee-dialog"

export default function PatientRoleDialog({ open, onClose, colleges, onSelect }) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [showDialog, setShowDialog] = useState(null) // Manage both student and employee dialogs
    const [isTransitioning, setIsTransitioning] = useState(false)

    const isOpen = open ?? internalOpen

    const handleSelect = async (role) => {
        console.log(`${role} Selected`)
        setIsTransitioning(true) // Start transition effect

        onSelect?.(role)

        // Directly set the dialog based on the role
        if (role === "student") {
            setShowDialog("student")
        }

        if (role === "employee") {
            setTimeout(() => {
                setShowDialog("employee")
                setIsTransitioning(false)
            }, 300); // Smooth delay transition for next dialog
        }
        

        // Close PatientRoleDialog after a short delay
        setTimeout(() => {
            onClose?.()
        }, 200) // Close dialog after 200ms for smooth transition
    }

    useEffect(() => {
        if (!open) {
            setIsTransitioning(false)
            setShowDialog(null) // Reset when dialog is closed
        }
    }, [open])

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(isOpen) => {
                    setInternalOpen(isOpen)
                    if (!isOpen) onClose?.()
                }}
            >
                {/* Backdrop Blur with Smooth Transition */}
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 ease-in-out" />

                <DialogContent
                    className={`max-w-lg sm:max-w-2xl transition-all duration-300 ease-in-out ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center font-bold">
                            Select User Type
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Please select the type of patient to proceed with the registration.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <Card
                            className="cursor-pointer hover:shadow-md transition-transform transform hover:scale-105"
                            onClick={() => handleSelect("student")}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
                                <GraduationCap className="text-blue-500 w-12 h-12" />
                                <span className="text-base font-semibold text-blue-600">Student</span>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:shadow-md transition-transform transform hover:scale-105"
                            onClick={() => handleSelect("employee")}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
                                <Briefcase className="text-green-500 w-12 h-12" />
                                <span className="text-base font-semibold text-green-600">Personnel</span>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:shadow-md transition-transform transform hover:scale-105"
                            onClick={() => handleSelect("non_personnel")}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
                                <Users className="text-orange-500 w-12 h-12" />
                                <span className="text-base font-semibold text-orange-600">Non-Personnel</span>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:shadow-md transition-transform transform hover:scale-105"
                            onClick={() => handleSelect("old_records")}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-3">
                                <Users className="text-purple-500 w-12 h-12" />
                                <span className="text-base font-semibold text-purple-600">Old Records</span>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Student Dialog */}
            {showDialog === "student" && (
                <AddStudentDialog
                    key="open"
                    open={showDialog === "student"}
                    onClose={() => {
                        setShowDialog(null)
                        setInternalOpen(false) // Reset parent dialog
                    }}
                    colleges={colleges}
                />
            )}

            {/* Add Employee Dialog */}
            {showDialog === "employee" && (
                <AddEmployeeDialog
                    key="open"
                    open={showDialog === "employee"}
                    onClose={() => {
                        setShowDialog(null)
                        setInternalOpen(false) // Reset parent dialog
                    }}
                    colleges={colleges}
                />
            )}
        </>
    )
}
