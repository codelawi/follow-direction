import React from "react";
import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function LoadingPage({ text }: { text?: string }) {
  return (
    <View className="w-full h-full flex justify-center items-center gap-y-6">
      <ActivityIndicator color="#2563eb" />
      <Text className="font-reg text-primary">{text}</Text>
    </View>
  );
}
