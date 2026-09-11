import { useId } from "react";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const sizes: Record<LogoSize, { box: number; text: string; gap: string }> = {
  sm: { box: 28, text: "text-lg", gap: "gap-2" },
  md: { box: 36, text: "text-xl", gap: "gap-2.5" },
  lg: { box: 48, text: "text-3xl", gap: "gap-3" },
};

interface LogoProps {
  size?: LogoSize;
  /** Solo el símbolo, sin el nombre. */
  markOnly?: boolean;
  className?: string;
}

/**
 * El wordmark va en HTML y no dentro del SVG: un SVG servido como <img> es un
 * documento aislado y no hereda las fuentes web de la página, así que el texto
 * caía a Arial en vez de Inter Tight.
 */
const Logo = ({ size = "md", markOnly = false, className }: LogoProps) => {
  const id = useId();
  const { box, text, gap } = sizes[size];

  return (
    <span className={cn("inline-flex items-center", gap, className)}>
      <svg
        width={box}
        height={box}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3B82F6" />
            <stop offset="0.55" stopColor="#2563EB" />
            <stop offset="1" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id={`${id}-sheen`} x1="6" y1="3" x2="28" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="white" stopOpacity="0.42" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id={`${id}-shadow`} x="-8" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1D4ED8" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter={`url(#${id}-shadow)`}>
          <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill={`url(#${id}-fill)`} />
          {/* Brillo superior izquierdo, recortado a la esquina redondeada. */}
          <path
            d="M1.5 13.5C1.5 6.87 6.87 1.5 13.5 1.5H28V12C28 20.008 21.508 26.5 13.5 26.5H1.5V13.5Z"
            fill={`url(#${id}-sheen)`}
          />
          <rect x="2.25" y="2.25" width="35.5" height="35.5" rx="11.25" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" />
        </g>

        {/* Cursor entre corchetes: escribir código. */}
        <path
          d="M16.4 12.6 L10.2 20 L16.4 27.4"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.6 12.6 L29.8 20 L23.6 27.4"
          stroke="white"
          strokeOpacity="0.6"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="19" y="10.4" width="2.2" height="19.2" rx="1.1" fill="white" />
      </svg>

      {!markOnly && (
        <span className={cn("font-semibold tracking-tight text-white leading-none", text)}>
          contreras<span className="text-[#60A5FA]">.dev</span>
        </span>
      )}
    </span>
  );
};

export default Logo;
