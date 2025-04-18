import React, { useState, useEffect } from "react";

const DentalViewChart = ({ record }) => {
    console.log(record);
    const [toothDesigns, setToothDesigns] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [selectedDesign, setSelectedDesign] = useState("None");
    const [selectedSymbol, setSelectedSymbol] = useState("");
    const [remarks, setRemarks] = useState("");

    const primaryTeeth = [
        { numbers: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65] },
        { numbers: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75] },
    ];

    const permanentTeeth = [
        { numbers: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28] },
        { numbers: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38] },
    ];

    const molarTeeth = [14, 47, 13, 26, 65, 37];

    // Pre-populate tooth designs from `record.dental_record_chart`
    useEffect(() => {
        const designs = {};

        if (record && record.dental_record_chart) {
            Object.keys(record.dental_record_chart).forEach((key) => {
                const tooth = record.dental_record_chart[key];
                designs[tooth.number] = {
                    teeth: tooth.number,
                    type: tooth.type,
                    design: tooth.design,
                    symbol: tooth.symbol,
                    remarks: tooth.remarks
                };
            });
        }

        setToothDesigns(designs);
    }, [record]);

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

    const handleToothClick = (tooth) => {
        const selectedToothDetails = toothDesigns[tooth.number] || {};
        setSelectedTooth(tooth);
        setSelectedDesign(selectedToothDetails.design || "None");
        setSelectedSymbol(selectedToothDetails.symbol || "");
        setRemarks(selectedToothDetails.remarks || "");
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedTooth(null);
    };

    const renderToothSVG = (number, type) => {
        const isMolar = molarTeeth.includes(number);
        const toothDesign = toothDesigns[number];
        const design = toothDesign ? toothDesign.design : "None";

        return (
            <svg
                viewBox="0 0 100 100"
                className="w-12 h-12 cursor-pointer"
                onClick={() => handleToothClick({ number, design })}
            >
                <defs>
                    <clipPath id="circleClip">
                        <circle cx="50" cy="50" r="45" />
                    </clipPath>
                    <clipPath id="innerCircleClip">
                        <circle cx="50" cy="50" r="25" />
                    </clipPath>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                />
                {isMolar ? (
                    <>
                        <line x1="15" y1="15" x2="35" y2="35" stroke="black" strokeWidth="2" />
                        <line x1="65" y1="65" x2="85" y2="85" stroke="black" strokeWidth="2" />
                        <line x1="85" y1="15" x2="65" y2="35" stroke="black" strokeWidth="2" />
                        <line x1="35" y1="65" x2="15" y2="85" stroke="black" strokeWidth="2" />
                        <circle cx="50" cy="50" r="25" stroke="black" strokeWidth="2" fill="white" />
                    </>
                ) : (
                    <>
                        <path d="M 20 20 L 80 80" stroke="black" strokeWidth="2" />
                        <path d="M 80 20 L 20 80" stroke="black" strokeWidth="2" />
                    </>
                )}

                {design !== "None" && renderDesign(design, isMolar)}
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
            <div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-center mb-2">Primary Teeth</h3>
                    {renderTeeth(primaryTeeth, "Primary")}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-center mb-2">Permanent Teeth</h3>
                    {renderTeeth(permanentTeeth, "Permanent")}
                </div>
            </div>


            {isModalVisible && (
                <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-20 p-4 rounded-tl-xl border-t border-gray-300 overflow-y-auto">
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold"
                    >
                        Close
                    </button>
                    <h3 className="text-lg font-semibold text-green-700 mb-4">
                        Dental Information for Tooth {selectedTooth.number}
                    </h3>

                    {/* Design Selection Input (disabled) */}
                    <div className="mb-4">
                        <label className="text-sm font-semibold">Tooth Design:</label>
                        <select
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            value={selectedDesign}
                            disabled // Make this field non-editable
                        >
                            <option value="None">None</option>
                            <option value="Filled">Filled</option>
                            <option value="DiagonalLeft">Diagonal Left</option>
                            <option value="DiagonalRight">Diagonal Right</option>
                            <option value="DiagonalTop">Diagonal Top</option>
                            <option value="DiagonalBottom">Diagonal Bottom</option>
                            <option value="UpperLeftDot">Upper Left Dot</option>
                            <option value="BottomLeftDot">Bottom Left Dot</option>
                            <option value="LeftDot">Left Dot</option>
                            <option value="RightDot">Right Dot</option>
                            <option value="BottomRightDot">Bottom Right Dot</option>
                            <option value="TopRightDot">Top Right Dot</option>
                            <option value="BottomDot">Bottom Dot</option>
                        </select>
                    </div>

                    {/* Combined Symbols Dropdown (disabled) */}
                    <div className="mb-4">
                        <label className="text-sm font-semibold">Tooth Symbol:</label>
                        <select
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            value={selectedSymbol}
                            disabled // Make this field non-editable
                        >
                            <option value="">Select a Symbol</option>
                            <optgroup label="Symbols for Mouth Examination">
                                <option value="X">X - Carious tooth indicated for extraction</option>
                                <option value="C">C - Carious tooth indicated for filling</option>
                                <option value="RF">RF - Root fragment</option>
                                <option value="M">M - Missing</option>
                                <option value="F2">F2 - Permanently filled tooth with recurrence of decay</option>
                                <option value="Heavy shade">Heavy shade - Permanent filling</option>
                                <option value="Outline of filling">Outline of filling - Tooth with temporary filling</option>
                            </optgroup>

                            <optgroup label="Artificial Restoration">
                                <option value="JC">JC - Jacket Crown</option>
                                <option value="AB">AB - Abutment</option>
                                <option value="P">P - Pontic</option>
                                <option value="I">I - Inlay</option>
                                <option value="RPD">RPD - Removable Partial Denture</option>
                                <option value="FB">FB - Fixed Bridge</option>
                                <option value="CD">CD - Complete Denture</option>
                            </optgroup>

                            <optgroup label="Symbols for Accomplishment">
                                <option value="OP">OP - Oral Prophylaxis</option>
                                <option value="Xt">Xt - Extracted Permanent Tooth</option>
                                <option value="Ag F">Ag F - Amalgam Filling</option>
                                <option value="Sy F">Sy F - Synthetic Porcelain</option>
                                <option value="GIC">GIC - Glass Ionomer Cement</option>
                                <option value="ZnO F">ZnO F - Zinc Oxide Filling</option>
                                <option value="R">R - Referred to Private Dentist</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Remarks Input (disabled) */}
                    <div className="mb-4">
                        <label className="text-sm font-semibold">Remarks:</label>
                        <textarea
                            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Enter remarks..."
                            value={remarks}
                            disabled // Make this field non-editable
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DentalViewChart;
