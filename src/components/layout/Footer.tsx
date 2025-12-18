import React from "react";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-gray-300">
            Crafted with <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" /> for the
            30th Anniversary Celebration
          </p>
          <p className="text-xs text-gray-500 mt-3">
            © {new Date().getFullYear()} Event Access System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
