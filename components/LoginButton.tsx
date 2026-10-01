"use client";

import { useAuth } from "@/components/AuthProvider";

export default function LoginButton({
  className = "btn-primary ml-2 px-5 py-2",
  label = "Log in",
}: {
  className?: string;
  label?: string;
}) {
  const { openLogin } = useAuth();

  return (
    <button onClick={openLogin} className={className}>
      {label}
    </button>
  );
}