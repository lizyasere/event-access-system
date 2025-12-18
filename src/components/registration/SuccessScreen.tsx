import { Mail, Check } from "lucide-react";

export const SuccessScreen: React.FC<{
  mainGuestName: string;
  qrCodes: { name: string; qrImage: string }[];
  onReset: () => void;
}> = ({ mainGuestName, qrCodes, onReset }) => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 border border-orange-100">
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
              QR Codes Sent to Your Email
            </p>
            <p className="text-gray-700 leading-relaxed">
              Check your inbox for your personalized access codes. Each person has their own unique QR code for seamless event entry.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-900">Your QR Access Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qrCodes.map((qr, idx) => (
            <div
              key={idx}
              className="border-2 border-orange-100 rounded-2xl p-6 text-center bg-gradient-to-br from-white to-orange-50/30 hover:border-orange-300 hover:shadow-xl transition-all"
            >
              <p className="text-lg font-bold text-gray-900 mb-4">
                {qr.name}
              </p>
              <div className="bg-white p-4 rounded-xl inline-block shadow-md">
                <img
                  src={qr.qrImage}
                  alt={`QR Code for ${qr.name}`}
                  className="w-52 h-52 mx-auto"
                />
              </div>
              <a
                href={qr.qrImage}
                download={`QR-${qr.name.replace(/\s+/g, "-")}.png`}
                className="inline-block mt-4 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Download QR Code
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-8">
        <p className="text-gray-900 font-medium">
          <strong className="text-amber-800">Important:</strong> Save this page or download the QR codes. You'll need them for smooth event entry.
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

export default SuccessScreen;
