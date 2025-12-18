import React from "react";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Car,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import type { GuestData } from "../../types";
import { getZoneColorClass } from "../../utils/seating";

interface GuestDetailsProps {
  guest: GuestData;
  day: string;
}

export const GuestDetails: React.FC<GuestDetailsProps> = ({ guest, day }) => {
  const getGuestTypeDisplay = (type: string) => {
    switch (type) {
      case "VIP":
        return { label: "VIP Guest", color: "bg-purple-100 text-purple-800" };
      case "SPOUSE":
        return { label: "VIP Spouse", color: "bg-purple-100 text-purple-800" };
      case "PA":
        return {
          label: "Personal Assistant",
          color: "bg-blue-100 text-blue-800",
        };
      case "ASSOCIATE":
        return { label: "Associate", color: "bg-green-100 text-green-800" };
      default:
        return { label: type, color: "bg-gray-100 text-gray-800" };
    }
  };

  const typeDisplay = getGuestTypeDisplay(guest.type);
  const hasCheckedInToday = guest.checkIns.some((ci) => ci.day === day);

  return (
    <div className="p-8">
      {/* Guest Type Badge */}
      <div className="flex items-center justify-center mb-8">
        <span
          className={`px-6 py-3 rounded-full text-base font-bold shadow-md ${typeDisplay.color}`}
        >
          {typeDisplay.label}
        </span>
      </div>

      {/* Guest Name */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          {guest.fullName}
        </h2>
        <p className="text-gray-500 text-sm font-medium">ID: {guest.id}</p>
      </div>

      {/* Seating Zone - Prominent */}
      <div
        className={`border-3 rounded-2xl p-6 mb-8 shadow-lg ${getZoneColorClass(
          guest.zone
        )}`}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <MapPin className="w-7 h-7" />
          <span className="text-xl font-bold">Seating Assignment</span>
        </div>
        <p className="text-center text-3xl font-black">{guest.zone}</p>
      </div>

      {/* Guest Information Grid */}
      <div className="space-y-4 mb-8">
        {guest.phone && (
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
            <div className="p-2 rounded-lg bg-orange-100">
              <Phone className="w-5 h-5 text-orange-600 flex-shrink-0" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm font-bold text-gray-900">{guest.phone}</p>
            </div>
          </div>
        )}

        {guest.email && (
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
            <div className="p-2 rounded-lg bg-orange-100">
              <Mail className="w-5 h-5 text-orange-600 flex-shrink-0" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
              <p className="text-sm font-bold text-gray-900">{guest.email}</p>
            </div>
          </div>
        )}

        {guest.churchName && (
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
            <div className="p-2 rounded-lg bg-orange-100">
              <Building2 className="w-5 h-5 text-orange-600 flex-shrink-0" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Church</p>
              <p className="text-sm font-bold text-gray-900">
                {guest.churchName}
              </p>
            </div>
          </div>
        )}

        {guest.position && (
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
            <div className="p-2 rounded-lg bg-orange-100">
              <Briefcase className="w-5 h-5 text-orange-600 flex-shrink-0" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Position</p>
              <p className="text-sm font-bold text-gray-900">
                {guest.position}
              </p>
            </div>
          </div>
        )}

        {guest.withCar && (
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <div className="p-2 rounded-lg bg-blue-100">
              <Car className="w-5 h-5 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-sm font-bold text-blue-900">
              Guest arrived with vehicle
            </p>
          </div>
        )}
      </div>

      {/* Check-In History */}
      {guest.checkIns.length > 0 && (
        <div className="border-t-2 border-gray-200 pt-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Check-In History
          </h3>
          <div className="space-y-3">
            {guest.checkIns.map((checkIn, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200"
              >
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    {checkIn.day}
                  </p>
                  <p className="text-xs font-medium text-gray-600">
                    {new Date(checkIn.timestamp).toLocaleString()}
                    {checkIn.scannerName && ` • By ${checkIn.scannerName}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Day Status */}
      {hasCheckedInToday && (
        <div className="mt-6 bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
          <p className="text-base text-amber-900 text-center font-bold">
            ⚠️ Already checked in for {day}
          </p>
        </div>
      )}
    </div>
  );
};
