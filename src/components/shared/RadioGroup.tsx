import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface RadioGroupProps extends Partial<UseFormRegisterReturn> {
  label: string;
  options: { label: string; value: string }[];
}

export const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ label, options, name, ...registerProps }, ref) => (
    <div className="mb-2">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        {label}
      </label>
      <div className="flex gap-6">
        {options.map((opt, index) => (
          <label key={opt.value} className="flex items-center cursor-pointer group">
            <input
              ref={index === 0 ? ref : undefined}
              type="radio"
              value={opt.value}
              {...registerProps}
              name={name}
              className="w-5 h-5 text-orange-600 focus:ring-2 focus:ring-orange-500 border-2 border-gray-300"
            />
            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
);

RadioGroup.displayName = "RadioGroup";
