import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Phone } from "lucide-react";
import { Input } from "../shared/Input";
import { Select } from "../shared/Select";
import { RadioGroup } from "../shared/RadioGroup";
import type { RegistrationFormData } from "../../types";

interface AssociateFormProps {
  index: number;
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
}

export const AssociateForm: React.FC<AssociateFormProps> = ({
  index,
  register,
  errors,
}) => {
  const titleOptions = ["Dr.", "Rev.", "Pastor", "Mr.", "Mrs.", "Ms.", "Prof."];

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Associate #{index + 1}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="mt-4">
        <RadioGroup
          label="Coming with car?"
          options={[
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ]}
          {...register(`associates.${index}.withCar`, {
            setValueAs: (v) => v === "true",
          })}
        />
      </div>
    </div>
  );
};
