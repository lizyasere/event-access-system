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
    <div className="mb-2">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          {...registerProps}
          className={`w-full ${
            icon ? "pl-12" : "pl-4"
          } pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 hover:border-gray-300"
          }`}
        />
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
