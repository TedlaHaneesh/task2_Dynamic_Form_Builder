import React, { useState, useEffect } from "react";
import {
  User,
  FormResponse,
  FormValues,
  FormErrors,
  FormSection as FormSectionType,
} from "../types";
import { getForm } from "../api";
import { validateSection } from "../utils/validation";
import FormSection from "./FormSection";

interface DynamicFormProps {
  user: User;
  onLogout: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ user, onLogout }) => {
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const data = await getForm(user.rollNumber);

        if (data) {
          setFormData(data);
          setError(null);
        } else {
          setError("Failed to load form data. Please try again.");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [user.rollNumber]);

  const handleFieldChange = (
    fieldId: string,
    value: string | string[] | boolean
  ) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));

    // Clear error when user starts typing
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateCurrentSection = (): boolean => {
    if (!formData) return false;

    const currentSection = formData.form.sections[currentSectionIndex];
    const { isValid, errors } = validateSection(
      currentSection.fields,
      formValues
    );

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentSection() && formData) {
      if (currentSectionIndex < formData.form.sections.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentSection()) {
      console.log("Form submitted with values:", formValues);
      // Here you would typically send the data to an API
      alert("Form submitted successfully! Check console for the form data.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-600 mb-4">No form data available.</div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentSection = formData.form.sections[currentSectionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {formData.form.formTitle}
        </h1>
        <button
          onClick={onLogout}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Logout
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentSectionIndex + 1) / formData.form.sections.length) *
                100
              }%`,
            }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600 text-right">
          Section {currentSectionIndex + 1} of {formData.form.sections.length}
        </div>
      </div>

      <FormSection
        section={currentSection}
        values={formValues}
        errors={formErrors}
        onChange={handleFieldChange}
        onNext={handleNext}
        onPrev={handlePrev}
        isFirst={currentSectionIndex === 0}
        isLast={currentSectionIndex === formData.form.sections.length - 1}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DynamicForm;
