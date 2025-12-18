import { Mail, Check } from "lucide-react";

export const SuccessScreen: React.FC<{
  mainGuestName: string;
  qrCodes: { name: string; qrImage: string }[];
  onReset: () => void;
}> = ({ mainGuestName, qrCodes, onReset }) => (
  <div className="min-h-screen bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Registration Successful!
        </h1>
        <p className="text-gray-600">
          Thank you, <span className="font-semibold">{mainGuestName}</span>
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              QR Codes Sent to Your Email
            </p>
            <p className="text-sm text-blue-700">
              Check your inbox for your personalized access codes. Each person
              has their own QR code.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Your QR Codes:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qrCodes.map((qr, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 text-center"
            >
              <p className="text-sm font-medium text-gray-700 mb-2">
                {qr.name}
              </p>
              <img
                src={qr.qrImage}
                alt={`QR Code for ${qr.name}`}
                className="w-48 h-48 mx-auto"
              />
              <a
                href={qr.qrImage}
                download={`QR-${qr.name.replace(/\s+/g, "-")}.png`}
                className="inline-block mt-2 text-sm text-orange-500 hover:underline"
              >
                Download QR Code
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-900">
          <strong>Important:</strong> Save this page or download the QR codes.
          You'll need them for event entry.
        </p>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
      >
        Register Another Guest
      </button>
    </div>
  </div>
);

export default SuccessScreen;
