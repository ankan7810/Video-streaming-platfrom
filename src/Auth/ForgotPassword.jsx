import React, { useState } from "react";

const ForgotPassword = ({ switchToLogin, closeModal }) => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Reset link sent to your email");

      closeModal();

    } catch (error) {

      alert("Error sending reset link");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px]">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          className="w-full border p-2 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

      </form>

    </div>
  );

};

export default ForgotPassword;