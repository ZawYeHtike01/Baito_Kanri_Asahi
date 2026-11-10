import Snowfall from "react-snowfall";

export default function SnowTheme() {
  return (
    <Snowfall
      snowflakeCount={100}
      color="#FFFFFF"
      radius={[0.5, 3]}
      speed={[0.5, 2]}
      wind={[-0.5, 1]}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        pointerEvents: "none",
      }}
    />
  );
}