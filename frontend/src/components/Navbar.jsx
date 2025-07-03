import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const linkClass = (path) =>
    `px-4 py-2 rounded-md transition ${
      location.pathname === path
        ? "bg-blue-600 text-white font-semibold"
        : "text-gray-800 hover:bg-blue-100"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="w-full px-4 flex justify-between items-center h-14">
        <div className="flex items-center gap-4">
          {role && (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              {(role === "admin" || role === "logistics_officer") && (
                <>
                  <Link to="/purchases" className={linkClass("/purchases")}>
                    Purchases
                  </Link>
                  <Link to="/transfer" className={linkClass("/transfer")}>
                    Transfers
                  </Link>
                </>
              )}
              {(role === "admin" || role === "base_commander") && (
                <Link to="/assignments" className={linkClass("/assignments")}>
                  Assignments
                </Link>
              )}
            </>
          )}
        </div>

        {role && (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
