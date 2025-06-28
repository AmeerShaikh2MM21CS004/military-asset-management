import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-md hover:bg-gray-200 transition ${
      location.pathname === path ? "bg-gray-300 font-semibold" : ""
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center space-x-6">
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
