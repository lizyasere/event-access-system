import React from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { getZoneColorClass } from "../../utils/seating";

interface SeatingSuggestionProps {
  zone: string;
  guestType: string;
}

export const SeatingSuggestion: React.FC<SeatingSuggestionProps> = ({
  zone,
  guestType,
}) => {
  const getDirections = (zone: string): string[] => {
    if (zone.includes("VIP")) {
      return [
        "Proceed to the front entrance",
        "Protocol will escort you to VIP section",
        "Reserved seating at the front rows",
      ];
    }
    if (zone.includes("Protocol")) {
      return [
        "Enter through side entrance",
        "Protocol section is to the left",
        "You'll be seated near VIP area for assistance",
      ];
    }
    if (zone.includes("Associate")) {
      return [
        "Enter through main entrance",
        "Associate seating is in the center section",
        "Follow the orange directional signs",
      ];
    }
    return [
      "Please approach the protocol desk",
      "An usher will direct you to your seat",
    ];
  };

  const directions = getDirections(zone);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-orange-100 rounded-full p-3">
          <MapPin className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Seating Direction</h3>
          <p className="text-sm text-gray-600">{guestType}</p>
        </div>
      </div>

      <div className={`border-2 rounded-lg p-4 mb-4 ${getZoneColorClass(zone)}`}>
        <p className="text-center text-xl font-black">{zone}</p>
      </div>

      <div className="space-y-3">
        {directions.map((direction, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </div>
            </div>
            <p className="text-gray-700 text-sm">{direction}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg transition">
          Proceed to Seating
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
