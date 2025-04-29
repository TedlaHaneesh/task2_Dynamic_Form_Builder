import React from "react";
import {
  FormSection as FormSectionType,
  FormValues,
  FormErrors,
} from "../types";
import FormField from "./FormField";

interface FormSectionProps {
  section: FormSectionType;
  values: FormValues;
  errors: FormErrors;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onSubmit: () => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  values,
  errors,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onSubmit,
}) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
        {section.description && (
          <p className="mt-1 text-sm text-gray-600">{section.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={
              values[field.fieldId] || (field.type === "checkbox" ? false : "")
            }
            onChange={onChange}
            error={errors[field.fieldId]}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        {!isFirst && (
          <button
            type="button"
            onClick={onPrev}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
        )}

        {!isFirst && !isLast && <div />}

        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FormSection;
