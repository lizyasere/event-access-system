import React from "react";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 text-sm">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for the
            30th Anniversary Celebration
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} Event Access System
          </p>
        </div>
      </div>
    </footer>
  );
};
