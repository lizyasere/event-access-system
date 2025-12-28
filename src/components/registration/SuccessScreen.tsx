import React from "react";
import { Mail, Check, CheckCircle, Inbox } from "lucide-react";

interface SuccessScreenProps {
  mainGuestName: string;
  mainGuestEmail?: string;
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  mainGuestName,
  mainGuestEmail,
  onReset,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-10 border border-orange-100">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Registration Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Welcome,{" "}
            <span className="font-bold text-orange-600">{mainGuestName}</span>
          </p>
        </div>

        {/* Email Sent Notification */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-600 flex-shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900 mb-2">
                Your VIP Passes Have Been Sent!
              </p>
              <p className="text-gray-700">
                We've sent your digital VIP access passes to:
              </p>
              <p className="text-lg font-semibold text-green-700 mt-1">
                {mainGuestEmail || "your registered email"}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-orange-50 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-orange-600" />
            What to do next:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                Check your email inbox for the VIP Guest Logistics Guide
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                <strong>Don't see it?</strong> Check your spam/junk folder
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                Present your QR code (printed or on phone) at the event entrance
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                Arrive by <strong>3:30 PM</strong> for gate opening
              </span>
            </li>
          </ul>
        </div>

        {/* Event Details Reminder */}
        <div className="text-center mb-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Event Date</p>
          <p className="text-lg font-bold text-gray-900">December 28, 2025 · 4:00 PM</p>
          <p className="text-sm text-gray-600 mt-1">
            Rehoboth Multi-Purpose Hall, Calvary Bus Stop, Ikotun
          </p>
        </div>

        {/* Register Another Button */}
        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-4 rounded-xl font-bold text-lg hover:from-gray-200 hover:to-gray-300 hover:shadow-lg transition-all"
        >
          Register Another Guest
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
