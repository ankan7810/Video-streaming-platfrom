import React, { useState } from "react";

const ForgotPassword = ({ switchToLogin, closeModal }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      alert("Reset link sent to your email 📩");

      setLoading(false);
      closeModal(); // close modal after success

    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative">

      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-black mb-6 text-center">
        Reset Your Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

      </form>

      <p className="text-center text-sm mt-6">
        Remember your password?{" "}
        <span
          onClick={switchToLogin}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>

    </div>
  );
};

export default ForgotPassword;