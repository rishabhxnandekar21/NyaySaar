import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { signupUser } = useAuth();

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signupUser({
        name,
        email,
        password,
      });

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          error.message ||
          "Unable to create account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-black text-white flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-8">
          <Scale className="w-10 h-10 text-emerald-400" />
          <h1 className="text-4xl font-bold">Nyay Saar</h1>
        </div>

        <h2 className="text-5xl font-bold leading-tight mb-6">
          Create Your
          <br />
          Account
        </h2>

        <p className="text-zinc-300 text-lg leading-8 max-w-md">
          Join Nyay Saar and simplify legal document analysis using AI-powered
          summaries and conversational assistance.
        </p>
      </div>

      {/* Right Section */}

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-zinc-200 p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Create Account</h2>

            <p className="text-zinc-500 mt-2">Start your legal AI journey.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}

            <div>
              <label className="text-sm font-medium">Full Name</label>

              <div className="relative mt-2">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-black outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="text-sm font-medium">Email</label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-black outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="text-sm font-medium">Password</label>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-black outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-zinc-500"
                ></button>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="text-sm font-medium">Confirm Password</label>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-black outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3 text-zinc-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-zinc-800 transition disabled:opacity-60"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
