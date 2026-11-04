
import { useState } from "react";
import { Shield, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    ["Home", "#home"],
    ["Features", "#features"],
    ["About", "#about"],
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#080808]/95 backdrop-blur-xl border-b border-white/10">
      <nav className="nav-container h-[92px] flex items-center justify-between">

        {/* LOGO */}
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[#DC143C] flex items-center justify-center shadow-lg shadow-[#DC143C]/20">
            <Shield size={27} strokeWidth={2} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight">
            TEST <span className="text-[#DC143C]">TRAP</span>
          </span>
        </a>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-11">
          {links.map(([name, href], index) => (
            <a
              key={name}
              href={href}
              className={`nav-link ${
                index === 0 ? "active" : ""
              }`}
            >
              {name}
            </a>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="/login" className="login-link">
            Login
          </a>

          <a href="/signup" className="get-started-btn">
            Get Started
            <ArrowUpRight size={19} />
          </a>
        </div>

        {/* MOBILE MENU */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-[#111111] border-t border-white/10 p-6 flex flex-col gap-6">
          {links.map(([name, href]) => (
            <a
              key={name}
              href={href}
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-[#DC143C] transition"
            >
              {name}
            </a>
          ))}

          <a
            href="#login"
            onClick={() => setOpen(false)}
            className="get-started-btn justify-center"
          >
            Get Started
            <ArrowUpRight size={18} />
          </a>
        </div>
      )}
    </header>
  );
}
