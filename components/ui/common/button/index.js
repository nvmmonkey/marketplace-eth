export default function Button({
  children,
  className,
  variant = "purple",
  hoverable = true,
  ...rest
}) {
  const variants = {
    white: `text-black bg-white `,
    purple: `text-white bg-indigo-600 ${hoverable && "hover:text-indigo-700"}`,
    red: `text-white bg-red-600 ${hoverable && "hover:text-red-700"}`,
    lightPurple: `text-indigo-700 bg-indigo-100 ${hoverable && "hover:text-indigo-200"}`,
  };

  return (
    <button
      {...rest}
      className={`disabled:opacity-50 disabled:cursor-not-allowed p-2 xs:px-8 xs:py-3 border rounded-md text-base font-medium mr-8 ${className} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
