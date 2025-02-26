import React from "react";

const MedicalModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
        <button className="absolute top-2 right-2 text-red-500" onClick={onClose}>✖</button>
        <h2 className="text-lg font-semibold text-green-700">Medical Record</h2>
        <p>Medical form goes here...</p>
      </div>
    </div>
  );
};

export default MedicalModal;
