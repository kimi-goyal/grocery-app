interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "social";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    variant === "primary"
      ? "btn-primary"
      : "btn-social";

  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}