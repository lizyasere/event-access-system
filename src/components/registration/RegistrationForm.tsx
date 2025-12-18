import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Check, Loader2 } from "lucide-react";
import type { RegistrationFormData, RegistrationFormInput } from "../../types";
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
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormInput, unknown, RegistrationFormData>({
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

  const handleRemoveAssociate = (index: number) => {
    remove(index);
    const updatedCount = Math.max((numAssociates || 0) - 1, 0);
    setValue("mainGuest.numAssociates", updatedCount);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Elegant Header */}
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-6">
            <UserPlus className="w-5 h-5 text-white" />
          </div> */}
          <h1 className=" font-bold text-gray-900 mb-3">
            Guest Registration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join us for the 30th Anniversary Celebration. Please fill in your details below to receive your personalized QR access codes.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <MainGuestForm register={register} errors={errors} />

              {fields.length > 0 && (
                <div className="mb-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Associates
                      </h2>
                      <p className="text-sm text-gray-600">
                        {fields.length} {fields.length === 1 ? 'person' : 'people'} registered
                      </p>
                    </div>
                  </div>
                  {fields.map((field, index) => (
                    <AssociateForm
                      key={field.id}
                      index={index}
                      register={register}
                      errors={errors}
                      onRemove={() => handleRemoveAssociate(index)}
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing Your Registration...
                  </>
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    Complete Registration
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                By registering, you'll receive QR codes via email for event access
              </p>
            </form>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p> Your information is secure and will only be used for this event</p>
        </div>
      </div>
    </div>
  );
};
