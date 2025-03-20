import React, { useEffect, useState, useRef } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { RefreshCw, X } from "lucide-react";

const Step1 = ({ data, setData }) => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const { editor, onReady } = useFabricJSEditor();
  const [suggestionText, setSuggestionText] = useState("");
  const canvasRef = useRef(null);
  const savedToothMarkers = useRef({}); // Store markers for each tooth
  const [symbol, setSymbol] = useState("");
  const [teethCondition, setTeethCondition] = useState("");
  const [notes, setNotes] = useState("");

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
    setSuggestionText("");
    const existingData = data.dentalRecordChart[tooth] || {};
    setSymbol(existingData.symbol || "");
    setTeethCondition(existingData.teeth_conditions || "");
    setNotes(existingData.notes || "");
  };

  const reset = () => {
    if (editor && selectedTooth) {
      const canvas = editor.canvas;

      // Remove only marker circles, preserve background circles
      canvas.getObjects("circle").forEach((circle) => {
        if (!circle.isBackground) {  // Avoid removing background circles
          canvas.remove(circle);
        }
      });

      // Update saved state after resetting circles
      savedToothMarkers.current[selectedTooth] = JSON.stringify(canvas.toJSON());
      canvas.renderAll(); // Re-render to reflect changes
    }
  };

  useEffect(() => {
    if (selectedTooth && editor?.canvas) {
      const canvas = editor.canvas;

      if (!canvas || !canvas.getContext || !canvas.getContext("2d")) {
        console.warn("Canvas not ready yet!");
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

      // Inner Circle
      // If the selected tooth is a molar, draw the inner circle
      // If the selected tooth is a molar, draw the inner circle
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
      const savedState = data.dentalRecordChart[selectedTooth]?.drawing_data;

      if (savedState) {
        console.log("Loaded drawing data for selected tooth:", savedState);

        canvas.loadFromJSON(savedState, () => {
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
          canvas.selection = false;
          canvas.skipTargetFind = true;
          canvas.defaultCursor = "default";

          // Render the final non-editable state
          canvas.renderAll();
        });
      }

      canvas.isDrawingMode = false;

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


      const addCircle = (event) => {
        const pointer = canvas.getPointer(event.e);
        const dx = pointer.x - width / 2;
        const dy = pointer.y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > outerRadius - 10) return; // Prevent drawing outside the outer circle

        const circle = new fabric.Circle({
          left: pointer.x - 10,
          top: pointer.y - 10,
          radius: 10,
          fill: "rgba(173, 216, 230, 0.3)",
          stroke: "rgba(173, 216, 230, 0.3)",
          strokeWidth: 2,
          selectable: false,
        });

        canvas.add(circle);
        determineSuggestion(pointer.x, pointer.y, width, height);
        saveState();
      };

      // Dental-specific suggestion logic
      const determineSuggestion = (x, y, canvasWidth, canvasHeight) => {
        const regionSuggestions = [];
        const clusteringSuggestions = [];
        const threshold = 3; // Adjust as necessary for clustering sensitivity

        // Region-based dental suggestions
        if (y < canvasHeight / 3) {
          regionSuggestions.push("Top region - Assess for enamel hypoplasia or erosion.");
        } else if (y > (2 * canvasHeight) / 3) {
          regionSuggestions.push("Bottom region - Monitor for root resorption or abscess.");
        }

        if (x < canvasWidth / 3) {
          regionSuggestions.push("Left region - Inspect for proximal caries or gingival recession.");
        } else if (x > (2 * canvasWidth) / 3) {
          regionSuggestions.push("Right region - Evaluate for fractures or proximal wear facets.");
        }

        if (x >= canvasWidth / 3 && x <= (2 * canvasWidth) / 3 && y >= canvasHeight / 3 && y <= (2 * canvasHeight) / 3) {
          regionSuggestions.push("Center region - Check for occlusal caries or bruxism-related wear.");
        }

        // Clustering-based dental suggestions
        const circleObjects = editor.canvas.getObjects("circle");
        const clusteringAreas = {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
        };

        circleObjects.forEach((circle) => {
          const cx = circle.left + circle.radius;
          const cy = circle.top + circle.radius;

          if (cx < canvasWidth / 2 && cy < canvasHeight / 2) clusteringAreas.topLeft++;
          else if (cx >= canvasWidth / 2 && cy < canvasHeight / 2) clusteringAreas.topRight++;
          else if (cx < canvasWidth / 2 && cy >= canvasHeight / 2) clusteringAreas.bottomLeft++;
          else clusteringAreas.bottomRight++;
        });

        if (clusteringAreas.topLeft >= threshold) clusteringSuggestions.push("Excessive marks in the upper-left area. Check for gingival inflammation or cervical caries.");
        if (clusteringAreas.topRight >= threshold) clusteringSuggestions.push("Excessive marks in the upper-right area. Monitor for enamel demineralization.");
        if (clusteringAreas.bottomLeft >= threshold) clusteringSuggestions.push("Excessive marks in the lower-left area. Evaluate for root exposure or decay.");
        if (clusteringAreas.bottomRight >= threshold) clusteringSuggestions.push("Excessive marks in the lower-right area. Assess for root fractures or periodontal issues.");

        // Combine and set the suggestion text
        setSuggestionText([...regionSuggestions, ...clusteringSuggestions].join(" "));
      };

      // Save the current state
      const saveState = () => {
        if (selectedTooth && editor?.canvas) {
          const currentState = JSON.stringify(editor.canvas.toJSON());

          // Update saved markers
          savedToothMarkers.current[selectedTooth] = currentState;

          // Ensure `data.dentalRecordChart.drawing_data` exists
          setData("dentalRecordChart", {
            ...data.dentalRecordChart,
            [selectedTooth]: {
              ...data.dentalRecordChart[selectedTooth],
              drawing_data: currentState, // Save per tooth
            },
          });

          console.log(`Saved Drawing Data for Tooth #${selectedTooth}:`, currentState);
        }
      };

      // Ensure the events are cleared before attaching new ones
      canvas.off("mouse:down");
      canvas.off("object:added");

      // Attach events
      canvas.on("mouse:down", addCircle);
      canvas.on("object:added", saveState);

      return () => {
        canvas.off("mouse:down", addCircle);
        canvas.off("object:added", saveState);
      };
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
                  {numbers.map((num) => (
                    <div
                      key={num}
                      className="w-10 h-10 border border-gray-400 flex items-center justify-center cursor-pointer"
                      onClick={() => handleToothClick(num)}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Permanent Teeth - Bottom */}
          <div className="flex flex-col items-center justify-center mt-6 w-full">
            <div className="w-full max-w-lg mx-auto flex flex-wrap justify-center gap-2">
              {permanentTeeth.map(({ numbers }) => (
                <div key={numbers.join(",")} className="flex justify-center items-center space-x-2 md:space-x-4 w-auto mb-2">
                  {numbers.map((num) => (
                    <div
                      key={num}
                      className="w-10 h-10 border border-gray-400 flex items-center justify-center cursor-pointer"
                      onClick={() => handleToothClick(num)}
                    >
                      {num}
                    </div>
                  ))}
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
            {/* Suggestion Note on the Left */}
            <div className="w-48 p-3 border-r border-gray-300 bg-gray-100 shadow-lg text-left text-gray-800">
              <strong className="block mb-2">Suggestion:</strong>
              <p className="text-sm leading-tight">
                {suggestionText ? suggestionText : "None"}
              </p>
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
              {/* Symbol Selection Dropdown */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">Symbol</label>
                <select
                  className="w-full border border-gray-300 rounded p-2"
                  value={symbol}
                  onChange={(e) => {
                    setSymbol(e.target.value);
                    setData("dentalRecordChart", {
                      ...data.dentalRecordChart,
                      [selectedTooth]: {
                        ...data.dentalRecordChart[selectedTooth],
                        symbol: e.target.value,
                      },
                    });
                  }}
                >
                  <option value="">Select a Symbol</option>

                  {/* SYMBOLS FOR MOUTH EXAMINATION */}
                  <optgroup label="Symbols for Mouth Examination">
                    <option value="X">X - Carious tooth indicated for extraction</option>
                    <option value="C">C - Carious tooth indicated for filling</option>
                    <option value="RF">RF - Root fragment</option>
                    <option value="M">M - Missing</option>
                    <option value="F2">F2 - Permanently filled tooth with recurrence of decay</option>
                    <option value="Heavy shade">Heavy shade - Permanent filling</option>
                    <option value="Outline of filling">Outline of filling - Tooth with temporary filling</option>
                  </optgroup>

                  {/* ARTIFICIAL RESTORATION */}
                  <optgroup label="Artificial Restoration">
                    <option value="JC">JC - Jacket Crown</option>
                    <option value="AB">AB - Abutment</option>
                    <option value="P">P - Pontic</option>
                    <option value="I">I - Inlay</option>
                    <option value="RPD">RPD - Removable Partial Denture</option>
                    <option value="FB">FB - Fixed Bridge</option>
                    <option value="CD">CD - Complete Denture</option>
                  </optgroup>

                  {/* SYMBOLS FOR ACCOMPLISHMENT */}
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
                      [selectedTooth]: {
                        ...data.dentalRecordChart[selectedTooth],
                        teeth_conditions: e.target.value,
                      },
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
                      [selectedTooth]: {
                        ...data.dentalRecordChart[selectedTooth],
                        notes: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step1;
