import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Login = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!role) {
      alert("Please select a role.");
      return;
    }

    localStorage.setItem("userRole", role);
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="p-6 w-[350px] space-y-4">
        <h2 className="text-xl font-bold text-center">Select Role</h2>
        <div>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 bg-white text-black mb-3"
          >
            <option value="">-- Select Role --</option>
            <option value="admin">Admin: Full access</option>
            <option value="base_commander">Base Commander: Base access</option>
            <option value="logistics_officer">Logistics Officer: Purchases & Transfers</option>
          </select>
        </div>
        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </Card>
    </div>
  );
};

export default Login;
