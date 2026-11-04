
import {
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Activity,
  LockKeyhole,
} from "lucide-react";

import CyberScene from "./CyberScene";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#080808] pt-[120px] pb-16"
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute top-20 right-0 w-[700px] h-[700px] bg-[#DC143C]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="hero-container relative z-10 grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] items-center gap-5 xl:gap-7">

        {/* LEFT CONTENT */}
        <div className="relative z-10 max-w-[650px]">

          {/* LABEL */}
          <div className="inline-flex items-center gap-2 border border-[#DC143C]/50 bg-[#DC143C]/5 rounded-full px-4 py-2 mb-7">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C] animate-pulse" />

            <span className="text-[#FF526E] text-sm font-bold tracking-wide">
              YOUR DIGITAL SECURITY PARTNER
            </span>
          </div>

          {/* MAIN HEADING */}
          <h1 className="text-[clamp(3.4rem,5.3vw,5.7rem)] font-extrabold leading-[0.99] tracking-[-0.055em]">
            Your Digital
            <br />
            Safety.
            <br />
            <span className="text-[#DC143C]">
              Our Priority.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-400 text-base md:text-lg leading-[1.75] max-w-[590px] mt-6">
            Identify suspicious URLs, detect scam messages,
            and discover source-code vulnerabilities with
            Test Trap — your unified cybersecurity analysis platform.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-5 mt-7">

            <a href="#features" className="hero-primary-btn">
              Explore Features
              <ArrowRight size={20} />
            </a>

           

          </div>

          {/* TRUST POINTS */}
          
        </div>

        {/* RIGHT SIDE: 3D CYBERSECURITY MODEL */}
        <div className="relative w-full min-w-0 overflow-visible">
          <CyberScene />
        </div>

      </div>
    </section>
  );
}
