import React, { useRef, useState } from "react";

const PdfModal = ({ isOpen, onClose, pdfUrl }) => {
    const pdfEmbedRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [isLoading, setIsLoading] = useState(true); // State to track loading

    if (!isOpen) return null;

    const handleZoomIn = () => {
        setZoom((prevZoom) => prevZoom + 0.1);
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => (prevZoom > 0.2 ? prevZoom - 0.1 : prevZoom)); // Prevent zoom out too far
    };

    // Handler when the PDF is loaded
    const handlePdfLoad = () => {
        setIsLoading(false);
    };

    // Handler for when there's an error loading the PDF
    const handlePdfError = () => {
        setIsLoading(false); // You can choose to handle errors differently if needed
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-xl shadow-lg max-w-5xl w-full relative overflow-hidden">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">PDF Viewer</h3>
                    <button
                        className="bg-red-600 text-white p-3 rounded-full shadow-md hover:bg-red-700 transition-all"
                        onClick={onClose}
                    >
                        <span className="text-lg font-semibold">X</span>
                    </button>
                </div>

                {/* PDF Toolbar */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        {/* Zoom buttons could be placed here */}
                    </div>
                </div>

                {/* PDF Embed with modern loading animation */}
                <div className="relative w-full h-[600px] flex justify-center items-center overflow-hidden">
                    {isLoading && (
                        <div className="absolute flex items-center justify-center w-full h-full bg-white bg-opacity-50 z-10">
                            {/* Three dot loading animation */}
                            <div className="flex gap-2">
                                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-225"></div>
                            </div>
                            <p className="mt-4 text-lg font-semibold animate-pulse text-gradient">
                                Loading...
                            </p>
                        </div>
                    )}
                    <embed
                        ref={pdfEmbedRef}
                        src={pdfUrl}
                        type="application/pdf"
                        className="w-full h-full border border-gray-300 rounded-md shadow-md"
                        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                        onLoad={handlePdfLoad} // Set loading to false when PDF is loaded
                        onError={handlePdfError} // Handle errors, can customize further
                    />
                </div>
            </div>
        </div>
    );
};

export default PdfModal;
