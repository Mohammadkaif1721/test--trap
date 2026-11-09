
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
    <div className="relative w-full max-w-[540px] mx-auto min-h-[380px] sm:min-h-[460px] md:min-h-[500px] lg:min-h-[540px] flex items-center justify-center">

      {/* Background glow */}
      <div className="absolute inset-10 bg-[#DC143C]/20 blur-[80px] sm:blur-[110px] rounded-full" />

      {/* Orbit rings */}
      <div className="absolute w-[220px] h-[220px] xs:w-[260px] xs:h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[440px] lg:h-[440px] border border-[#DC143C]/20 rounded-full" />

      <div className="absolute w-[270px] h-[270px] xs:w-[310px] xs:h-[310px] sm:w-[400px] sm:h-[400px] lg:w-[510px] lg:h-[510px] border border-[#DC143C]/15 rounded-full animate-[spin_35s_linear_infinite]" />

      <div className="absolute w-[190px] h-[190px] xs:w-[220px] xs:h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[370px] lg:h-[370px] border border-[#FF1744]/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" />

      {/* Orbit light */}
      <div className="absolute top-[22%] left-[8%] w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FF526E] shadow-[0_0_20px_#DC143C]" />

      <div className="absolute bottom-[22%] right-[8%] w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FF526E] shadow-[0_0_20px_#DC143C]" />

      {/* Main document */}
      <div className="relative z-10 w-[235px] xs:w-[260px] sm:w-[340px] md:w-[360px] rounded-xl sm:rounded-2xl border border-[#FF526E]/70 bg-gradient-to-br from-[#32101B] via-[#10090D] to-black p-4 xs:p-5 sm:p-6 md:p-7 shadow-[0_0_45px_rgba(220,20,60,0.25)] sm:shadow-[0_0_65px_rgba(220,20,60,0.25)] -rotate-3 hover:rotate-0 transition-transform duration-700">

        {/* Document heading */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p className="text-white/60 text-lg sm:text-xl font-bold">
              Test Trap
            </p>

            <p className="text-white text-xs sm:text-sm font-semibold mt-2">
              Project Documentation
            </p>
          </div>

          <div className="shrink-0 bg-[#DC143C] text-white font-extrabold text-base sm:text-xl px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-[0_0_25px_rgba(220,20,60,0.5)]">
            PDF
          </div>
        </div>

        <div className="h-px bg-[#DC143C]/40 my-4 sm:my-6" />

        {/* Document contents */}
        <div className="space-y-3 sm:space-y-5">
          {documentItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-2 sm:gap-3"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-[#DC143C]/15 flex items-center justify-center">
                  <Icon
                    size={16}
                    className="text-[#FF526E] sm:w-[19px] sm:h-[19px]"
                  />
                </div>

                <span className="text-gray-300 text-xs sm:text-sm">
                  {item.label}
                </span>

                <div className="ml-auto w-8 sm:w-14 h-1 shrink-0 rounded-full bg-white/10">
                  <div className="w-1/2 h-full bg-[#DC143C] rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Document footer */}
        <div className="mt-5 sm:mt-7 pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-gray-500 tracking-wider">
            TEST TRAP
          </span>

          <Shield size={18} className="text-[#DC143C] sm:w-[21px] sm:h-[21px]" />
        </div>
      </div>

      {/* Floating security shield */}
      <div className="absolute bottom-[3%] right-[0%] sm:bottom-[5%] sm:right-[3%] z-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl border border-[#FF526E] bg-gradient-to-br from-[#3B101C] to-black flex items-center justify-center shadow-[0_0_30px_rgba(220,20,60,0.4)] sm:shadow-[0_0_40px_rgba(220,20,60,0.4)] animate-[float_4s_ease-in-out_infinite]">
        <LockKeyhole
          size={30}
          className="text-[#FF526E] sm:w-10 sm:h-10 lg:w-12 lg:h-12"
        />
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative isolate min-h-0 lg:min-h-[720px] py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 pb-24 sm:pb-28 lg:pb-36 bg-[#080808] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-[#DC143C]/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />

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

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 sm:gap-12 xl:gap-16">

          {/* LEFT CONTENT */}
          <div className="relative z-10 min-w-0">

            <div className="inline-flex items-center gap-2 sm:gap-3 border border-[#DC143C]/40 bg-[#DC143C]/5 rounded-full px-3 sm:px-5 py-2 sm:py-3 mb-6 sm:mb-8">
              <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#DC143C] shadow-[0_0_12px_#DC143C]" />

              <span className="text-[#FF526E] text-xs sm:text-sm font-bold tracking-wider">
                ABOUT TEST TRAP
              </span>
            </div>

            <h2 className="text-3xl xs:text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight">
              Know More About

              <span className="block text-[#DC143C] mt-1">
                Test Trap.
              </span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-7 sm:leading-8 mt-6 sm:mt-8 max-w-xl">
              Test Trap is a unified cybersecurity platform designed
              to identify suspicious URLs, detect scam messages,
              scan source-code vulnerabilities and share security
              warnings.
            </p>

            <p className="text-gray-400 text-sm sm:text-base leading-7 sm:leading-8 mt-4 sm:mt-5 max-w-xl">
              Explore the project documentation to understand its
              objectives, features, technologies, system architecture
              and future development plans.
            </p>

            {/* PDF BUTTON */}
            <a
              href="/Test_Trap_Project_Documentation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex max-w-full items-center mt-7 sm:mt-9 rounded-xl overflow-hidden bg-gradient-to-r from-[#F20D3D] to-[#C5002D] text-white font-bold shadow-[0_0_30px_rgba(220,20,60,0.25)] hover:shadow-[0_0_45px_rgba(220,20,60,0.5)] hover:-translate-y-1 transition-all duration-300"
            >
              <span className="flex items-center gap-2 sm:gap-4 px-3 xs:px-4 sm:px-8 py-4 sm:py-5">
                <FileText size={22} className="shrink-0 sm:w-[29px] sm:h-[29px]" />

                <span className="text-sm sm:text-lg whitespace-nowrap">
                  View More Info
                </span>
              </span>

              <span className="self-stretch w-10 sm:w-16 border-l border-white/20 flex items-center justify-center group-hover:bg-white/10 transition">
                <ArrowUpRight size={20} className="sm:w-[27px] sm:h-[27px]" />
              </span>
            </a>

            <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-5">
              Click the button to explore the complete Test Trap project PDF.
            </p>
          </div>

          {/* RIGHT DOCUMENT VISUAL */}
          <div className="relative min-w-0 w-full mt-2 sm:mt-0">
            <ProjectDocument />
          </div>
        </div>
      </div>

      {/* Bottom separation from footer */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#DC143C]/40 to-transparent" />
    </section>
  );
}
