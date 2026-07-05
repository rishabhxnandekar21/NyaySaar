import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      await loginUser({
        email,
        password,
      });

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.detail || "Login failed. Please try again.");
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
          AI-Powered
          <br />
          Legal Intelligence
        </h2>

        <p className="text-zinc-300 text-lg leading-8 max-w-md">
          Upload court judgments, generate AI summaries and interact with legal
          documents through conversational AI.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-zinc-200 p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-zinc-900">Welcome Back</h2>

            <p className="text-zinc-500 mt-2">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}

            <div>
              <label className="text-sm font-medium text-zinc-700">Email</label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-300 outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="text-sm font-medium text-zinc-700">
                Password
              </label>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-zinc-300 outline-none focus:ring-2 focus:ring-black"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-zinc-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-zinc-800 transition"
            >
              {isSubmitting ? "Signing In..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-black hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
