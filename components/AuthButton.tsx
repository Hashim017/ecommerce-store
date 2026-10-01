"use client";

import { useEffect, useState } from "react";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";

export default function AuthButton() {
  const [state, setState] = useState<"loading" | "in" | "out" | "error">(
    "loading"
  );

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setState(data.loggedIn ? "in" : "out"))
      .catch(() => setState("error"));
  }, []);

  return (
    <>
      <span className="ml-2 text-xs font-bold text-grape">[{state}]</span>
      {state === "in" ? <LogoutButton /> : <LoginButton />}
    </>
  );
}