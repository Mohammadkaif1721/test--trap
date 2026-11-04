
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import { supabase } from "../lib/supabase";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // Email and password login
  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.message || "Login failed. Please check your credentials."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Social login using Supabase OAuth
  async function handleSocialLogin(provider) {
    setMessage("");
    setMessageType("");

    if (provider !== "Google") {
      setMessage(`${provider} sign-in is not configured yet.`);
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

    } catch (error) {
      setMessage(error.message || "Google sign-in failed.");
      setMessageType("error");
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <LockKeyhole size={22} />
          </div>

          <span>
            TEST <span className="login-crimson">TRAP</span>
          </span>
        </div>

        {/* Heading */}
        <h2 className="login-heading">
          Welcome <span>Back</span>
        </h2>

        <p className="login-description">
          Sign in to your account and continue your security journey.
        </p>

        {/* Login form */}
        <form className="login-form" onSubmit={handleSubmit}>

          <div className="login-field">
            <label htmlFor="login-email">Email address</label>

            <div className="login-input-wrapper">
              <Mail size={18} />

              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="login-eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Remember and forgot password */}
          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="login-forgot">
              Forgot password?
            </Link>
          </div>

          {/* Login message */}
          {message && (
            <p
              className={`login-message ${messageType}`}
              role="status"
            >
              {message}
            </p>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>OR CONTINUE WITH</span>
        </div>


        {/* Google login */}
        <div className="social-login">
          <button
            type="button"
            className="social-button google-login-button"
            disabled={loading}
            onClick={() => handleSocialLogin("Google")}
          >
            <span className="google-icon">G</span>
            <span>Continue with Google</span>
          </button>
        </div>


        {/* Signup link */}
        <p className="login-signup">
          Don't have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>

      </div>
    </AuthLayout>
  );
}
