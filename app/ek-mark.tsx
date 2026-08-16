// The EK brand mark (source SVGs in /assets). Letters are cut out of the
// plate via evenodd, so the page background shows through them. Fill follows
// currentColor — tint with a text-* class.
export default function EkMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 150"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M34 0 H150 V116 L116 150 H0 V34 Z M22 50 H35 V100 H22 Z M35 50 H66 V62 H35 Z M35 69 H58 V81 H35 Z M35 88 H66 V100 H35 Z M91 50 H104 V100 H91 Z M104 75 L129 50 H115 L104 61 Z M104 75 L129 100 H115 L104 89 Z"
      />
    </svg>
  );
}
