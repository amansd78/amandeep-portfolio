"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

let patched = false;
function patchConsole() {
  if (patched) return;
  patched = true;

  const original = console.error;
  console.error = (...args) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (msg.includes("React does not recognize the `disableTransition` prop")) return;
    original(...args);
  };
}

export default function StudioClient() {
  if (process.env.NODE_ENV === "development") patchConsole();
  return <NextStudio config={config} />;
}
