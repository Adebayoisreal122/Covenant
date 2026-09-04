"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    // Only register the service worker in production
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "Service Worker registered:",
              registration.scope
            );
          })
          .catch((err) => {
            console.error(
              "Service worker registration failed:",
              err
            );
          });
      });
    }
  }, []);

  return null;
}