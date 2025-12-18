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
    <div className="p-6">
      {/* Guest Type Badge */}
      <div className="flex items-center justify-center mb-6">
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${typeDisplay.color}`}
        >
          {typeDisplay.label}
        </span>
      </div>

      {/* Guest Name */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          {guest.fullName}
        </h2>
        <p className="text-gray-500 text-sm">ID: {guest.id}</p>
      </div>

      {/* Seating Zone - Prominent */}
      <div
        className={`border-2 rounded-xl p-4 mb-6 ${getZoneColorClass(
          guest.zone
        )}`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="w-6 h-6" />
          <span className="text-lg font-bold">Seating Assignment</span>
        </div>
        <p className="text-center text-2xl font-black">{guest.zone}</p>
      </div>

      {/* Guest Information Grid */}
      <div className="space-y-3 mb-6">
        {guest.phone && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">{guest.phone}</p>
            </div>
          </div>
        )}

        {guest.email && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{guest.email}</p>
            </div>
          </div>
        )}

        {guest.churchName && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Building2 className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Church</p>
              <p className="text-sm font-medium text-gray-900">
                {guest.churchName}
              </p>
            </div>
          </div>
        )}

        {guest.position && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Position</p>
              <p className="text-sm font-medium text-gray-900">
                {guest.position}
              </p>
            </div>
          </div>
        )}

        {guest.withCar && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Car className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm font-medium text-blue-900">
              Guest arrived with vehicle
            </p>
          </div>
        )}
      </div>

      {/* Check-In History */}
      {guest.checkIns.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Check-In History
          </h3>
          <div className="space-y-2">
            {guest.checkIns.map((checkIn, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {checkIn.day}
                  </p>
                  <p className="text-xs text-gray-500">
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
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900 text-center font-medium">
            ⚠️ Already checked in for {day}
          </p>
        </div>
      )}
    </div>
  );
};
