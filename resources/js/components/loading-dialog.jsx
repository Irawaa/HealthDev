import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react"; // ✅ Import icons

export function LoadingDialog({ isOpen, status }) {
  const [animationIndex, setAnimationIndex] = useState(0);
  const [showFinalState, setShowFinalState] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimationIndex(0);
      setShowFinalState(false);

      const interval = setInterval(() => {
        setAnimationIndex((prevIndex) => (prevIndex + 1) % 3);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (status !== "loading") {
      setTimeout(() => {
        setShowFinalState(true);
      }, 1000); // ✅ Delay showing success/error icon
    }
  }, [status]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Dialog */}
      <Card className="relative z-50 w-32 h-32 rounded-lg shadow-md flex items-center justify-center bg-white">
        <CardContent className="flex items-center justify-center h-full p-0">
          {showFinalState ? (
            status === "success" ? (
              <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 animate-pulse" />
            )
          ) : (
            animations[animationIndex]
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ✅ Loading animations list
const animations = [
  <div className="w-20 h-20 border-4 border-transparent text-green-500 animate-spin border-t-green-500 rounded-full flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-transparent text-green-400 animate-spin border-t-green-400 rounded-full"></div>
  </div>,
  <div className="flex space-x-2">
    <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
    <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-150"></div>
    <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce delay-300"></div>
  </div>,
  <div className="grid grid-cols-2 gap-1">
    <div className="w-4 h-4 rounded-sm animate-pulse bg-green-400" />
    <div className="w-4 h-4 rounded-sm animate-pulse delay-150 bg-blue-500" />
    <div className="w-4 h-4 rounded-sm animate-pulse delay-300 bg-yellow-500" />
    <div className="w-4 h-4 rounded-sm animate-pulse delay-450 bg-red-500" />
  </div>,
];
