import { useState, useEffect } from "react";
import MedicalModal from "./MedicalModal";
import { Button } from "@/components/ui/button";

// Mock Data (Replace with API Call)
const mockRecords = [
  { id: 1, createdBy: "Dr. John Doe", date: "2024-02-26", status: "saved", data: {} },
];

const Medical = ({patient}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Load Initial Data
  useEffect(() => {
    setRecords(mockRecords);
    if (mockRecords.length > 0) {
      setSelectedRecord(mockRecords[0]); // Load latest record by default
    }
  }, []);

  // Open Modal to Create New Record
  const handleCreateNew = () => {
    setSelectedRecord(null);
    setIsOpen(true);
  };

  // Open Modal to Edit Selected Record
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsOpen(true);
  };

  // Save (New or Edited Record)
  const handleSave = (newRecord) => {
    if (!selectedRecord) {
      // New Record - Add to list
      const updatedRecords = [{ id: Date.now(), ...newRecord }, ...records];
      setRecords(updatedRecords);
    } else {
      // Editing Existing Record
      const updatedRecords = records.map((r) => (r.id === selectedRecord.id ? newRecord : r));
      setRecords(updatedRecords);
    }
    setIsOpen(false);
  };

  // Delete Record
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const updatedRecords = records.filter((r) => r.id !== id);
      setRecords(updatedRecords);
    }
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-green-700">Medical Records</h2>

      {/* Create New Button */}
      <Button onClick={handleCreateNew} className="mb-4 bg-blue-500 text-white">
        Create New Medical Record
      </Button>

      {/* Existing Records List */}
      {records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
              <div>
                <p className="text-gray-700">
                  <strong>Created by:</strong> {record.createdBy}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {record.date}
                </p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handleEdit(record)} className="bg-green-600 text-white">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(record.id)} className="bg-red-600 text-white">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 mt-4">No medical records available.</p>
      )}

      {/* Medical Modal for Save/Edit */}
      {isOpen && (
        <MedicalModal 
          onClose={() => setIsOpen(false)}
          record={selectedRecord} 
          onSave={handleSave} 
          onDelete={handleDelete} 
          patient={patient}
        />
      )}
    </div>
  );
};

export default Medical;

      // // Load saved state if available
      // if (savedToothMarkers.current[selectedTooth]) {
      //   canvas.loadFromJSON(savedToothMarkers.current[selectedTooth], () => {
      //     canvas.getObjects().forEach((obj) => {
      //       // Make ALL objects non-interactive, including background objects
      //       obj.set({
      //         selectable: false,
      //         hasControls: false,
      //         hasBorders: false,
      //         lockMovementX: true,
      //         lockMovementY: true,
      //         evented: false,
      //       });

      //       // Ensure background objects retain their isBackground property
      //       if ((obj.type === 'circle' || obj.type === 'line')) {
      //         obj.isBackground = true;
      //       } else {
      //         obj.isBackground = false;
      //       }
      //     });

      //     // Disable any canvas-level interactions to make it fully non-editable
      //     canvas.selection = false;
      //     canvas.skipTargetFind = true;
      //     canvas.defaultCursor = 'default';

      //     canvas.renderAll();
      //   });
      // }

      // data.dentalRecordChart?.drawing_data?.[selectedTooth] 


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
          if (data.dentalRecordChart?.drawing_data?.[selectedTooth]) {
            const savedState = data.dentalRecordChart.drawing_data[selectedTooth];
    
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
    
          // Circle drawing function
          const addCircle = (event) => {
            const pointer = canvas.getPointer(event.e);
            const circle = new fabric.Circle({
              left: pointer.x - 15,
              top: pointer.y - 15,
              radius: 15,
              fill: "rgba(173, 216, 230, 0.3)", // Light blue with 30% opacity
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
              setData((prev) => ({
                ...prev,
                dentalRecordChart: {
                  ...prev.dentalRecordChart,
                  drawing_data: {
                    ...prev.dentalRecordChart.drawing_data,
                    [selectedTooth]: currentState, // Save per tooth
                  },
                },
              }));
    
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