// hooks/use-push-notification.ts
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useAuth } from "./use-auth";

// Lazy load expo-notifications to avoid crashes in production
let Notifications: any = null;
async function loadNotifications() {
  if (!Notifications) {
    Notifications = await import("expo-notifications");
  }
  return Notifications;
}

export default function usePushNotification() {
  const { user, loading } = useAuth();
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // Setup notification handler and channels
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const Notifications = await loadNotifications();

        // Only set handler once
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowAlert: true,
          }),
        });

        // Configure Android notification channel
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        // Listen for foreground notifications
        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification: any) => {
            console.log(
              "📨 Notification received in foreground:",
              notification,
            );
          });

        // Listen for notification responses
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener(
            (response: any) => {
              handleNotificationResponse(response);
            },
          );

        // Handle launch from notification (closed state)
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response) {
          console.log("App launched from notification:", response);
          setTimeout(() => {
            handleNotificationResponse(response);
          }, 500);
        }
      } catch (e) {
        console.warn("Notifications module not available:", e);
      }
    })();

    return () => {
      mounted = false;
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
    };
  }, []);

  const handleNotificationResponse = useCallback((response: any) => {
    const data = response.notification.request.content.data;
    if (data?.type === "test") {
      console.log("Test notification tapped:", data);
    }
  }, []);

  // Register push token when user logs in
  useEffect(() => {
    if (user && !loading) {
      registerToken();
    }
  }, [user, loading]);

  const registerToken = useCallback(async () => {
    try {
      const Notifications = await loadNotifications();

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Notifications permission denied");
        return null;
      }

      console.log("Notification permission granted");

      // Get Expo push token
      const token = (await Notifications.getExpoPushTokenAsync()).data;

      console.log("Expo push token:", token);

      // Save token to user profile
      const { error } = await supabase
        .from("profiles")
        .update({
          expo_push_token: token,
          notification_enabled: true,
        })
        .eq("id", user?.id);

      if (error) {
        console.error("Error saving push token:", error);
        return null;
      }

      console.log("Push token saved to profile");
      return token;
    } catch (error) {
      console.error("Error getting push token:", error);
      return null;
    }
  }, [user]);

  // Send notification to all users
  const sendToAllUsers = useCallback(
    async (title: string, body: string, data?: any) => {
      try {
        const { data: users, error } = await supabase
          .from("profiles")
          .select("expo_push_token")
          .eq("notification_enabled", true)
          .not("expo_push_token", "is", null);

        if (error) throw error;

        const tokens = users
          .map((user) => user.expo_push_token)
          .filter(Boolean) as string[];

        if (!tokens.length) return { sent: 0, total: 0 };

        const notificationContent = {
          to: tokens,
          sound: "default",
          title,
          body,
          data: {
            ...data,
            sentAt: new Date().toISOString(),
            senderId: user?.id,
          },
          priority: "high",
          _displayInForeground: true,
          channelId: Platform.OS === "android" ? "default" : undefined,
        };

        console.log("Sending to tokens:", tokens.length);

        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationContent),
        });

        const result = await response.json();
        console.log("Push notification result:", result);

        // Log broadcast
        if (user?.id) {
          await supabase.from("notification_broadcasts").insert({
            sender_id: user.id,
            title,
            body,
            data,
            recipients_count: tokens.length,
            sent_at: new Date().toISOString(),
          });
        }

        return { sent: tokens.length, total: tokens.length, result };
      } catch (error) {
        console.error("Error sending to all users:", error);
        throw error;
      }
    },
    [user],
  );

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    try {
      const token = await registerToken();
      if (!token) return;

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: token,
          sound: "default",
          title: "📱 اختبار الإشعارات",
          body: "هذا إشعار تجريبي!",
          data: {
            screen: "Home",
            type: "test",
            timestamp: new Date().toISOString(),
          },
          priority: "high",
          _displayInForeground: true,
          channelId: Platform.OS === "android" ? "default" : undefined,
        }),
      });

      const result = await response.json();
      console.log("Test notification result:", result);
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  }, [registerToken]);

  return {
    registerToken,
    sendToAllUsers,
    sendTestNotification,
  };
}
