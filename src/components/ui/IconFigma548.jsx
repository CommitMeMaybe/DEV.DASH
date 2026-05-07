import React from "react";

export default function IconFigma548({ className = "", ...props }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        width: 18,
        height: 18,
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8H8V3Z" fill="#1ABCFE"/>
        <path d="M8 11H3V16C3 17.1046 3.89543 18 5 18H8V11Z" fill="#0ACF83"/>
        <path d="M16 3H8V8H11C13.7614 8 16 5.76142 16 3Z" fill="#FF7262"/>
        <path d="M8 16H11C13.7614 16 16 13.7614 16 11H8V16Z" fill="#F24E1E"/>
        <path d="M16 11C16 13.7614 13.7614 16 11 16H16V11Z" fill="#A259FF"/>
      </svg>
    </span>
  );
}
