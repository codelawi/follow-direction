import React from "react";
import { Text, View } from "react-native";

import { Image } from "expo-image";
import { Button } from "react-native-paper";

import { useAuth } from "@/hooks/use-auth";

export default function login() {
  const { google } = useAuth();
  return (
    <View className="w-full h-full p-4">
      <View className="flex-1 flex justify-center items-center">
        <Image
          cachePolicy={"disk"}
          source={require("@/assets/background/background-auth.png")}
          style={{
            width: 250,
            height: 480,
            borderRadius: 40,
          }}
        />
      </View>
      <View className="flex flex-row items-center gap-x-2 justify-center mb-12">
        <Text className="font-bold text-primary text-2xl">Follow</Text>
        <Text className="font-reg text-2xl">مرحبا بك في منصة</Text>
      </View>
      <Button onPress={google} mode="contained">
        متابعة باستخدام جوجل
      </Button>
    </View>
  );
}
