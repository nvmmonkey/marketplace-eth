export default function Button({
  children,
  className = "text-white bg-indigo-600 hover:text-indigo-700",
  ...rest
}) {
  return (
    <span
      {...rest}
      className={`px-8 py-3 border rounded-md text-base font-medium mr-8 ${className}`}
    >
      {children}
    </span>
  );
}
