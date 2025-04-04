import React from "react";

// CircleWithX component
const CircleWithX = ({ option = "1", circleId, shadedSide, setShadedSide }) => {
  // Get the shading path based on the selected side
  const getShadedPath = () => {
    switch (shadedSide) {
      case "left":
        return "M50,50 L20,20 A40,40 0 0,0 20,80 Z"; // Left quadrant
      case "right":
        return "M50,50 L80,20 A40,40 0 0,1 80,80 Z"; // Right quadrant
      case "top":
        return "M50,50 L20,20 A40,40 0 0,1 80,20 Z"; // Top quadrant
      case "bottom":
        return "M50,50 L20,80 A40,40 0 0,0 80,80 Z"; // Bottom quadrant
      default:
        return "";
    }
  };

  // Get the dot position for Option 2
  const getDotPosition = () => {
    switch (shadedSide) {
      case "left":
        return { cx: 25, cy: 50 };
      case "right":
        return { cx: 75, cy: 50 };
      case "top":
        return { cx: 50, cy: 25 };
      case "bottom":
        return { cx: 50, cy: 75 };
      default:
        return { cx: 50, cy: 50 };
    }
  };

  // Handle the click event on the circle
  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clickX = event.clientX;
    const clickY = event.clientY;

    const dx = clickX - cx;
    const dy = clickY - cy;

    // Calculate the side based on click coordinates
    let newSide = "";
    if (dx < 0 && dy < 0) {
      newSide = "top"; // Top quadrant
    } else if (dx > 0 && dy < 0) {
      newSide = "right"; // Right quadrant
    } else if (dx < 0 && dy > 0) {
      newSide = "left"; // Left quadrant
    } else {
      newSide = "bottom"; // Bottom quadrant
    }

    // Only update the shading if it's a new side click
    if (newSide !== shadedSide) {
      setShadedSide(circleId, newSide); // Set the shaded side based on the click
    }
  };

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      onClick={handleClick} // Add click event to capture the user's click
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="2" fill="white" />

      {/* X Lines */}
      <line x1="20" y1="20" x2="80" y2="80" stroke="black" strokeWidth="2" />
      <line x1="80" y1="20" x2="20" y2="80" stroke="black" strokeWidth="2" />

      {/* Pie Slice Shading (Option 1) */}
      {option === "1" && <path d={getShadedPath()} fill="rgba(0, 0, 0, 0.2)" />}

      {/* Dot Placement (Option 2) */}
      {option === "2" && <circle {...getDotPosition()} r="5" fill="black" />}
    </svg>
  );
};

export default CircleWithX;
