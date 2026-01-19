import React from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-paper";

import { useRequestStore } from "@/store/use-request-store";

export default function FourthPage() {
  const { setData, data } = useRequestStore();
  const handlePhoneNumber = (phone: string) => {
    if (phone.length < 10) return;
    let number: number = Number(phone);
    setData({
      from: data?.from || "",
      to: data?.to || "",
      time: data?.time || "",
      number: number,
    });
  };
  return (
    <View className="flex-1">
      <View className="p-4 mb-6">
        <Text className="text-center font-semi-bold text-3xl">
          رقم الهاتف للتواصل معك
        </Text>
        <Text className="text-center font-semi-bold text-sm mt-2 text-slate-500">
          سيتم استخدامه فقط للتواصل معك بخصوص الرحلة
        </Text>
      </View>
      <View className="p-4">
        <TextInput
          keyboardType="numeric"
          mode="outlined"
          label={"رقم الهاتف"}
          placeholder="077XXXXXXX"
          maxLength={10}
          onChangeText={handlePhoneNumber}
        />
      </View>
    </View>
  );
}
