import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";

// Dashboard icons: always stroke 1.5, 18px (16 in tables), decorative.
function Icon({
  icon,
  size = 18,
  className,
}: {
  icon: HugeiconsIconProps["icon"];
  size?: 16 | 18;
  className?: string;
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={1.5}
      aria-hidden="true"
      className={className}
    />
  );
}

export default Icon;
