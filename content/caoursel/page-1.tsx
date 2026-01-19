import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Icon } from "react-native-paper";

import { useRequestStore } from "@/store/use-request-store";

export default function FirstPage() {
  const { setData } = useRequestStore();

  const [selected, setSelect] = useState<null | string>(null);
  const cities = [
    "عمان",
    "الزرقاء",
    "اربد",
    "جرش",
    "مادبا",
    "الكرك",
    "معان",
    "العقبة",
    "البلقاء",
    "الطفيلة",
    "المفرق",
    "عجلون",
    "السلط",
  ];

  useEffect(() => {
    setData({
      from: selected,
      to: null,
      time: null,
      number: null,
    });
  }, [selected]);

  return (
    <View className="flex-1 p-4">
      <View className="p-4 mb-6">
        <Text className="text-center font-semi-bold text-3xl">
          مكان انطلاق الرحلة
        </Text>
      </View>
      <ScrollView className="max-h-[65%]">
        <View className="gap-y-3">
          {cities.map((city, key) => (
            <Pressable
              key={key}
              className={
                selected === city
                  ? "bg-slate-200 p-6 rounded-3xl flex flex-row items-center border-primary border-2"
                  : "bg-slate-200 p-6 rounded-3xl flex flex-row items-center"
              }
              onPress={() => setSelect(city)}
            >
              <Icon
                source={selected === city ? "circle" : "circle-outline"}
                size={23}
                color={selected === city ? "#2563eb" : "black"}
              />
              <Text className="font-reg flex-1 text-center text-xl">
                {city}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
