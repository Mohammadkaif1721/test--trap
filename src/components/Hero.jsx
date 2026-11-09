
import {
  ArrowRight,
} from "lucide-react";

import CyberScene from "./CyberScene";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#080808] pt-[110px] sm:pt-[120px] pb-10 sm:pb-16"
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute top-20 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] bg-[#DC143C]/10 blur-[100px] sm:blur-[130px] lg:blur-[160px] rounded-full pointer-events-none" />

      <div className="hero-container relative z-10 grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] items-center gap-8 sm:gap-10 lg:gap-5 xl:gap-7">

        {/* LEFT CONTENT */}
        <div className="relative z-10 max-w-[650px] w-full mx-auto lg:mx-0 text-center lg:text-left">

          {/* LABEL */}
          <div className="inline-flex items-center gap-2 border border-[#DC143C]/50 bg-[#DC143C]/5 rounded-full px-3 sm:px-4 py-2 mb-5 sm:mb-7">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#DC143C] animate-pulse shrink-0" />

            <span className="text-[#FF526E] text-[10px] xs:text-xs sm:text-sm font-bold tracking-wide">
              
            </span>
          </div>

          {/* MAIN HEADING */}
          <h1 className="text-[clamp(2.5rem,9vw,3.5rem)] sm:text-[clamp(3rem,6vw,4.5rem)] lg:text-[clamp(3.4rem,5.3vw,5.7rem)] font-extrabold leading-[1.02] sm:leading-[0.99] tracking-[-0.055em]">
            Your Digital
            <br />
            Safety.
            <br />
            <span className="text-[#DC143C]">
              Our Priority.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-7 sm:leading-[1.75] max-w-[590px] mt-5 sm:mt-6 mx-auto lg:mx-0">
            Identify suspicious URLs, detect scam messages,
            and discover source-code vulnerabilities with
            Test Trap — your unified cybersecurity analysis platform.
          </p>

          {/* ACTION BUTTON */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-5 mt-6 sm:mt-7">
            <a
              href="#features"
              className="hero-primary-btn inline-flex items-center justify-center gap-3"
            >
              Explore Features
              <ArrowRight size={20} />
            </a>
          </div>
        </div>

        {/* RIGHT SIDE: 3D CYBERSECURITY MODEL */}
        <div className="relative w-full min-w-0 overflow-visible flex items-center justify-center mt-2 sm:mt-0">
          <CyberScene />
        </div>

      </div>
    </section>
  );
}
