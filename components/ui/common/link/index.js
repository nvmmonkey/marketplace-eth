import Link from "next/link";
import React, { Children } from "react";

export default function ActiveLink({ children, ...props }) {
  const className = children.props.className || "";

  return (
    <Link legacyBehavior {...props}>
      {React.cloneElement(children, { className })}
    </Link>
  );
}
