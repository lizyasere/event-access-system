import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface RadioGroupProps extends Partial<UseFormRegisterReturn> {
  label: string;
  options: { label: string; value: string }[];
}

export const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ label, options, name, ...registerProps }, ref) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-4">
        {options.map((opt, index) => (
          <label key={opt.value} className="flex items-center cursor-pointer">
            <input
              ref={index === 0 ? ref : undefined}
              type="radio"
              value={opt.value}
              {...registerProps}
              name={name}
              className="w-4 h-4 text-orange-500 focus:ring-orange-500"
            />
            <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
);

RadioGroup.displayName = "RadioGroup";
