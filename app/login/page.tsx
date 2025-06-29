import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-layout">
      {/* You can add a header, logo, etc. here */}
      {children}
    </div>
  );
}