const Step2 = ({ data, setData, errors }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4 text-center">
                Initial Periodontal Examination
            </h3>

            {/* Gingival and Periodontal Status */}
            <fieldset className="mb-6">
                <legend className="font-semibold text-gray-700 mb-2">
                    Gingival and Periodontal Status:
                </legend>
                <div className="space-y-2">
                    {["Normal", "Gingivitis (early, moderate, severe)", "Periodontitis (early, moderate, severe)"].map((status) => (
                        <label key={status} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="gingival_status"
                                value={status}
                                checked={data.gingival_status === status}
                                onChange={(e) => setData("gingival_status", e.target.value)}
                                className="accent-green-700"
                            />
                            <span>{status}</span>
                        </label>
                    ))}
                </div>
                {errors.gingival_status && <p className="text-red-500 text-sm mt-1">{errors.gingival_status}</p>}
            </fieldset>

            {/* Plaque and Calculus Deposit */}
            <fieldset className="mb-6">
                <legend className="font-semibold text-gray-700 mb-2">
                    Plaque and Calculus Deposit:
                </legend>
                <div className="space-y-2">
                    {["Light", "Moderate", "Heavy"].map((level) => (
                        <label key={level} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="plaque_deposit"
                                value={level}
                                checked={data.plaque_deposit === level}
                                onChange={(e) => setData("plaque_deposit", e.target.value)}
                                className="accent-green-700"
                            />
                            <span>{level}</span>
                        </label>
                    ))}
                </div>
                {errors.plaque_deposit && <p className="text-red-500 text-sm mt-1">{errors.plaque_deposit}</p>}
            </fieldset>

            {/* Existing Dentures, Orthodontic Treatment, Other Treatments */}
            <label className="block mb-4">
                <span className="font-semibold text-gray-700">
                    Existing Dentures, Orthodontic Treatment, Other Undergoing Treatment:
                </span>
                <textarea
                    className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={data.other_treatments}
                    onChange={(e) => setData("other_treatments", e.target.value)}
                    placeholder="Describe existing treatments..."
                />
                {errors.other_treatments && <p className="text-red-500 text-sm mt-1">{errors.other_treatments}</p>}
            </label>
        </div>
    );
};

export default Step2;
