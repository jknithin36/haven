import type { ComponentProps } from "react";

// The Haven mark, drawn in currentColor so it matches the surrounding text.
function LogoMark(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      {...props}
    >
      <path d="M32 6.5 L53 20.5 L53 43.5 L47.5 48 L47.5 36.5 L32 28.5 L16.5 36.5 L16.5 48 L11 43.5 L11 20.5 Z" />
      <path d="M32 36 L40 41.5 L40 52.5 L32 57 L24 52.5 L24 41.5 Z" />
    </svg>
  );
}

export default LogoMark;
