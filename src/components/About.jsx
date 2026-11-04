
import {
  FileText,
  ArrowUpRight,
  Shield,
  Code2,
  Network,
  Settings,
  BarChart3,
  LockKeyhole,
} from "lucide-react";

const documentItems = [
  { icon: FileText, label: "Introduction" },
  { icon: Code2, label: "Features" },
  { icon: Network, label: "System Architecture" },
  { icon: Settings, label: "Technologies Used" },
  { icon: BarChart3, label: "Future Scope" },
];

function ProjectDocument() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto min-h-[520px] flex items-center justify-center">

      {/* Background glow */}
      <div className="absolute inset-10 bg-[#DC143C]/20 blur-[110px] rounded-full" />

      {/* Orbit rings */}
      <div className="absolute w-[330px] h-[330px] sm:w-[440px] sm:h-[440px] border border-[#DC143C]/20 rounded-full" />

      <div className="absolute w-[390px] h-[390px] sm:w-[510px] sm:h-[510px] border border-[#DC143C]/15 rounded-full animate-[spin_35s_linear_infinite]" />

      <div className="absolute w-[280px] h-[280px] sm:w-[370px] sm:h-[370px] border border-[#FF1744]/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" />

      {/* Orbit light */}
      <div className="absolute top-[22%] left-[8%] w-3 h-3 rounded-full bg-[#FF526E] shadow-[0_0_20px_#DC143C]" />

      <div className="absolute bottom-[22%] right-[8%] w-3 h-3 rounded-full bg-[#FF526E] shadow-[0_0_20px_#DC143C]" />

      {/* Main document */}
      <div className="relative z-10 w-[280px] sm:w-[360px] rounded-2xl border border-[#FF526E]/70 bg-gradient-to-br from-[#32101B] via-[#10090D] to-black p-6 sm:p-7 shadow-[0_0_65px_rgba(220,20,60,0.25)] -rotate-3 hover:rotate-0 transition-transform duration-700">

        {/* Document heading */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-xl font-bold">
              Test Trap
            </p>

            <p className="text-white text-sm font-semibold mt-2">
              Project Documentation
            </p>
          </div>

          <div className="bg-[#DC143C] text-white font-extrabold text-xl px-4 py-3 rounded-lg shadow-[0_0_25px_rgba(220,20,60,0.5)]">
            PDF
          </div>
        </div>

        <div className="h-px bg-[#DC143C]/40 my-6" />

        {/* Document contents */}
        <div className="space-y-5">
          {documentItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 shrink-0 rounded-lg bg-[#DC143C]/15 flex items-center justify-center">
                  <Icon
                    size={19}
                    className="text-[#FF526E]"
                  />
                </div>

                <span className="text-gray-300 text-sm">
                  {item.label}
                </span>

                <div className="ml-auto w-14 h-1 rounded-full bg-white/10">
                  <div className="w-1/2 h-full bg-[#DC143C] rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Document footer */}
        <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-500 tracking-wider">
            TEST TRAP
          </span>

          <Shield size={21} className="text-[#DC143C]" />
        </div>
      </div>

      {/* Floating security shield */}
      <div className="absolute bottom-[5%] right-[1%] sm:right-[3%] z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-[#FF526E] bg-gradient-to-br from-[#3B101C] to-black flex items-center justify-center shadow-[0_0_40px_rgba(220,20,60,0.4)] animate-[float_4s_ease-in-out_infinite]">
        <LockKeyhole
          size={48}
          className="text-[#FF526E]"
        />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative isolate min-h-[720px] py-24 md:py-28 lg:py-32 pb-36 bg-[#080808] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DC143C]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(220,20,60,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(220,20,60,.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 xl:gap-16">

          {/* LEFT CONTENT */}
          <div className="relative z-10">

            <div className="inline-flex items-center gap-3 border border-[#DC143C]/40 bg-[#DC143C]/5 rounded-full px-5 py-3 mb-8">
              <span className="w-3 h-3 rounded-full bg-[#DC143C] shadow-[0_0_12px_#DC143C]" />

              <span className="text-[#FF526E] text-sm font-bold tracking-wider">
                ABOUT TEST TRAP
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight">
              Know More About

              <span className="block text-[#DC143C] mt-1">
                Test Trap.
              </span>
            </h2>

            <p className="text-gray-300 text-base md:text-lg leading-8 mt-8 max-w-xl">
              Test Trap is a unified cybersecurity platform designed
              to identify suspicious URLs, detect scam messages,
              scan source-code vulnerabilities and share security
              warnings.
            </p>

            <p className="text-gray-400 text-sm md:text-base leading-8 mt-5 max-w-xl">
              Explore the project documentation to understand its
              objectives, features, technologies, system architecture
              and future development plans.
            </p>

            {/* PDF BUTTON */}
            <a
              href="/Test_Trap_Project_Documentation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center mt-9 rounded-xl overflow-hidden bg-gradient-to-r from-[#F20D3D] to-[#C5002D] text-white font-bold shadow-[0_0_30px_rgba(220,20,60,0.25)] hover:shadow-[0_0_45px_rgba(220,20,60,0.5)] hover:-translate-y-1 transition-all duration-300"
            >
              <span className="flex items-center gap-4 px-6 sm:px-8 py-5">
                <FileText size={29} />

                <span className="text-base sm:text-lg whitespace-nowrap">
                  View More Info
                </span>
              </span>

              <span className="self-stretch w-16 border-l border-white/20 flex items-center justify-center group-hover:bg-white/10 transition">
                <ArrowUpRight size={27} />
              </span>
            </a>

            <p className="text-gray-500 text-sm mt-5">
              Click the button to explore the complete Test Trap project PDF.
            </p>
          </div>

          {/* RIGHT DOCUMENT VISUAL */}
          <div className="relative min-w-0">
            <ProjectDocument />
          </div>
        </div>
      </div>

      {/* Bottom separation from footer */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#DC143C]/40 to-transparent" />
    </section>
  );
}
