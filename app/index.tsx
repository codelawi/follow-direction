import { router } from "expo-router";
import React, { useEffect } from "react";

import MainScreen from "@/app/(home)";
import LoadingPage from "@/components/loading-page";
import { useAuth } from "@/hooks/use-auth";

export default function Index() {
  const { loading, isAuthenticated, session } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <LoadingPage text="انتظر قليلا" />;
  }

  return <MainScreen />;
}
