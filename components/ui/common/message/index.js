import { useState } from "react";

const TYPES = {
  success: "green",
  warning: "yellow",
  danger: "red",
};

//fix for TailwindCSS and PurgeCSS removing unused styles, avoid using dynamic class
const COLOR_CLASSES = {
  green: {
    bg: "bg-green-100",
    text: "text-green-900",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-900",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-900",
  },
};

const SIZES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export default function Message({ children, type = "success", size = "md" }) {
  const [isDisplayed, setIsDisplayed] = useState(true);

  if (!isDisplayed) {
    return null;
  }

  const messageType = TYPES[type];
  const colorClass = COLOR_CLASSES[messageType];
  const messageSizeClass = SIZES[size];

  return (
    <div className={`${colorClass.bg} rounded-xl mb-1 `}>
      <div className="max-w-7xl mx-auto py-1 px-1">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <div
              className={`${colorClass.text} ml-3 font-medium ${messageSizeClass}`}
            >
              <span className="inline ">{children}</span>
            </div>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              onClick={() => setIsDisplayed(false)}
              type="button"
              className="-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2  sm:-mr-2"
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className={`${colorClass.text} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
