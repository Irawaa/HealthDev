import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ToothChart from "../components/teeth-chart";

const Step1 = ({ data, setData, errors }) => {
  const [selectedDesign, setSelectedDesign] = useState("None");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);

  useEffect(() => {
    // Reset modal state when selectedTooth changes
    if (selectedTooth) {
      const toothData = data.dental_record_chart[selectedTooth.number];
      if (toothData) {
        setSelectedDesign(toothData.design || "None");
        setSelectedSymbol(toothData.symbol || "");
        setRemarks(toothData.remarks || "");
      } else {
        // If no data exists, reset to defaults
        setSelectedDesign("None");
        setSelectedSymbol("");
        setRemarks("");
      }
    }
  }, [selectedTooth, data.dental_record_chart]);

  // Handler for showing the modal when a tooth is clicked
  const onToothClick = (number, type) => {
    console.log(`Tooth clicked: ${number}, Type: ${type}`);
    // If the same tooth is clicked again, keep the data
    if (selectedTooth && selectedTooth.number === number) {
      setIsModalVisible(true);
    } else {
      // Reset modal content when a different tooth is clicked
      setSelectedTooth({ number, type });
      setIsModalVisible(true);
    }

    // Initialize dental record chart for the new tooth if not already present
    if (!data.dental_record_chart[number]) {
      setData({
        ...data,
        dental_record_chart: {
          ...data.dental_record_chart,
          [number]: {
            number,
            type,
            design: "None",
            symbol: "",
            remarks: "",
          },
        },
      });
    }
  };

  // Handler for closing the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Handler for saving the design when selected
  const handleDesignChange = (e) => {
    const value = e.target.value;
    setSelectedDesign(value);

    // Update the data.dental_record_chart with the selected design
    setData({
      ...data,
      dental_record_chart: {
        ...data.dental_record_chart,
        [selectedTooth.number]: {
          ...data.dental_record_chart[selectedTooth.number],
          design: value,
        },
      },
    });

    // Log the updated dental record chart
    console.log("Updated dental record chart:", data.dental_record_chart);
  };

  const handleSymbolChange = (e) => {
    const value = e.target.value;
    setSelectedSymbol(value);

    // Update the data.dental_record_chart with the selected symbol
    setData({
      ...data,
      dental_record_chart: {
        ...data.dental_record_chart,
        [selectedTooth.number]: {
          ...data.dental_record_chart[selectedTooth.number],
          symbol: value,
        },
      },
    });

    console.log("Updated dental record chart:", data.dental_record_chart);
  };

  const handleRemarksChange = (e) => {
    const value = e.target.value;
    setRemarks(value);

    // Update the data.dental_record_chart with the remarks
    setData({
      ...data,
      dental_record_chart: {
        ...data.dental_record_chart,
        [selectedTooth.number]: {
          ...data.dental_record_chart[selectedTooth.number],
          remarks: value,
        },
      },
    });

    console.log("Updated dental record chart:", data.dental_record_chart);
  };

  return (
    <motion.div
      className="bg-white p-4 w-full max-w-3xl rounded-lg relative z-10 overflow-y-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ maxHeight: "80vh" }}
    >
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-xl font-semibold text-green-700 mb-2 text-center">
          II. Dental Record
        </h2>
        <p className="text-lg font-semibold text-center mb-4">
          Dental Record Chart
        </p>
      </div>

      {/* ToothChart component, now triggering the modal when a tooth is clicked */}
      <ToothChart selectedDesign={selectedDesign} onToothClick={onToothClick} dentalRecordChart={data.dental_record_chart} />

      {/* Modal that appears only when isModalVisible is true */}
      {isModalVisible && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-20 p-4 rounded-tl-xl border-t border-gray-300 overflow-y-auto">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold"
          >
            Close
          </button>
          <h3 className="text-lg font-semibold text-green-700 mb-4">Dental Information for Tooth {selectedTooth.number}</h3>

          {/* Design Selection Input */}
          <div className="mb-4">
            <label className="text-sm font-semibold">Select Tooth Design:</label>
            <select
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              value={selectedDesign}
              onChange={handleDesignChange}
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

          {/* Combined Symbols Dropdown */}
          <div className="mb-4">
            <label className="text-sm font-semibold">Select a Symbol:</label>
            <select
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              value={selectedSymbol}
              onChange={handleSymbolChange}
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

          {/* Remarks Input */}
          <div className="mb-4">
            <label className="text-sm font-semibold">Remarks:</label>
            <textarea
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              placeholder="Enter remarks for the selected symbol..."
              value={remarks}
              onChange={handleRemarksChange}
              rows={3}
            ></textarea>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Step1;
