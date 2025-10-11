"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const baseProps = {
  style: { borderRadius: 0 },
  className:
    "relative btn-primary font-semibold text-white bg-orange-500 shadow-md transition-all duration-300 unctrlbutton-hover",
  whileHover: {
    backgroundColor: "#111111",
    color: "#FFFFFF",
    y: -0.5,
    boxShadow: "6px 6px 0px #B6FF00",
  },
  whileTap: { scale: 0.97 },
};

const UnCtrlButton = ({ children, href, external = false, className, ...rest }) => {
  const combinedClass = className
    ? `${baseProps.className} ${className}`
    : baseProps.className;

  if (href) {
    if (external) {
      return (
        <motion.a
          {...baseProps}
          className={combinedClass}
          href={href} 
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </motion.a>
      );
    }
    return (
      <Link href={href} {...rest}   legacyBehavior>
        <motion.a {...baseProps} className={combinedClass}>
          {children}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button {...baseProps} className={combinedClass} {...rest}>
      {children}
    </motion.button>
  );
};

export default UnCtrlButton;
