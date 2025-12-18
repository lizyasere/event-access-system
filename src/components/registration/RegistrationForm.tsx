import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Users, Check, Loader2 } from "lucide-react";
import type { RegistrationFormData } from "../../types";
import { registrationSchema } from "../../types";
import { apiService } from "../../services/api";
import { qrService } from "../../services/qr";
import { MainGuestForm } from "./MainGuestForm";
import { AssociateForm } from "./AssociateForm";
import { SuccessScreen } from "./SuccessScreen";
import { emailService } from "../../services/email";


export const RegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    mainGuestName: string;
    qrCodes: { name: string; qrImage: string }[];
  } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      mainGuest: {
        title: "",
        surname: "",
        firstName: "",
        phone: "",
        email: "",
        churchName: "",
        position: "",
        withSpouse: false,
        withCar: false,
        numAssociates: 0,
      },
      associates: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "associates",
  });

  const numAssociates = watch("mainGuest.numAssociates");

  useEffect(() => {
    const currentLength = fields.length;
    if (numAssociates > currentLength) {
      for (let i = currentLength; i < numAssociates; i++) {
        append({
          title: "",
          surname: "",
          firstName: "",
          phone: "",
          withCar: false,
        });
      }
    } else if (numAssociates < currentLength) {
      for (let i = currentLength - 1; i >= numAssociates; i--) {
        remove(i);
      }
    }
  }, [numAssociates, fields.length, append, remove]);

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiService.registerGuests(data);
      
      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      const qrCodes = await qrService.generateQRCodesForGuests(response.guests);

      // Send email with QR codes
      await emailService.sendQRCodes(data.mainGuest, qrCodes);

      const mainGuestName = `${data.mainGuest.title} ${data.mainGuest.firstName} ${data.mainGuest.surname}`;
      setSuccessData({ mainGuestName, qrCodes });
      setShowSuccess(true);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setShowSuccess(false);
    setSuccessData(null);
    reset();
  };

  if (showSuccess && successData) {
    return (
      <SuccessScreen
        mainGuestName={successData.mainGuestName}
        qrCodes={successData.qrCodes}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-t-2xl p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <UserPlus className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            30th Anniversary Celebration
          </h1>
          <p className="text-center text-white text-opacity-90">
            VIP Guest Registration
          </p>
        </div>

        <div className="bg-white rounded-b-2xl shadow-xl p-8">
          <MainGuestForm register={register} errors={errors} />

          {fields.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-orange-500" />
                Associates ({fields.length})
              </h2>
              {fields.map((field, index) => (
                <AssociateForm
                  key={field.id}
                  index={index}
                  register={register}
                  errors={errors}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing Registration...
              </>
            ) : (
              <>
                <Check className="w-6 h-6" />
                Complete Registration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
