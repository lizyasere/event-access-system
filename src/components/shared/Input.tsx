import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends Partial<UseFormRegisterReturn> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon, type = "text", placeholder, ...registerProps },
    ref
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          {...registerProps}
          className={`w-full ${
            icon ? "pl-10" : "pl-3"
          } pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
