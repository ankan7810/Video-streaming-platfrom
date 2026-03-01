import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {

  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const token = searchParams.get("token");

  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {

    e.preventDefault();

    if (!newPassword) {
      alert("Enter new password");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Password reset successful");

      navigate("/");

    } catch (error) {

      alert("Error resetting password");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="flex justify-center items-center h-screen">

      <form
        onSubmit={handleReset}
        className="bg-white p-6 shadow-lg rounded w-96"
      >

        <h2 className="text-xl font-bold mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          className="w-full border p-2 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>

    </div>

  );

};

export default ResetPassword;