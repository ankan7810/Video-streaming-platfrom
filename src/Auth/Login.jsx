import React, { useState } from "react";

const Login = ({
  switchToSignup,
  switchToForgot,
  closeModal,
  setIsAuthenticated, // 🔥 important
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsAuthenticated(true);
      

      if (!response.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      console.log("Login successful:", data);

      // 🔥 Update global auth state
      setIsAuthenticated(true);

      setLoading(false);
      closeModal();
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative">
      <button
        onClick={closeModal}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-black mb-6 text-center">
        Login to Your Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-right text-sm mt-3">
        <span
          onClick={switchToForgot}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Forgot Password?
        </span>
      </p>

      <p className="text-center text-sm mt-6">
        Don't have an account?{" "}
        <span
          onClick={switchToSignup}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
