import { useEffect, useState, useRef } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import * as fabric from "fabric";

const useDentalCanvas = (selectedTooth, editor, setData, data, setSuggestionText) => {
    const savedToothMarkers = useRef({});
  
    useEffect(() => {
      if (!selectedTooth || !editor?.canvas) return;
  
      const canvas = editor.canvas;
      canvas.clear();
  
      const { width, height } = canvas;
      const molarTeeth = [14, 47, 13, 26, 65, 37];
  
      const outerRadius = 100;
      const innerRadius = 50;
  
      const outerCircle = new fabric.Circle({
        left: width / 2 - outerRadius,
        top: height / 2 - outerRadius,
        radius: outerRadius,
        fill: "transparent",
        stroke: "black",
        strokeWidth: 2,
        selectable: false,
      });
  
      canvas.add(outerCircle);
      canvas.sendToBack(outerCircle);
  
      if (molarTeeth.includes(selectedTooth)) {
        const innerCircle = new fabric.Circle({
          left: width / 2 - innerRadius,
          top: height / 2 - innerRadius,
          radius: innerRadius,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
          selectable: false,
        });
  
        canvas.add(innerCircle);
        canvas.sendToBack(innerCircle);
      }
  
      if (data?.dentalRecordChart?.drawing_data?.[selectedTooth]) {
        canvas.loadFromJSON(data.dentalRecordChart.drawing_data[selectedTooth], () => {
          canvas.getObjects().forEach((obj) => obj.set({ selectable: false }));
          canvas.renderAll();
        });
      }
  
      canvas.isDrawingMode = false;
  
      const addCircle = (event) => {
        const pointer = canvas.getPointer(event.e);
        const circle = new fabric.Circle({
          left: pointer.x - 15,
          top: pointer.y - 15,
          radius: 15,
          fill: "rgba(173, 216, 230, 0.3)",
          stroke: "rgba(173, 216, 230, 0.3)",
          strokeWidth: 2,
          selectable: false,
        });
  
        canvas.add(circle);
        saveState();
      };
  
      const saveState = () => {
        if (!selectedTooth || !editor?.canvas) return;
        const currentState = JSON.stringify(editor.canvas.toJSON());
  
        savedToothMarkers.current[selectedTooth] = currentState;
  
        setData((prev) => ({
          ...prev,
          dentalRecordChart: {
            ...prev.dentalRecordChart,
            drawing_data: {
              ...prev.dentalRecordChart.drawing_data,
              [selectedTooth]: currentState,
            },
          },
        }));
      };
  
      canvas.off("mouse:down");
      canvas.on("mouse:down", addCircle);
  
      return () => {
        canvas.off("mouse:down", addCircle);
      };
    }, [selectedTooth, editor, data, setData]);
  
    return { savedToothMarkers };
  };
  
  export default useDentalCanvas;