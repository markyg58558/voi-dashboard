// components/Logo.tsx
import Image from "next/image";
import Link from "next/link";

export default function Logo({
  size = 32,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 select-none">
      {/* If you saved a PNG instead, change the src to "/voi-logo.png" */}
      <Image
        src="/voi-logo.png"
        alt="Victims of Ink"
        width={size}
        height={size}
        className="h-8 w-auto"
        onError={(e) => {
          // simple fallback: a black circle with V
          const el = e.currentTarget;
          el.style.display = "none";
          const fallback = document.getElementById("voi-fallback");
          if (fallback) fallback.style.display = "grid";
        }}
      />
      <span
        id="voi-fallback"
        style={{ display: "none" }}
        className="h-8 w-8 rounded-full bg-black text-white grid place-items-center text-xs font-bold"
      >
        V
      </span>

      {showText && <span className="font-semibold uppercase tracking-wide">Victims of Ink</span>}
    </Link>
  );
}
