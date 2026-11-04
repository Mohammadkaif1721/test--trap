
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { supabase } from "../lib/supabase";
import "./Signup.css";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      if (data.user && data.user.identities?.length === 0) {
        throw new Error("An account with this email may already exist.");
      }

      setMessage(
        "Registration successful! Please check your email and verify your account before logging in."
      );
      setMessageType("success");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.message || "Registration failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="signup-card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-[#DC143C] flex items-center justify-center text-white">
            <LockKeyhole size={23} />
          </div>

          <span className="text-xl font-extrabold text-white">
            TEST <span className="text-[#DC143C]">TRAP</span>
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Create <span className="text-[#DC143C]">Account</span>
        </h2>

        <p className="text-gray-400 mt-2">
          Join Test Trap and take a step towards a safer digital world.
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-field">
            <label>Full name</label>
            <div className="signup-input-wrapper">
              <UserRound size={19} />
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="signup-field">
            <label>Email address</label>
            <div className="signup-input-wrapper">
              <Mail size={19} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="signup-field">
            <label>Password</label>
            <div className="signup-input-wrapper">
              <LockKeyhole size={19} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="signup-field">
            <label>Confirm password</label>
            <div className="signup-input-wrapper">
              <LockKeyhole size={19} />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <label className="signup-terms">
            <input type="checkbox" required />
            <span>
              I agree to the{" "}
              <Link to="/terms">Terms of Service</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </span>
          </label>

          <button
            type="submit"
            className="signup-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight size={20} />}
          </button>

          {message && (
            <p
              className={`signup-message ${
                messageType === "success" ? "success" : "error"
              }`}
              role="status"
            >
              {message}
            </p>
          )}
        </form>

        <p className="signup-login">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
