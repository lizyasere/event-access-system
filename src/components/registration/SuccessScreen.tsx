import React, { useCallback, useMemo } from "react";
import { Mail, Check, ExternalLink } from "lucide-react";
import { API_CONFIG } from "../../config/api";

interface SuccessScreenProps {
  mainGuestName: string;
  qrCodes: { name: string; qrImage: string; token: string }[];
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  mainGuestName,
  qrCodes,
  onReset,
}) => {
  const passBaseUrl = useMemo(() => {
    const configured = API_CONFIG.CHECK_IN_BASE_URL;
    if (configured && configured.length) {
      return configured.replace(/\/$/, "");
    }
    if (typeof window !== "undefined") {
      return window.location.origin.replace(/\/$/, "");
    }
    return "";
  }, []);

  const buildPassUrl = useCallback(
    (token: string) => `${passBaseUrl}/pass/${token}`,
    [passBaseUrl]
  );

  const handleOpenPass = useCallback(
    (token: string, autoPrint = false) => {
      const url = `${buildPassUrl(token)}${autoPrint ? "?print=1" : ""}`;
      if (typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [buildPassUrl]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-10 border border-orange-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Registration Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Welcome, <span className="font-bold text-orange-600">{mainGuestName}</span>
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-600">
              <Mail className="w-6 h-6 text-white flex-shrink-0" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 mb-2">
                VIP Passes Sent to Your Email
              </p>
              <p className="text-gray-700 leading-relaxed">
                Each guest now has a personalized QR credential that matches the official pass template. Use the buttons below to open or download the full pass instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Digital VIP Passes
            </h2>
            <p className="text-sm text-gray-500">
              Downloads open the new branded layout automatically.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qrCodes.map((qr, idx) => (
              <div
                key={idx}
                className="border-2 border-orange-100 rounded-2xl p-6 bg-gradient-to-br from-white to-orange-50/30 hover:border-orange-300 hover:shadow-xl transition-all flex flex-col"
              >
                <p className="text-lg font-bold text-gray-900 mb-4 text-center">
                  {qr.name}
                </p>
                <div className="bg-white p-4 rounded-2xl shadow-inner flex flex-col items-center">
                  <img
                    src={qr.qrImage}
                    alt={`QR Code for ${qr.name}`}
                    className="w-48 h-48"
                  />
              
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => handleOpenPass(qr.token, true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View &amp; Print Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-8">
          <p className="text-gray-900 font-medium">
            <strong className="text-amber-800">Important:</strong> Share the pass links with associates so they can present the branded credential on arrival. Each pass also supports printing for physical access cards.
          </p>
        </div>

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
