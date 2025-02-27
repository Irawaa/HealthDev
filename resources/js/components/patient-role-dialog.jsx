'use client'

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Briefcase, Users } from "lucide-react"

export default function PatientRoleDialog({ open, onClose, onSelect }) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isOpen = open ?? internalOpen

  const handleSelect = (role) => {
    console.log(`${role} Selected`)
    onSelect?.(role)
    setInternalOpen(false)
    onClose?.() // Close parent modal
  }

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => {
      setInternalOpen(isOpen)
      if (!isOpen) onClose?.()
    }}>
      <DialogContent className="max-w-lg sm:max-w-2xl">
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
            onClick={() => handleSelect("personnel")}
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
  )
}
