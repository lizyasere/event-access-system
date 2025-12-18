import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Phone, Trash2 } from "lucide-react";
import { Input } from "../shared/Input";
import { Select } from "../shared/Select";
import type { RegistrationFormInput } from "../../types";

interface AssociateFormProps {
  index: number;
  register: UseFormRegister<RegistrationFormInput>;
  errors: FieldErrors<RegistrationFormInput>;
  onRemove: () => void;
}

export const AssociateForm: React.FC<AssociateFormProps> = ({
  index,
  register,
  errors,
  onRemove,
}) => {
  const titleOptions = ["Dr.", "Rev.", "Pastor", "Mr.", "Mrs.", "Ms.", "Prof."];

  return (
    <div className="border-2 border-orange-100 rounded-xl p-6 mb-6 bg-gradient-to-br from-gray-50 to-orange-50/30 hover:border-orange-200 transition-colors">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Associate #{index + 1}
          </h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove this associate"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          label="Title"
          options={titleOptions}
          {...register(`associates.${index}.title`)}
          error={errors.associates?.[index]?.title?.message}
        />
        <Input
          label="Surname"
          {...register(`associates.${index}.surname`)}
          error={errors.associates?.[index]?.surname?.message}
        />
        <Input
          label="First Name"
          {...register(`associates.${index}.firstName`)}
          error={errors.associates?.[index]?.firstName?.message}
        />
        <Input
          label="Phone"
          type="tel"
          icon={<Phone className="w-5 h-5" />}
          {...register(`associates.${index}.phone`)}
          error={errors.associates?.[index]?.phone?.message}
        />
      </div>

      <div className="mt-5">
        <Select
          label="Coming with car?"
          options={["Yes", "No"]}
          {...register(`associates.${index}.withCar`, {
            setValueAs: (v) => v === "Yes",
          })}
          error={errors.associates?.[index]?.withCar?.message}
        />
      </div>
    </div>
  );
};
