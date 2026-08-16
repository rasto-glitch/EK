import { colors } from "../theme";

// The recurring motif: a thin glowing accent line.
// `progress` 0..1 controls how much of `width` is drawn.
export const AccentLine: React.FC<{
  progress: number;
  width: number;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({ progress, width, thickness = 3, style }) => {
  return (
    <div
      style={{
        width: Math.max(0, width * progress),
        height: thickness,
        borderRadius: thickness,
        background: `linear-gradient(90deg, transparent 0%, ${colors.accent} 30%, ${colors.accent} 100%)`,
        boxShadow: `0 0 18px ${colors.accentGlow}, 0 0 44px rgba(78,157,232,0.25)`,
        ...style,
      }}
    />
  );
};
