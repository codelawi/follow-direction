import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = process.env.EXPO_PUBLIC_SECURE_STORAGE_USER_KEY || "";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<null | object>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await SecureStore.getItemAsync(TOKEN_KEY);
      if (session) {
        const sessionToStore = JSON.parse(session);
        setIsAuthenticated(true);
        setSession(sessionToStore);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (session: object) => {
    const stringSession = JSON.stringify(session);
    await SecureStore.setItemAsync(TOKEN_KEY, stringSession);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setIsAuthenticated(false);
  };

  const google = async () => {
    // 1. Create a redirect URI
    const redirectUri = makeRedirectUri({
      scheme: "exp", // Must match 'scheme' in app.json
      path: "/",
    });

    // 2. Start OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true, // Crucial for manual browser handling
      },
    });

    if (error) throw error;

    // 3. Open the browser to the Supabase-generated URL
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    // 4. Handle the session after browser returns
    if (result.type === "success" && result.url) {
      const params = new URLSearchParams(result.url.split("#")[1]);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        // 1. Set the session in the client
        const { data: sessionData, error: sessionError } =
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

        if (sessionError) throw sessionError;

        // 2. Fetch the actual user object
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        const session = {
          sessionData,
          user,
        };

        login(session);
      }
    }
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    session,
    google,
    refreshAuth: checkAuth,
  };
}
