import { useRequestStore } from "@/store/use-request-store";
import React from "react";
import { Text, TextInput, View } from "react-native";

export default function SecondPage() {
  const { setData, data } = useRequestStore();
  const handleSettingData = (text: string) => {
    setData({
      from: data?.from || "",
      to: text,
      time: null,
      number: null,
    });
  };
  return (
    <View className="flex-1">
      <View className="p-4 mb-6">
        <Text className="text-center font-semi-bold text-3xl">
          اكتب الى اين تحديدا تريد الذهاب
        </Text>
      </View>
      <View className="p-4">
        <TextInput
          className="bg-slate-200 p-4 rounded-2xl min-h-[20%] font-reg"
          multiline
          textAlignVertical="top"
          placeholder="المكان الذي تريد الذهاب اليه ..."
          onChangeText={handleSettingData}
        />
      </View>
    </View>
  );
}
