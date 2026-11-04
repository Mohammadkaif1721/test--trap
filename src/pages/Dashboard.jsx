
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Code,
  Globe,
  MessageSquare,
  Bell,
  LogOut,
  ChevronDown,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  Search,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import CyberShield3D from "../components/CyberShield3D";
import "./Dashboard.css";

const tools = [
  {
    number: "01",
    title: "Code Scanner",
    description:
      "Identify insecure coding patterns and exposed secrets in source code.",
    icon: Code,
    path: "/code-scanner",
  },
  {
    number: "02",
    title: "URL Scanner",
    description:
      "Analyze URLs and identify suspicious links and phishing indicators.",
    icon: Globe,
    path: "/url-scanner",
  },
  {
    number: "03",
    title: "Message Checker",
    description:
      "Detect scam language and suspicious patterns in messages.",
    icon: MessageSquare,
    path: "/message-checker",
  },
  {
    number: "04",
    title: "Cyber Alert",
    description:
      "Create and share reports about suspicious activity and threats.",
    icon: Bell,
    path: "/cyber-alert",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const profileRef = useRef(null);

  const [loggingOut, setLoggingOut] = useState(false);
  const [userName, setUserName] = useState("Security User");
  const [loadingUser, setLoadingUser] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  // LOAD CURRENT SUPABASE USER
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;
        if (!user || !mounted) return;

        const metadata = user.user_metadata || {};

        const fullName =
          metadata.full_name ||
          metadata.name ||
          metadata.display_name ||
          metadata.user_name ||
          metadata.preferred_username ||
          user.email?.split("@")[0] ||
          "Security User";

        if (mounted) {
          setUserName(fullName);
        }
      } catch (error) {
        console.error("Failed to load user:", error.message);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // LOGOUT
  async function handleLogout() {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error.message);
      setLoggingOut(false);
    }
  }

  // SCROLL TO TOOLS
  function scrollToTools() {
    document.getElementById("security-tools")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // USER INITIAL
  const initial =
    userName?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="dashboard-layout dashboard-no-sidebar">
      <main className="dashboard-main">
        {/* TOPBAR */}
        <header className="dashboard-topbar">
          <div className="breadcrumb">
            <ShieldCheck size={17} />
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>Dashboard</strong>
          </div>

          {/* USER PROFILE DROPDOWN */}
          <div className="topbar-profile" ref={profileRef}>
            <button
              className={`topbar-user ${
                profileOpen ? "profile-active" : ""
              }`}
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <span className="topbar-avatar">{initial}</span>

              <span className="topbar-username">
                {loadingUser ? "Loading..." : userName}
              </span>

              <ChevronDown
                size={15}
                className={profileOpen ? "chevron-rotated" : ""}
              />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-avatar">
                    {initial}
                  </div>

                  <div className="profile-dropdown-user">
                    <strong>
                      {loadingUser ? "Loading..." : userName}
                    </strong>
                    <span>Test Trap Account</span>
                  </div>
                </div>

                <div className="profile-dropdown-divider" />

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  <ShieldCheck size={16} />
                  Dashboard
                </button>

                <div className="profile-dropdown-divider" />

                <button
                  type="button"
                  className="profile-dropdown-item logout"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut size={16} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <div className="dashboard-content">
          {/* WELCOME BANNER */}
          <section className="welcome-banner">
            <div className="welcome-content">
              <span className="welcome-label">
                YOUR SECURITY WORKSPACE
              </span>

              <h2>
                Welcome, <span>{userName}</span>
              </h2>

              <p>
                Your personal cybersecurity workspace to analyze,
                detect, and understand digital threats.
              </p>

              <button
                className="welcome-button"
                onClick={scrollToTools}
              >
                Explore Security Tools
                <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="welcome-3d">
              <CyberShield3D />
            </div>
          </section>

          {/* STATISTICS */}
          <section className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon stat-red">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h3>0</h3>
                <p>Scans Performed</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-alert">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h3>0</h3>
                <p>Threats Detected</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-purple">
                <Layers size={22} />
              </div>

              <div>
                <h3>4</h3>
                <p>Security Tools</p>
              </div>
            </div>
          </section>

          {/* SECURITY TOOLS */}
          <section className="tools-section" id="security-tools">
            <div className="section-heading">
              <h2>Security Tools</h2>
              <p>
                Choose a tool to analyze and detect potential threats.
              </p>
            </div>

            <div className="security-tools-grid">
              {tools.map((tool, index) => {
                const Icon = tool.icon;

                return (
                  <article
                    key={tool.number}
                    className={`security-tool-card tool-delay-${index + 1}`}
                    onMouseMove={(e) => {
                      const card = e.currentTarget;
                      const rect = card.getBoundingClientRect();

                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;

                      const rotateX =
                        ((y / rect.height) - 0.5) * -8;

                      const rotateY =
                        ((x / rect.width) - 0.5) * 8;

                      card.style.setProperty("--mouse-x", `${x}px`);
                      card.style.setProperty("--mouse-y", `${y}px`);
                      card.style.setProperty("--rotate-x", `${rotateX}deg`);
                      card.style.setProperty("--rotate-y", `${rotateY}deg`);
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget;

                      card.style.setProperty("--rotate-x", "0deg");
                      card.style.setProperty("--rotate-y", "0deg");
                    }}
                    onClick={() => navigate(tool.path)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(tool.path);
                      }
                    }}
                  >
                    <span className="tool-number">
                      {tool.number}
                    </span>

                    <div className="tool-card-glow" />

                    <div className="tool-icon">
                      <Icon size={25} />
                    </div>

                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>

                    <button
                      className="tool-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(tool.path);
                      }}
                    >
                      Open Tool
                      <ArrowUpRight size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* EMPTY STATE */}
          <section className="dashboard-empty-state">
            <div className="empty-state-icon">
              <Search size={25} />
            </div>

            <h3>Ready to secure your digital world?</h3>

            <p>
              Your scan results and security activities will appear
              in your activity history after you start using Test Trap.
            </p>
          </section>

          {/* FOOTER */}
          <footer className="dashboard-footer">
            This project is developed by CyberWebX.
          </footer>
        </div>
      </main>
    </div>
  );
}
