import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function ActiveLink({ children, activeLinkClass, ...props }) {
  let className = children.props.className || "";
  const { pathname } = useRouter();

  if (pathname === props.href) {
    className = `${className} ${
      activeLinkClass ? activeLinkClass : "text-indigo-600"
    } `;
  }

  return (
    <Link legacyBehavior {...props}>
      {React.cloneElement(children, { className })}
    </Link>
  );
}
