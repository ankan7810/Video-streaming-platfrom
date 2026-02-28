import React, { useState } from "react";

const Signup = ({ switchToLogin, closeModal }) => {

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Invalid email address";
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        errorMsg = "Password must be at least 6 characters";
      }
    }

    if (name === "name") {
      if (value.trim().length < 3) {
        errorMsg = "Name must be at least 3 characters";
      }
    }

    if (name === "username") {
      if (value.trim().length < 3) {
        errorMsg = "Username must be at least 3 characters";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err)) {
      alert("Fix errors before submitting");
      return;
    }

    if (!profileImage) {
      alert("Profile image is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("username", formData.username);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("profileimage", profileImage);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          credentials: "include",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        setLoading(false);
        return;
      }

      console.log("Signup success:", result);

      setLoading(false);
      switchToLogin();

    } catch (error) {
      console.error("Signup error:", error);
      setLoading(false);
    }
  };

  const inputStyle = (field) =>
    `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition
     ${
       errors[field]
         ? "border-red-500 focus:ring-red-500"
         : "border-gray-300 focus:ring-blue-500"
     }`;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative">

      <button
        onClick={closeModal}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-black mb-6 text-center">
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={inputStyle("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={inputStyle("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={inputStyle("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={inputStyle("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

      </form>

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
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

export default Signup;