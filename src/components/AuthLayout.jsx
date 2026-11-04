import { ShieldCheck, LockKeyhole, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <div className="auth-shell">

        <Link to="/" className="auth-back">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="auth-grid">

          <div className="auth-brand">
            <div className="auth-brand-visual">
              <div className="auth-brand-ring" />
              <div className="auth-brand-ring-inner" />

              <div className="auth-brand-logo">
                <ShieldCheck
                  size={100}
                  strokeWidth={1.3}
                  className="text-[#FF526E]"
                />
              </div>

              <div className="auth-brand-lock">
                <LockKeyhole size={30} className="text-[#FF526E]" />
              </div>
            </div>

            <h1 className="auth-brand-title">
              TEST <span>TRAP</span>
            </h1>

            <p className="auth-brand-description">
              Detect suspicious links, identify scam messages
              and understand source-code vulnerabilities — all in one place.
            </p>

            <p className="auth-brand-caption">
              DETECT&nbsp; • &nbsp;ANALYZE&nbsp; • &nbsp;STAY SAFE
            </p>
          </div>

          <div className="auth-form-area">
            {children}
          </div>

        </div>
      </div>
    </main>
  );
}