"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function PWAUpdater() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);

      // Detecta quando o novo Service Worker assumiu o controle
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        toast.info("Atualização disponível", {
          description: "Aplicando a nova versão do sistema...",
          duration: 3000,
        });

        // Recarrega suavemente a aplicação após o toast
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
    }
  }, []);

  return null;
}
