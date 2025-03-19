import { toast } from "react-hot-toast";

const useMedicalRecordValidation = (data, patient) => {
    const focusInvalidField = () => {
        const invalidInput = document.querySelector("input:invalid");
        if (invalidInput) {
            invalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
            invalidInput.focus();
        }
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                // Step 1: Review of Systems
                // If "Others" is checked, input must not be empty
                if (data.review_of_systems.includes("Others") && !data.others.trim()) {
                    toast.error("Please specify the other symptom.");
                    focusInvalidField();
                    return false;
                }
                break;

            case 2:
                // Step 2: Vital Signs
                if (
                    !data.bp.trim() ||
                    !data.rr.trim() ||
                    !data.hr.trim() ||
                    !data.temperature.trim()
                ) {
                    toast.error("All Vital Signs are required.");
                    focusInvalidField();
                    return false;
                }

                // Deformities Mandatory if Checked
                if (data.deformity && data.deformities.length === 0) {
                    toast.error(
                        "Please select at least one deformity if Deformities is checked."
                    );
                    focusInvalidField();
                    return false;
                }
                break;

            case 3:
                // Step 3: Hospitalized & Surgery Reason
                if (data.hospitalized && !data.hospitalized_reason.trim()) {
                    toast.error("Hospitalized Reason is required.");
                    focusInvalidField();
                    return false;
                }

                if (data.previous_surgeries && !data.surgery_reason.trim()) {
                    toast.error("Surgery Reason is required.");
                    focusInvalidField();
                    return false;
                }

                if (
                    data.past_medical_histories.includes("Others") &&
                    !data.other_condition.trim()
                ) {
                    toast.error("Please specify the Other Condition.");
                    focusInvalidField();
                    return false;
                }

                // Female Patients OB/Gyne Validation 🔥
                if (patient.gender !== 1) {
                    if (!data.obGyneHistory) {
                        toast.error("OB/Gyne History is required for Female Patients.");
                        return false;
                    }

                    if (
                        data.obGyneHistory &&
                        (!data.menstruation ||
                            !data.duration ||
                            !data.last_menstrual_period.trim())
                    ) {
                        toast.error("Please complete all OB/Gyne History fields.");
                        focusInvalidField();
                        return false;
                    }

                    if (data.pregnant_before && !data.num_of_pregnancies) {
                        toast.error("Number of Pregnancies is required.");
                        focusInvalidField();
                        return false;
                    }
                }
                break;

            case 4:
                // ✅ Chief Complaint Validation
                if (!data.chief_complaint.trim()) {
                    toast.error("Chief Complaint is required.");
                    focusInvalidField();
                    return false;
                }

                // ✅ Present Illness Validation
                if (!data.present_illness.trim()) {
                    toast.error("Present Illness is required.");
                    focusInvalidField();
                    return false;
                }

                // ✅ Hospitalization Reason
                if (data.hospitalized && !data.hospitalized_reason.trim()) {
                    toast.error("Please provide a reason for hospitalization.");
                    focusInvalidField();
                    return false;
                }

                // ✅ Surgery Reason
                if (data.previous_surgeries && !data.surgery_reason.trim()) {
                    toast.error("Please provide a reason for previous surgeries.");
                    focusInvalidField();
                    return false;
                }

                // ✅ Smoker Validation
                if (
                    data.smoker &&
                    (!data.sticks_per_day.trim() || !data.years_smoking.trim())
                ) {
                    toast.error(
                        "Please complete Smoking History (Sticks per Day and Years Smoking)."
                    );
                    focusInvalidField();
                    return false;
                }

                // ✅ Alcoholic Drinker Validation
                if (!data.alcoholic_drinker) {
                    toast.error("Please select Alcoholic Drinker status.");
                    focusInvalidField();
                    return false;
                }

                // ✅ Illicit Drugs
                if (data.illicit_drugs === "") {
                    toast.error("Please select Illicit Drugs status.");
                    focusInvalidField();
                    return false;
                }

                // ✅ Eye Disorder Validation
                if (data.eye_disorder_no && (data.eye_glasses || data.contact_lens)) {
                    toast.error(
                        "You cannot select Eye Glasses or Contact Lens if No Eye Disorder is selected."
                    );
                    return false;
                }

                break;

            case 5:
                // ✅ Physical Examination Validation
                const hasInvalidExam = data.physical_examinations.some(
                    (exam) => exam.result === "Abnormal" && !exam.remarks.trim()
                );

                if (hasInvalidExam) {
                    toast.error(
                        "Please provide remarks for Abnormal Physical Examinations."
                    );
                    focusInvalidField();
                    return false;
                }

                break;

            case 6:
                // 🔥 Chest X-Ray File Validation (Optional but if selected, must be valid)
                if (
                    data.chest_xray &&
                    !(
                        data.chest_xray.type.includes("image") ||
                        data.chest_xray.type.includes("pdf")
                    )
                ) {
                    toast.error(
                        "Invalid file type for Chest X-Ray. Only images or PDFs are allowed."
                    );
                    focusInvalidField();
                    return false;
                }

                // ✅ Laboratory Test Validation (Only Numeric Fields)
                const numericTests = [
                    "fbs",
                    "uric_acid",
                    "triglycerides",
                    "t_cholesterol",
                    "creatinine",
                ];

                for (let test of numericTests) {
                    if (data[test] && isNaN(Number(data[test]))) {
                        toast.error(
                            `Invalid input for ${test.replace(
                                "_",
                                " "
                            )}. Please enter a numeric value.`
                        );
                        focusInvalidField();
                        return false;
                    }
                }

                // 🔥 Final Evaluation (Required)
                if (!data.final_evaluation.trim()) {
                    toast.error("Final Evaluation is required.");
                    focusInvalidField();
                    return false;
                }

                // 🔥 Plan Recommendation (Required)
                if (!data.plan_recommendation.trim()) {
                    toast.error("Plan/Recommendation is required.");
                    focusInvalidField();
                    return false;
                }

                return true;

            default:
                return true;
        }

        return true; // ✅ Passed
    };

    return { validateStep };
};

export default useMedicalRecordValidation;
