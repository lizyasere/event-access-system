import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import type { GuestData } from "../../types";
import { apiService } from "../../services/api";
import { API_CONFIG } from "../../config/api";

const EVENT_DETAILS = {
  name: "30th Anniversary Celebration",
  host: "Calvary Bible Church",
  date: "December 28, 2025 · 4:00 PM",
  gateOpen: "Gate opens by 3:30 PM",
  venue:
    "Rehoboth Multi-Purpose Hall, Calvary Bus Stop, Ikotun, 257 Ikotun - Idimu Rd, Ikotun, Lagos",
};

const LOGO_URL = "/branding/cbc-logo.png";
const BANNER_URL = "/branding/vip-banner.svg";

export const GuestPass: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoPrintRequested, setAutoPrintRequested] = useState(false);

  useEffect(() => {
    const styleId = "guest-pass-print-style";
    if (document.getElementById(styleId)) {
      return;
    }
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @media print {
        body {
          background: #fff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body * { visibility: hidden; }
        #guest-pass-print-root,
        #guest-pass-print-root * {
          visibility: visible;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #guest-pass-print-root {
          position: absolute;
          inset: 0;
          margin: 0 !important;
          width: 100%;
          background: #fff;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "1") {
      setAutoPrintRequested(true);
    }
  }, []);

  useEffect(() => {
    if (!autoPrintRequested || isLoading || !guest) {
      return;
    }

    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, [autoPrintRequested, isLoading, guest]);

  useEffect(() => {
    if (!token) {
      setError("Missing pass token");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const data = await apiService.getGuestByToken(token);
        if (!isMounted) return;
        if (!data) {
          setError("Guest not found or link expired");
        } else {
          setGuest(data);
        }
      } catch (err) {
        console.error("Unable to load pass", err);
        if (isMounted) {
          setError("Unable to load pass. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const qrValue = useMemo(() => {
    const baseUrl =
      API_CONFIG.CHECK_IN_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    // Use /pass/ URL so scanning shows the pass, not the scanner
    return token ? `${baseUrl}/pass/${token}` : "";
  }, [token]);

  const handleDownloadPdf = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Unable to Load Pass
          </h2>
          
          <p className="text-gray-600 mb-6">
            {error || "We couldn't find your guest pass. This could happen if:"}
          </p>
          
          {!error && (
            <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                The link has expired or is invalid
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                There's a temporary connection issue
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                The registration hasn't been completed yet
              </li>
            </ul>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
            <Link 
              to="/" 
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Register as New Guest
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 mt-6">
            If you continue having issues, please contact the event administrator.
          </p>
        </div>
      </div>
    );
  }

  const guestTypeLabel =
    guest.type === "VIP"
      ? "VIP"
      : guest.type === "SPOUSE"
      ? "Spouse"
      : guest.type === "PA"
      ? "Personal Assistant"
      : "Associate";

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Digital access card
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            {EVENT_DETAILS.name}
          </h1>
          <p className="text-lg text-slate-600">
            Presented by {EVENT_DETAILS.host}
          </p>
        </div>

        <div
          id="guest-pass-print-root"
          className="mx-auto bg-white shadow-2xl rounded-[36px] border-4 border-slate-900 overflow-hidden"
        >
          <div
            className="text-white px-10 py-8 text-center relative"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.92), rgba(76,29,149,0.85)), url(${BANNER_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 bg-white/10 rounded-3xl px-5 py-3 w-full lg:w-auto">
                <img
                  src={LOGO_URL}
                  alt="Calvary Bible Church logo"
                  className="w-14 h-14 rounded-2xl border border-white/30 bg-white/10 object-contain p-2"
                />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-200">
                    {EVENT_DETAILS.host}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    VIP Entry Credential
                  </p>
                </div>
              </div>
              <div className="text-right w-full lg:w-auto">
                <p className="text-xs uppercase tracking-[0.35em] text-orange-200">
                  VIP ACCESS
                </p>
                <h2 className="text-4xl font-black mt-2 break-words">
                  {guest.fullName}
                </h2>
                <p className="text-lg text-slate-100 mt-3">
                  {guestTypeLabel} · Code: {guest.token}
                </p>
              </div>
            </div>
          </div>

          <div className="px-10 py-8 space-y-8">
            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-200">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Event schedule
              </p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-2">
                {EVENT_DETAILS.date}
              </h3>
              <p className="text-slate-600">{EVENT_DETAILS.gateOpen}</p>
              <p className="text-slate-600 mt-2">{EVENT_DETAILS.venue}</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <QRCodeCanvas
                value={qrValue}
                size={240}
                includeMargin
                bgColor="#ffffff"
                fgColor="#111827"
              />
              <p className="text-sm text-slate-500">
                Show this QR code at the gate for verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-6 py-3 font-semibold hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4" />
            Download / Print PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestPass;
