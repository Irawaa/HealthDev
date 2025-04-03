import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const usePreParticipatoryValidation = (data) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateForm(); // Validate on every data change
  }, [data]);

  const validateForm = () => {
    let newErrors = {};

    // Ensure required fields are filled
    if (!data.weight || isNaN(data.weight) || parseInt(data.weight) > 300) {
      newErrors.weight = "Weight must be a whole number and not exceed 300.";
    }
    if (!data.height || isNaN(data.height) || parseInt(data.height) > 500) {
      newErrors.height = "Height must be a whole number and not exceed 500.";
    }

    // Ensure temperature follows 0.00 format
    const tempPattern = /^\d{1,2}(\.\d{2})?$/; // 0.00 or 00.00
    if (!data.temperature || !tempPattern.test(data.temperature)) {
      newErrors.temperature = "Temperature must be in the format 0.00 or 00.00.";
    }

    if (!data.bp) newErrors.bp = "Blood Pressure is required.";
    if (!data.rr) newErrors.rr = "Respiratory Rate is required.";
    if (!data.hr) newErrors.hr = "Heart Rate is required.";

    // Validate interview responses
    data.interview_questions.forEach((question, index) => {
      if (!question.response) {
        newErrors[`interview_question_${index}`] = "Please select Yes or No.";
      }
      if (question.response === "Yes" && !question.remarks.trim()) {
        newErrors[`interview_remarks_${index}`] = "Remarks are required for 'Yes' answers.";
      }
    });

    // Validate physical examinations
    data.physical_examinations.forEach((exam, index) => {
      if (exam.result === "Abnormal" && !exam.remarks.trim()) {
        newErrors[`physical_exam_${index}`] = "Remarks are required for 'Abnormal' results.";
      }
    });

    // Validate final evaluation
    if (data.final_evaluation === "1" && !data.further_evaluation.trim()) {
      newErrors.further_evaluation = "Further evaluation details are required.";
    }

    // Validate Not Cleared For
    // if (data.not_cleared_for === "Activity, please specify:" && !data.activity_specification.trim()) {
    //   newErrors.activity_specification = "Please specify the activity.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  return { errors, validateForm };
};

export default usePreParticipatoryValidation;
