
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { supabase } from "./lib/supabase";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RecentActivity from "./pages/RecentActivity";
import CodeScanner from "./pages/CodeScanner";
import URLScanner from "./pages/URLScanner";
import MessageChecker from "./pages/MessageChecker";
import CyberAlert from "./pages/CyberAlert";

// Home Page
function HomePage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Footer />
    </main>
  );
}

// Protect routes that require authentication
function ProtectedRoute({ session, loading, children }) {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Main App
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error("Session error:", error.message);
      }

      setSession(data?.session ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute session={session} loading={loading}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Recent Activity */}
      <Route
        path="/recent-activity"
        element={
          <ProtectedRoute session={session} loading={loading}>
            <RecentActivity />
          </ProtectedRoute>
        }
      />

      {/* Protected Code Scanner */}
      <Route
        path="/code-scanner"
        element={
          <ProtectedRoute session={session} loading={loading}>
            <CodeScanner />
          </ProtectedRoute>
        }
      />

      {/* Protected URL Scanner */}
      <Route
        path="/url-scanner"
        element={
          <ProtectedRoute session={session} loading={loading}>
            <URLScanner />
          </ProtectedRoute>
        }
      />

      {/* Protected Message Checker */}
      <Route
        path="/message-checker"
        element={
          <ProtectedRoute session={session} loading={loading}>
            <MessageChecker />
          </ProtectedRoute>
        }
      />

      {/* Protected Cyber Alert */}
      <Route
        path="/cyber-alert"
        element={
          <ProtectedRoute session={session} loading={loading}>
            <CyberAlert />
          </ProtectedRoute>
        }
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
