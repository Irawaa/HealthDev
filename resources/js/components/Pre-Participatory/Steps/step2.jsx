const questions = [
    "May pagkakataon ba na hindi ka pinahintulutan ng isang doctor na makilahok sa anumang isport/aktibidad sa anumang kadahilanan?",
    "Napayuhan ka na ba ng doctor na magpagawa ng ECG o 2D echo?",
    "Kasalukuyan ka bang umiinom ng anumang gamot?",
    "Naranasan mo na ba ang sumakit o parang may nakadagan sa dibdib o hirap sa paghinga habang o pagkatapos ng ehersisyo?",
    "Naranasan mo na ba na magkaroon ng sprain, nabalian ng buto o dislocated joints?",
    "Naranasan mo na bang mag-kumbulsyon?",
  ];
  
  const Step2 = ({ formData, setFormData }) => {
    const handleChange = (index, value) => {
      const updatedAnswers = [...formData.interviewAnswers];
      updatedAnswers[index] = { ...updatedAnswers[index], answer: value };
      setFormData({ ...formData, interviewAnswers: updatedAnswers });
    };
  
    const handleRemarkChange = (index, value) => {
      const updatedAnswers = [...formData.interviewAnswers];
      updatedAnswers[index] = { ...updatedAnswers[index], remark: value };
      setFormData({ ...formData, interviewAnswers: updatedAnswers });
    };
  
    return (
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-800">Step 2: Interview Questions</h3>
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
              {questions.map((q, index) => (
                <tr key={index} className="border hover:bg-green-50 transition">
                  <td className="border p-2">{q}</td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name={`q${index}`}
                      value="Yes"
                      checked={formData.interviewAnswers[index].answer === "Yes"}
                      onChange={() => handleChange(index, "Yes")}
                      className="h-4 w-4 accent-green-600"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="radio"
                      name={`q${index}`}
                      value="No"
                      checked={formData.interviewAnswers[index].answer === "No"}
                      onChange={() => handleChange(index, "No")}
                      className="h-4 w-4 accent-red-600"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                      placeholder="Enter remarks..."
                      value={formData.interviewAnswers[index].remark}
                      onChange={(e) => handleRemarkChange(index, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Step2;
  