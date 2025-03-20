const Step3 = ({ data, setData, errors }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4 text-center">
                Recommended Treatment
            </h3>

            <label className="block mb-4">
                <span className="font-semibold text-gray-700">
                    Recommended Treatment:
                </span>
                <textarea
                    className="w-full border border-gray-300 rounded p-2 mt-1 h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={data.recommended_treatment}
                    onChange={(e) => setData("recommended_treatment", e.target.value)}
                    placeholder="Enter recommended treatment here..."
                />
                {errors.recommended_treatment && <p className="text-red-500 text-sm mt-1">{errors.recommended_treatment}</p>}
            </label>
        </div>
    );
};

export default Step3;
