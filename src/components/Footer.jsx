
export default function Footer() {
  return (
    <footer className="relative bg-[#080808] overflow-hidden">
      {/* Subtle top divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#DC143C]/60 to-transparent" />

      <div className="container min-h-[85px] flex items-center justify-center py-6">
        <p className="text-gray-400 text-sm sm:text-base text-center">
          This project is developed by{" "}
          <span className="text-[#DC143C] font-bold">
            CyberWebX.
          </span>
        </p>
      </div>
    </footer>
  );
}
