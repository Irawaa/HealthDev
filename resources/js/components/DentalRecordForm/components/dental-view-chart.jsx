import React, { useEffect, useState, useRef } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { X } from "lucide-react";
import LZString from "lz-string";
import { motion, AnimatePresence } from "framer-motion";

const DentalViewChart = ({ record }) => {
    const [selectedTooth, setSelectedTooth] = useState(null);
    const { editor, onReady } = useFabricJSEditor();
    const canvasRef = useRef(null);

    const primaryTeeth = [
        { numbers: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65], y: 50 },
        { numbers: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75], y: 100 },
    ];

    const permanentTeeth = [
        { numbers: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28], y: 250 },
        { numbers: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38], y: 300 },
    ];

    const handleToothClick = (tooth) => {
        setSelectedTooth(tooth);
    };

    useEffect(() => {
        if (selectedTooth && editor?.canvas) {
            const canvas = editor.canvas;

            if (!canvas.getContext || !canvas.getContext("2d")) {
                // console.warn("Canvas not ready yet! Waiting for initialization...");
                setTimeout(() => setSelectedTooth(selectedTooth), 100); // Retry initialization
                return;
            }

            canvas.clear(); // Clear previous content

            // Get canvas dimensions
            const { width, height } = canvas;

            const molarTeeth = [14, 47, 13, 26, 65, 37];

            // Outer and Inner circle radii
            const outerRadius = 100;
            const innerRadius = 50;

            // Outer Circle
            const outerCircle = new fabric.Circle({
                left: width / 2 - outerRadius,
                top: height / 2 - outerRadius,
                radius: outerRadius,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2,
                selectable: false,
                isBackground: true,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true,
                evented: false,
                markerType: "background",
            });

            if (molarTeeth.includes(selectedTooth)) {
                const innerCircle = new fabric.Circle({
                    left: width / 2 - innerRadius,
                    top: height / 2 - innerRadius,
                    radius: innerRadius,
                    fill: "transparent",
                    stroke: "black",
                    strokeWidth: 2,
                    selectable: false,
                    isBackground: true,
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    evented: false,
                    markerType: "background",
                });
                canvas.add(innerCircle);
                canvas.sendToBack(innerCircle);
            } else {
                // Adjusted diagonal limits to ensure "X" stays inside the outer circle
                const xOffset = outerRadius / Math.sqrt(2);

                // X Line 1 (Top-left to Bottom-right, within bounds)
                const xLine1 = new fabric.Line(
                    [width / 2 - xOffset, height / 2 - xOffset, width / 2 + xOffset, height / 2 + xOffset],
                    {
                        stroke: "black",
                        strokeWidth: 2,
                        selectable: false,
                        hasControls: false,
                        hasBorders: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        evented: false,
                    }
                );

                // X Line 2 (Top-right to Bottom-left, within bounds)
                const xLine2 = new fabric.Line(
                    [width / 2 + xOffset, height / 2 - xOffset, width / 2 - xOffset, height / 2 + xOffset],
                    {
                        stroke: "black",
                        strokeWidth: 2,
                        selectable: false,
                        hasControls: false,
                        hasBorders: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        evented: false,
                    }
                );

                canvas.add(xLine1, xLine2);
                canvas.sendToBack(xLine1);
                canvas.sendToBack(xLine2);
            }

            // Calculate adjusted diagonal line end points
            const offset = Math.sqrt(Math.pow(innerRadius, 2) / 2);
            const maxOffset = Math.sqrt(Math.pow(outerRadius, 2) / 2);

            // Diagonal Line 1 (Top-left to Bottom-right, within bounds)
            const line1 = new fabric.Line(
                [width / 2 - maxOffset, height / 2 - maxOffset, width / 2 - offset, height / 2 - offset],
                {
                    stroke: "black",
                    strokeWidth: 2,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    evented: false,
                }
            );

            const line1Part2 = new fabric.Line(
                [width / 2 + offset, height / 2 + offset, width / 2 + maxOffset, height / 2 + maxOffset],
                {
                    stroke: "black",
                    strokeWidth: 2,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    evented: false,
                }
            );

            // Diagonal Line 2 (Top-right to Bottom-left, within bounds)
            const line2 = new fabric.Line(
                [width / 2 + maxOffset, height / 2 - maxOffset, width / 2 + offset, height / 2 - offset],
                {
                    stroke: "black",
                    strokeWidth: 2,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    evented: false,
                }
            );

            const line2Part2 = new fabric.Line(
                [width / 2 - offset, height / 2 + offset, width / 2 - maxOffset, height / 2 + maxOffset],
                {
                    stroke: "black",
                    strokeWidth: 2,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    evented: false,
                }
            );

            // Add all shapes to the canvas
            canvas.add(outerCircle, line1, line1Part2, line2, line2Part2);
            canvas.sendToBack(outerCircle);
            canvas.sendToBack(line1);
            canvas.sendToBack(line1Part2);
            canvas.sendToBack(line2);
            canvas.sendToBack(line2Part2);

            // Load saved state if available
            const savedState = record.dental_record_chart[selectedTooth]?.drawing_data;

            if (savedState) {
                const decompressedState = LZString.decompressFromUTF16(savedState);
                canvas.loadFromJSON(decompressedState, () => {
                    canvas.getObjects().forEach((obj) => {
                        // Make ALL objects non-interactive
                        obj.set({
                            selectable: false,
                            hasControls: false,
                            hasBorders: false,
                            lockMovementX: true,
                            lockMovementY: true,
                            evented: false,
                        });

                        // Ensure background objects are marked
                        obj.isBackground = obj.type === "circle" || obj.type === "line";
                    });

                    // Disable canvas interactions globally
                    canvas.isDrawingMode = false;
                    canvas.selection = false;
                    canvas.skipTargetFind = true;
                    canvas.defaultCursor = "default";

                    // Render the final non-editable state
                    canvas.renderAll();
                });
            }

            // Clipping Mask: Only allow drawing inside this outer boundary
            const clipPath = new fabric.Circle({
                left: width / 2 - outerRadius,
                top: height / 2 - outerRadius,
                radius: outerRadius,
                fill: "black",
                selectable: false,
                evented: false,
            });

            canvas.clipPath = clipPath;

            // Ensure the events are cleared before attaching new ones
            canvas.off("mouse:down");
            canvas.off("object:added");
            canvas.isDrawingMode = false;
            canvas.selection = false;
            canvas.skipTargetFind = true;
        }
    }, [selectedTooth, editor]);

    return (
        <>
            <div className="bg-white p-6 w-full max-w-4xl rounded-lg relative z-50">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-green-700 mb-2 text-center">
                        II. Dental Record
                    </h2>
                    <p className="text-lg font-semibold text-center mb-6">
                        Dental Record Chart
                    </p>

                    {/* Primary Teeth - Top */}
                    <div className="flex flex-col items-center justify-center mb-4 w-full">
                        <div className="w-full max-w-lg mx-auto flex flex-wrap justify-center gap-2">
                            {primaryTeeth.map(({ numbers }) => (
                                <div key={numbers.join(",")} className="flex justify-center items-center space-x-2 md:space-x-4 w-auto mb-2">
                                    {numbers.map((num) => {
                                        const toothData = record.dental_record_chart?.[num] || {};
                                        const hasDrawing = toothData.drawing_data;
                                        const hasNotesOrSymbol = toothData.notes || toothData.symbol;
                                        const hasAll = hasDrawing && toothData.notes && toothData.symbol;

                                        // Determine background color based on conditions
                                        let bgColor = "bg-white"; // Default
                                        if (hasAll) bgColor = "bg-blue-200"; // All three present
                                        else if (hasDrawing) bgColor = "bg-green-200"; // Only drawing data
                                        else if (hasNotesOrSymbol) bgColor = "bg-yellow-200"; // Notes or symbol present

                                        return (
                                            <div
                                                key={num}
                                                className={`w-10 h-10 border border-gray-400 flex items-center justify-center cursor-pointer ${bgColor}`}
                                                onClick={() => handleToothClick(num)}
                                            >
                                                {num}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Permanent Teeth - Bottom */}
                    <div className="flex flex-col items-center justify-center mt-6 w-full">
                        <div className="w-full max-w-lg mx-auto flex flex-wrap justify-center gap-2">
                            {permanentTeeth.map(({ numbers }) => (
                                <div key={numbers.join(",")} className="flex justify-center items-center space-x-2 md:space-x-4 w-auto mb-2">
                                    {numbers.map((num) => {
                                        const toothData = record.dental_record_chart?.[num] || {};
                                        const hasDrawing = toothData.drawing_data;
                                        const hasNotesOrSymbol = toothData.notes || toothData.symbol;
                                        const hasAll = hasDrawing && toothData.notes && toothData.symbol;

                                        // Determine background color based on conditions
                                        let bgColor = "bg-white"; // Default
                                        if (hasAll) bgColor = "bg-blue-200"; // All three present
                                        else if (hasDrawing) bgColor = "bg-green-200"; // Only drawing data
                                        else if (hasNotesOrSymbol) bgColor = "bg-yellow-200"; // Notes or symbol present

                                        return (
                                            <div
                                                key={num}
                                                className={`w-10 h-10 border border-gray-400 flex items-center justify-center cursor-pointer ${bgColor}`}
                                                onClick={() => handleToothClick(num)}
                                            >
                                                {num}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Drawing Modal above the tooth grid */}
            {selectedTooth && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-white p-4 rounded-lg relative z-1 flex space-x-4">

                        {/* Left Side - Tooth Details */}
                        <div className="w-56 p-3 border-r border-gray-300 bg-gray-100 shadow-lg text-left text-gray-800">
                            <strong className="block mb-2">Tooth Details:</strong>
                            <p><strong>Tooth Number:</strong> {selectedTooth}</p>

                            {/* Fetching the data for the selected tooth */}
                            <p><strong>Symbol:</strong> {record.dental_record_chart[selectedTooth]?.symbol || "None"}</p>
                            <p><strong>Notes:</strong> {record.dental_record_chart[selectedTooth]?.notes || "None"}</p>
                            <p><strong>Teeth Condition:</strong> {record.dental_record_chart[selectedTooth]?.teeth_conditions || "None"}</p>
                        </div>
                        {/* Main Drawing Area - Center */}
                        <div className="relative flex flex-col items-center">
                            <button
                                onClick={() => setSelectedTooth(null)}
                                className="absolute top-2 right-2 text-red-500"
                            >
                                <X size={24} />
                            </button>
                            <h3 className="text-lg font-semibold mb-2">Tooth #{selectedTooth}</h3>
                            <FabricJSCanvas
                                className="border border-gray-300"
                                onReady={(canvas) => {
                                    onReady(canvas);
                                    canvasRef.current = canvas;
                                    canvas.setWidth(360);
                                    canvas.setHeight(360);
                                }}
                                style={{ width: "360px", height: "360px" }}
                            />
                        </div>

                        {/* Right Side Inputs */}

                    </div>
                </div>
            )}
        </>
    );
};

export default DentalViewChart;
