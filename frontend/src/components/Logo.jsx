export default function Logo({ size = 32, className = "" }) {
  return (
    <img
      src="/bragr-logo.png"
      alt="Bragr"
      style={{ height: size, width: "auto" }}
      className={className}
      draggable={false}
    />
  );
}
