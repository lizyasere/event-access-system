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
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-yellow-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-6 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 rounded-full p-4">
              <Camera className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Event Check-In Scanner
          </h1>
          <p className="text-center text-gray-600">
            30th Anniversary Celebration
          </p>
        </div>

        {/* Scanner Setup */}
        {!isScanning ? (
          <div className="bg-white p-6 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scanner Name (Protocol Officer)
                </label>
                <input
                  type="text"
                  value={scannerName}
                  onChange={(e) => setScannerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {API_CONFIG.EVENT_DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={startScanning}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
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
              <div className="bg-white p-6 shadow-lg">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Scanning for: {selectedDay}
                    </span>
                    <span className="text-sm text-gray-600">
                      Officer: {scannerName}
                    </span>
                  </div>
                </div>

                <div id="qr-reader" className="rounded-lg overflow-hidden"></div>

                <button
                  onClick={stopScanning}
                  className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Stop Scanning
                </button>
              </div>
            )}

            {/* Check-In Result */}
            {checkInResult && scannedGuest && (
              <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
                {/* Success/Error Banner */}
                {checkInResult.success ? (
                  <div className="bg-green-500 p-4">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-bold text-lg">
                        Check-In Successful!
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-500 p-4">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <XCircle className="w-6 h-6" />
                      <span className="font-bold text-lg">
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
                <div className="p-6 bg-gray-50">
                  <button
                    onClick={resetScanner}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
                  >
                    Scan Next Guest
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && !scannedGuest && (
              <div className="bg-white p-6 rounded-b-2xl shadow-lg">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <button
                  onClick={resetScanner}
                  className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
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
