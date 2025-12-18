import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserPlus, Mail, Phone, Building2, Briefcase } from "lucide-react";
import { Input } from "../shared/Input";
import { Select } from "../shared/Select";
import { RadioGroup } from "../shared/RadioGroup";
import type { RegistrationFormData } from "../../types";

interface MainGuestFormProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
}

export const MainGuestForm: React.FC<MainGuestFormProps> = ({
  register,
  errors,
}) => {
  const titleOptions = ["Dr.", "Rev.", "Pastor", "Mr.", "Mrs.", "Ms.", "Prof."];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-orange-500" />
        Main Guest Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Title"
          options={titleOptions}
          {...register("mainGuest.title")}
          error={errors.mainGuest?.title?.message}
        />
        <Input
          label="Surname"
          {...register("mainGuest.surname")}
          error={errors.mainGuest?.surname?.message}
        />
        <Input
          label="First Name"
          {...register("mainGuest.firstName")}
          error={errors.mainGuest?.firstName?.message}
        />
        <Input
          label="Phone (WhatsApp)"
          type="tel"
          icon={<Phone className="w-5 h-5" />}
          {...register("mainGuest.phone")}
          error={errors.mainGuest?.phone?.message}
          placeholder="+234XXXXXXXXXX"
        />
        <Input
          label="Email Address"
          type="email"
          icon={<Mail className="w-5 h-5" />}
          {...register("mainGuest.email")}
          error={errors.mainGuest?.email?.message}
        />
        <Input
          label="Church Name"
          icon={<Building2 className="w-5 h-5" />}
          {...register("mainGuest.churchName")}
          error={errors.mainGuest?.churchName?.message}
        />
      </div>

      <Input
        label="Position"
        icon={<Briefcase className="w-5 h-5" />}
        {...register("mainGuest.position")}
        error={errors.mainGuest?.position?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <RadioGroup
          label="Coming with spouse?"
          options={[
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ]}
          {...register("mainGuest.withSpouse", {
            setValueAs: (v) => v === "true",
          })}
        />
        <RadioGroup
          label="Coming with car?"
          options={[
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ]}
          {...register("mainGuest.withCar", {
            setValueAs: (v) => v === "true",
          })}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Associates
        </label>
        <input
          type="number"
          min="0"
          max="10"
          {...register("mainGuest.numAssociates", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {errors.mainGuest?.numAssociates && (
          <p className="mt-1 text-sm text-red-600">
            {errors.mainGuest.numAssociates.message}
          </p>
        )}
      </div>
    </div>
  );
};
