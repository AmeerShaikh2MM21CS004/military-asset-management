import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-md transition ${
      location.pathname === path
        ? "bg-blue-600 text-white font-semibold"
        : "text-gray-800 hover:bg-blue-100"
    }`;

  return (
    <nav className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="w-full px-4">
        <div className="flex h-14 items-center justify-start gap-4">
          {/* Navigation links aligned to the left */}
          <Link to="/Dashboard" className={linkClass("/Dashboard")}>
            Dashboard
          </Link>
          <Link to="/Purchases" className={linkClass("/Purchases")}>
            Purchases
          </Link>
          <Link to="/Transfer" className={linkClass("/Transfer")}>
            Transfers
          </Link>
          <Link to="/Assignments" className={linkClass("/Assignments")}>
            Assignments
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
