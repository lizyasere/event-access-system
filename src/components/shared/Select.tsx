import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface SelectProps extends Partial<UseFormRegisterReturn> {
  label: string;
  error?: string;
  options: string[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, ...registerProps }, ref) => (
    <div className="mb-2">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>
      <select
        ref={ref}
        title={label}
        {...registerProps}
        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";
