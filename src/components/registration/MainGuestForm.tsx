import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserPlus, Mail, Phone, Building2, Briefcase } from "lucide-react";
import { Input } from "../shared/Input";
import { Select } from "../shared/Select";
import type { RegistrationFormInput } from "../../types";

interface MainGuestFormProps {
  register: UseFormRegister<RegistrationFormInput>;
  errors: FieldErrors<RegistrationFormInput>;
}

export const MainGuestForm: React.FC<MainGuestFormProps> = ({
  register,
  errors,
}) => {
  const titleOptions = [
    "Rev.",
    "Pastor",
    "Apostle",
    "Bishop",
    "Dr.",
    "Engr.",
    "Mr.",
    "Mrs.",
    "Ms.",
    "Prof.",
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
        <div className="p-2 rounded-lg bg-orange-100">
          <UserPlus className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Main Guest Information
          </h2>
          <p className="text-sm text-gray-600">Please provide your details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="mt-6">
        <Input
          label="Position"
          icon={<Briefcase className="w-5 h-5" />}
          {...register("mainGuest.position")}
          error={errors.mainGuest?.position?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Select
          label="Coming with spouse?"
          options={["Yes", "No"]}
          {...register("mainGuest.withSpouse", {
            setValueAs: (v) => v === "Yes",
          })}
          error={errors.mainGuest?.withSpouse?.message}
        />
        <Select
          label="Coming with car?"
          options={["Yes", "No"]}
          {...register("mainGuest.withCar", {
            setValueAs: (v) => v === "Yes",
          })}
          error={errors.mainGuest?.withCar?.message}
        />
      </div>

      <div className="mt-6">
        <Select
          label="Number of Associates"
          options={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
          {...register("mainGuest.numAssociates", {
            setValueAs: (v) => parseInt(v) || 0,
          })}
          error={errors.mainGuest?.numAssociates?.message}
        />
      </div>
    </div>
  );
};
