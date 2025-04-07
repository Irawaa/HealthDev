import React, { useState, useEffect } from "react";

const ToothChart = ({ selectedDesign, onToothClick, dentalRecordChart }) => {
    const [toothDesigns, setToothDesigns] = useState(dentalRecordChart || {});

    const primaryTeeth = [
        { numbers: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65] },
        { numbers: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75] },
    ];

    const permanentTeeth = [
        { numbers: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28] },
        { numbers: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38] },
    ];

    const molarTeeth = [14, 47, 13, 26, 65, 37];

    const handleToothClick = (number, type) => {
        // Call the parent onToothClick function when a tooth is clicked
        if (onToothClick) {
            onToothClick(number, type);
        }

        // Existing logic for updating tooth designs
        console.log(`Tooth clicked: ${number}, Type: ${type}, Selected Design: ${selectedDesign}`); // Log when a tooth is clicked

        setToothDesigns((prevState) => {
            const updatedDesigns = { ...prevState, [number]: { teeth: number, type, design: selectedDesign } };
            console.log("Updated tooth designs:", updatedDesigns); // Log the updated tooth designs state
            return updatedDesigns;
        });
    };

    useEffect(() => {
        setToothDesigns(dentalRecordChart);
      }, [dentalRecordChart]);


    const renderDesign = (design, isMolar) => {
        switch (design) {
            case "Filled":
                return (
                    <>
                        {isMolar ? (
                            <>
                                <path
                                    d="M 100 0 L 0 0 L 0 100 Z" // Diagonal left design
                                    fill="#86efac" // Green fill
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />
                                <path
                                    d="M 0 100 L 0 0 L 100 100 Z" // Diagonal bottom design (covers the left and right parts of the outer circle)
                                    fill="#86efac" // Green fill for the outer circle
                                    clipPath="url(#circleClip)" // Apply clipping to the outer circle only
                                />
                                <path
                                    d="M 100 0 L 50 50 L 100 100 Z" // Diagonal right design
                                    fill="#86efac" // Green fill
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />

                                {/* Inner circle white fill */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="25"
                                    stroke="black"
                                    fill="#86efac" // White for the inner circle
                                    clipPath="url(#innerCircleClip)" // Clip the fill inside the inner circle
                                />

                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="black"
                                    strokeWidth="2"
                                    fill="none" // No fill for outer circle initially
                                />

                                <line x1="15" y1="15" x2="35" y2="35" stroke="black" strokeWidth="2" />
                                <line x1="65" y1="65" x2="85" y2="85" stroke="black" strokeWidth="2" />
                                <line x1="85" y1="15" x2="65" y2="35" stroke="black" strokeWidth="2" />
                                <line x1="35" y1="65" x2="15" y2="85" stroke="black" strokeWidth="2" />

                                <circle
                                    cx="50"
                                    cy="50"
                                    r="25"
                                    stroke="black"
                                    strokeWidth="2"
                                    fill="#86efac" // Inner circle fill for molars
                                />
                            </>
                        ) : (
                            <>
                                <path
                                    d="M 100 0 L 0 0 L 0 100 Z" // Diagonal left design
                                    fill="#86efac" // Green fill
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />
                                <path
                                    d="M 0 100 L 0 0 L 100 100 Z" // Diagonal bottom design (covers the left and right parts of the outer circle)
                                    fill="#86efac" // Green fill for the outer circle
                                    clipPath="url(#circleClip)" // Apply clipping to the outer circle only
                                />
                                <path
                                    d="M 100 0 L 50 50 L 100 100 Z" // Diagonal right design
                                    fill="#86efac" // Green fill
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />
                                <path d="M 20 20 L 80 80" stroke="black" strokeWidth="2" />
                                <path d="M 80 20 L 20 80" stroke="black" strokeWidth="2" />
                            </>
                        )}
                    </>
                );
            case "UpperLeftDot":
                return <circle cx="25" cy="25" r="5" fill="red" />;
            case "BottomLeftDot":
                return <circle cx="25" cy="75" r="5" fill="red" />;
            case "LeftDot":
                return <circle cx="25" cy="50" r="5" fill="red" />;
            case "RightDot":
                return <circle cx="75" cy="50" r="5" fill="red" />;
            case "BottomRightDot":
                return <circle cx="75" cy="75" r="5" fill="red" />;
            case "TopRightDot":
                return <circle cx="75" cy="25" r="5" fill="red" />;
            case "BottomDot":
                return <circle cx="50" cy="75" r="5" fill="red" />;
            case "DiagonalLeft":
                return (
                    <>
                        {isMolar ? (
                            <>
                                <path
                                    d="M 0 0 L 50 50 L 0 100 Z" // Diagonal left design
                                    fill="#86efac" // Green fill
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />

                                {/* Inner circle white fill */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="25"
                                    fill="white" // White for the inner circle
                                    clipPath="url(#innerCircleClip)" // Clip the fill inside the inner circle
                                />
                            </>
                        ) : (
                            <>
                                <path
                                    d="M 0 0 L 50 50 L 0 100 Z" // Diagonal left design
                                    fill="#86efac"
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />

                                <path d="M 20 20 L 80 80" stroke="black" strokeWidth="2" />
                                <path d="M 80 20 L 20 80" stroke="black" strokeWidth="2" />
                            </>
                        )}
                    </>
                );
            case "DiagonalRight":
                return (
                    <>
                        {isMolar ? (
                            <>
                                <path
                                    d="M 100 0 L 50 50 L 100 100 Z" // Diagonal right design
                                    fill="#86efac" // Green fill
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />

                                {/* Inner circle white fill */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="25"
                                    fill="white" // White for the inner circle
                                    clipPath="url(#innerCircleClip)" // Clip the fill inside the inner circle
                                />
                            </>
                        ) : (
                            <>
                                <path
                                    d="M 100 0 L 50 50 L 100 100 Z" // Diagonal right design
                                    fill="#86efac"
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />
                                <path d="M 20 20 L 80 80" stroke="black" strokeWidth="2" />
                                <path d="M 80 20 L 20 80" stroke="black" strokeWidth="2" />
                            </>
                        )}
                    </>
                );
            case "DiagonalTop":
                return (
                    <>
                        {isMolar ? (
                            <>
                                <path
                                    d="M 0 0 L 50 50 L 100 0 Z" // Diagonal top design
                                    fill="#86efac" // Green fill
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />

                                {/* Inner circle white fill */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="25"
                                    fill="white" // White for the inner circle
                                    clipPath="url(#innerCircleClip)" // Clip the fill inside the inner circle
                                />
                            </>
                        ) : (
                            <>
                                <path
                                    d="M 0 0 L 50 50 L 100 0 Z" // Diagonal top design
                                    fill="#86efac"
                                    clipPath="url(#circleClip)" // Clip the fill inside the outer circle
                                />

                                <path d="M 20 20 L 80 80" stroke="black" strokeWidth="2" />
                                <path d="M 80 20 L 20 80" stroke="black" strokeWidth="2" />
                            </>
                        )}
                    </>
                );
            case "DiagonalBottom":
                return (
                    <>
                        {/* Render differently based on molar */}
                        {isMolar ? (
                            <>
                                <path
                                    d="M 0 100 L 50 50 L 100 100 Z" // Diagonal bottom design (covers the left and right parts of the outer circle)
                                    fill="#86efac" // Green fill for the outer circle
                                    clipPath="url(#circleClip)" // Apply clipping to the outer circle only
                                />

                                {/* Inner circle white fill */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="25"
                                    fill="white" // White for the inner circle
                                    clipPath="url(#innerCircleClip)" // Apply clipping to the inner circle
                                />
                            </>
                        ) : (
                            <>
                                <path
                                    d="M 0 100 L 50 50 L 100 100 Z" // Diagonal bottom design (covers left and right parts of the outer circle)
                                    fill="#86efac" // Green fill for the outer circle
                                    clipPath="url(#circleClip)" // Apply clipping to the outer circle only
                                />

                                <path d="M 20 20 L 80 80" stroke="black" strokeWidth="2" />
                                <path d="M 80 20 L 20 80" stroke="black" strokeWidth="2" />
                            </>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    const renderToothSVG = (number, type) => {
        const isMolar = molarTeeth.includes(number); // Check if the tooth is a molar
        const toothDesign = toothDesigns[number]; // Get the design for the specific tooth
        const design = toothDesign ? toothDesign.design : "None"; // Default design if none selected

        return (
            <svg
                viewBox="0 0 100 100"
                className="w-12 h-12 cursor-pointer"
                onClick={() => onToothClick(number, type)}
            >
                <defs>
                    {/* Clip path to ensure design stays inside the outer circle */}
                    <clipPath id="circleClip">
                        <circle cx="50" cy="50" r="45" /> {/* Outer circle */}
                    </clipPath>
                    <clipPath id="innerCircleClip">
                        <circle cx="50" cy="50" r="25" /> {/* Inner circle */}
                    </clipPath>
                </defs>

                {/* Outer circle with no initial fill */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="black"
                    strokeWidth="2"
                    fill="none" // No fill for outer circle initially
                />

                {isMolar ? (
                    <>
                        <line x1="15" y1="15" x2="35" y2="35" stroke="black" strokeWidth="2" />
                        <line x1="65" y1="65" x2="85" y2="85" stroke="black" strokeWidth="2" />
                        <line x1="85" y1="15" x2="65" y2="35" stroke="black" strokeWidth="2" />
                        <line x1="35" y1="65" x2="15" y2="85" stroke="black" strokeWidth="2" />

                        {/* Inner circle for molars */}
                        <circle
                            cx="50"
                            cy="50"
                            r="25"
                            stroke="black"
                            strokeWidth="2"
                            fill="white" // Inner circle fill for molars
                        />
                    </>
                ) : (
                    <>
                        <path d="M 20 20 L 80 80" stroke="black" strokeWidth="2" />
                        <path d="M 80 20 L 20 80" stroke="black" strokeWidth="2" />
                    </>
                )}

                {/* Render the selected design */}
                {design !== "None" && renderDesign(design, isMolar)} {/* Render the selected design */}
            </svg>
        );
    };

    const renderTeeth = (teeth, type) => {
        return teeth.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-4">
                {row.numbers.map((number, index) => (
                    <div key={index} className="flex flex-col items-center space-y-1">
                        <div className="relative">
                            {renderToothSVG(number, type)}
                        </div>
                        <span className="text-xs font-semibold">{number}</span>
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div>
            {/* Primary Teeth */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-center mb-2">Primary Teeth</h3>
                {renderTeeth(primaryTeeth, "Primary")}
            </div>

            {/* Permanent Teeth */}
            <div>
                <h3 className="text-lg font-semibold text-center mb-2">Permanent Teeth</h3>
                {renderTeeth(permanentTeeth, "Permanent")}
            </div>
        </div>
    );
};

export default ToothChart;