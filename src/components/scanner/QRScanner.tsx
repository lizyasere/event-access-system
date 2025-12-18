import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { qrService } from "../../services/qr";
import { apiService } from "../../services/api";
import type { GuestData, CheckInResponse } from "../../types";
import { GuestDetails } from "./GuestDetails";
import { API_CONFIG } from "../../config/api";

export const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedGuest, setScannedGuest] = useState<GuestData | null>(null);
  const [checkInResult, setCheckInResult] = useState<CheckInResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(API_CONFIG.EVENT_DAYS[0]);
  const [scannerName, setScannerName] = useState<string>("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerInitialized = useRef(false);

  useEffect(() => {
    if (isScanning && !scannerInitialized.current) {
      scannerInitialized.current = true;

      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanError);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerInitialized.current = false;
      }
    };
  }, [isScanning]);

  const onScanSuccess = async (decodedText: string) => {
    // Stop scanner temporarily
    if (scannerRef.current) {
      scannerRef.current.pause(true);
    }

    setError(null);
    setCheckInResult(null);

    // Extract token from URL
    const token = qrService.parseQRCodeUrl(decodedText) || decodedText;

    try {
      // Check in the guest
      const result = await apiService.checkInGuest({
        token,
        day: selectedDay,
        scannerName: scannerName || undefined,
      });

      setCheckInResult(result);
      setScannedGuest(result.guest || null);

      // Auto-reset after 5 seconds
      setTimeout(() => {
        resetScanner();
      }, 5000);
    } catch (err) {
      setError("Failed to process check-in. Please try again.");
      console.error(err);
      setTimeout(() => resetScanner(), 3000);
    }
  };

  const onScanError = (errorMessage: string) => {
    // Suppress continuous scan errors to avoid console spam
    if (!errorMessage.includes("No MultiFormat Readers")) {
      console.warn("QR Scan Error:", errorMessage);
    }
  };

  const resetScanner = () => {
    setScannedGuest(null);
    setCheckInResult(null);
    setError(null);
    if (scannerRef.current) {
      scannerRef.current.resume();
    }
  };

  const startScanning = () => {
    if (!scannerName.trim()) {
      setError("Please enter your name before scanning");
      return;
    }
    setIsScanning(true);
    setError(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerInitialized.current = false;
      scannerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 shadow-lg">
              <Camera className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
            Event Check-In Scanner
          </h1>
          <p className="text-center text-lg text-gray-600">
            30th Anniversary Celebration
          </p>
        </div>

        {/* Scanner Setup */}
        {!isScanning ? (
          <div className="bg-white p-8 shadow-xl border-x border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Scanner Name (Protocol Officer)
                </label>
                <input
                  type="text"
                  value={scannerName}
                  onChange={(e) => setScannerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Event Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  {API_CONFIG.EVENT_DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={startScanning}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <Camera className="w-6 h-6" />
                Start Scanning
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* QR Scanner Display */}
            {!scannedGuest && (
              <div className="bg-white p-8 shadow-xl border-x border-gray-100">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <span className="text-sm font-bold text-gray-900">
                      📅 {selectedDay}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Officer: {scannerName}
                    </span>
                  </div>
                </div>

                <div id="qr-reader" className="rounded-2xl overflow-hidden border-4 border-orange-200"></div>

                <button
                  onClick={stopScanning}
                  className="w-full mt-6 bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Stop Scanning
                </button>
              </div>
            )}

            {/* Check-In Result */}
            {checkInResult && scannedGuest && (
              <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Success/Error Banner */}
                {checkInResult.success ? (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                    <div className="flex items-center justify-center gap-3 text-white">
                      <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                      <span className="font-bold text-2xl">
                        Check-In Successful!
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
                    <div className="flex items-center justify-center gap-3 text-white">
                      <XCircle className="w-8 h-8" strokeWidth={3} />
                      <span className="font-bold text-2xl">
                        {checkInResult.alreadyCheckedIn
                          ? "Already Checked In"
                          : "Check-In Failed"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Guest Details */}
                <GuestDetails guest={scannedGuest} day={selectedDay} />

                {/* Actions */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-orange-50">
                  <button
                    onClick={resetScanner}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
                  >
                    Scan Next Guest
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && !scannedGuest && (
              <div className="bg-white p-8 rounded-b-3xl shadow-xl border border-gray-100">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-bold text-red-900 mb-1">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <button
                  onClick={resetScanner}
                  className="w-full mt-6 bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
