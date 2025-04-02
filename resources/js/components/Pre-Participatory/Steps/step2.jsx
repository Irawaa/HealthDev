import React, { useEffect } from "react";
import { useInterviewQuestion } from "@/Pages/Patients/ProfilePage";

const Step2 = ({ formData, setFormData }) => {
  const interviewQuestions = useInterviewQuestion(); // Get questions from context
  console.log(interviewQuestions);

  // Ensure all interview questions exist in formData
  useEffect(() => {
    if (!formData.interview_questions || formData.interview_questions.length === 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        interview_questions: interviewQuestions.map((q) => ({
          question_id: q.id,
          response: "",
          remarks: "",
        })),
      }));
    }
  }, [interviewQuestions, setFormData]); // Ensure it updates when `setFormData` is triggered  

  const handleChange = (questionId, value) => {
    const updatedAnswers = formData.interview_questions.map((answer) =>
      answer.question_id === questionId ? { ...answer, response: value } : answer
    );

    setFormData({ ...formData, interview_questions: updatedAnswers });
  };

  const handleRemarkChange = (questionId, value) => {
    const updatedAnswers = formData.interview_questions.map((answer) =>
      answer.question_id === questionId ? { ...answer, remarks: value } : answer
    );

    setFormData({ ...formData, interview_questions: updatedAnswers });
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-green-800">
        Step 2: Interview Questions
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-green-100 text-green-900">
              <th className="border p-2 text-left">Question</th>
              <th className="border p-2">Yes</th>
              <th className="border p-2">No</th>
              <th className="border p-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {interviewQuestions.map((q) => {
              const existingAnswer =
                formData.interview_questions.find((a) => a.question_id === q.id) || {
                  question_id: q.id,
                  response: "",
                  remarks: "",
                };

              return (
                <tr key={q.id} className="border hover:bg-green-50 transition">
                  <td className="border p-2">{q.question}</td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value="Yes"
                      checked={existingAnswer.response === "Yes"}
                      onChange={() => handleChange(q.id, "Yes")}
                      className="h-4 w-4 accent-green-600"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value="No"
                      checked={existingAnswer.response === "No"}
                      onChange={() => handleChange(q.id, "No")}
                      className="h-4 w-4 accent-red-600"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                      placeholder="Enter remarks..."
                      value={existingAnswer.remarks || ""}
                      onChange={(e) => handleRemarkChange(q.id, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Step2;
