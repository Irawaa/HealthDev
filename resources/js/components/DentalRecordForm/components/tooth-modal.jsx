import React from "react";
import { FabricJSCanvas } from "fabricjs-react";
import { RefreshCw, X } from "lucide-react";

const ToothModal = ({
  selectedTooth,
  setSelectedTooth,
  suggestionText,
  symbol,
  setSymbol,
  teethCondition,
  setTeethCondition,
  notes,
  setNotes,
  reset,
  setData,
  data,
}) => {
  if (!selectedTooth) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white p-4 rounded-lg relative z-1 flex space-x-4">
        {/* Suggestion Note on the Left */}
        <div className="w-48 p-3 border-r border-gray-300 bg-gray-100 shadow-lg text-left text-gray-800">
          <strong className="block mb-2">Suggestion:</strong>
          <p className="text-sm leading-tight">{suggestionText || "None"}</p>
        </div>

        {/* Main Drawing Area */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => setSelectedTooth(null)}
            className="absolute top-2 right-2 text-red-500"
          >
            <X size={24} />
          </button>
          <h3 className="text-lg font-semibold mb-2">Tooth #{selectedTooth}</h3>
          <FabricJSCanvas className="border border-gray-300" style={{ width: "360px", height: "360px" }} />

          {/* Reset Button */}
          <div className="mt-4 flex space-x-4 items-center justify-center">
            <button onClick={reset} className="px-3 py-1 bg-gray-200 rounded-full">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Right Side Inputs */}
        <div className="w-56 p-3 border-l border-gray-300 bg-gray-100 shadow-lg text-left text-gray-800">
          <strong className="block mb-2">Tooth Details</strong>

          {/* Symbol Field */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">Symbol</label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              value=""
              onChange={(e) => {
                const newSymbol = e.target.value;
                if (!newSymbol) return;
                setSymbol((prev) => {
                  const updatedSymbols = prev.includes(newSymbol) ? prev : [...prev, newSymbol];
                  setData("dentalRecordChart", {
                    ...data.dentalRecordChart,
                    [selectedTooth]: { ...data.dentalRecordChart[selectedTooth], symbol: updatedSymbols },
                  });
                  return updatedSymbols;
                });
              }}
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

          {/* Teeth Condition Field */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">Teeth Condition</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              value={teethCondition}
              onChange={(e) => {
                setTeethCondition(e.target.value);
                setData("dentalRecordChart", {
                  ...data.dentalRecordChart,
                  [selectedTooth]: { ...data.dentalRecordChart[selectedTooth], teeth_conditions: e.target.value },
                });
              }}
            />
          </div>

          {/* Notes Field */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setData("dentalRecordChart", {
                  ...data.dentalRecordChart,
                  [selectedTooth]: { ...data.dentalRecordChart[selectedTooth], notes: e.target.value },
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToothModal;
