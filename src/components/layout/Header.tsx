import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PartyPopper, QrCode } from "lucide-react";

export const Header: React.FC = () => {
  const location = useLocation();
  const isScanner = location.pathname.includes("/scan") || location.pathname.includes("/checkin");

  return (
    <header className="bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white hover:opacity-90 transition">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">30th Anniversary</h1>
              <p className="text-xs opacity-90">Event Access System</p>
            </div>
          </Link>

          <nav className="flex gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !isScanner
                  ? "bg-white text-orange-600"
                  : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
              }`}
            >
              Register
            </Link>
            <Link
              to="/scan"
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                isScanner
                  ? "bg-white text-orange-600"
                  : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
              }`}
            >
              <QrCode className="w-4 h-4" />
              Scan
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
