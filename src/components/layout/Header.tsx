import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../src/assets/logo.png";

export const Header: React.FC = () => {
  return (
    <header className="">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-row justify-between">
          <Link
            to="/"
            className="flex flex-row justify-between items-center  gap-4 group"
          >
            <div className="bg-black rounded-full transition-all">
              <img
                src={logo}
                alt="30th Anniversary Logo"
                className="object-cover w-24 h-24 transition-transform group-hover:scale-110"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-orange-500">
                Truth of Calvary Ministries
              </h2>
              <p className="text-base font-medium text-orange-500">
                30 Years Anniversary Celebration
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
