import { useState, useEffect } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return "default";
  };

  const sendLocalNotification = (title: string, body: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const options: any = {
      body,
      icon: "/pwa-192x192.svg",
      vibrate: [100, 50, 100],
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          reg.showNotification(title, options);
        })
        .catch(() => {
          new Notification(title, options);
        });
    } else {
      new Notification(title, options);
    }
  };

  return {
    permission,
    requestPermission,
    sendLocalNotification,
  };
}
