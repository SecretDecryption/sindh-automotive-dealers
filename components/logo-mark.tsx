import Image from "next/image";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md bg-white px-2 py-1 shadow-sm ${className}`}>
      <Image
        src="/sindh-logo.png"
        alt="Sindh Automotive Dealer logo"
        width={1033}
        height={421}
        className="h-full w-full object-contain"
        priority
      />
    </span>
  );
}
