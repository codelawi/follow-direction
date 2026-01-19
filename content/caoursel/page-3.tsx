import { useRequestStore } from "@/store/use-request-store";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Icon, TextInput } from "react-native-paper";

export default function ThirdPage() {
  const [selected, setSelect] = useState("ص");
  const [hour, setHour] = useState("");
  const [min, setMin] = useState("");
  const time = `${hour}:${min}-${selected}`;

  const { setData, data } = useRequestStore();

  useEffect(() => {
    if (!hour || !min) return;
    setData({
      from: data?.from || "",
      to: data?.to || "",
      time: time,
      number: null,
    });
  }, [time]);

  return (
    <View className="flex-1">
      <View className="p-4 mb-6">
        <Text className="text-center font-semi-bold text-3xl">
          اكتب الساعة التي تود انطلاق الرحلة منها
        </Text>
      </View>
      <View>
        <View className="mt-12 flex flex-row items-center justify-center">
          <TextInput
            className="text-center"
            keyboardType="numeric"
            mode="outlined"
            label={"الساعة"}
            maxLength={2}
            onChangeText={setHour}
          />
          <Text className="text-2xl mx-3 font-semi-bold">:</Text>
          <TextInput
            maxLength={2}
            className="text-center"
            keyboardType="numeric"
            mode="outlined"
            label={"الدقيقة"}
            onChangeText={setMin}
          />
        </View>
        <View className="flex flex-row justify-center items-center p-4 mt-2 gap-x-4">
          <Pressable
            className={
              selected === "ص"
                ? "bg-slate-200 p-2 rounded-lg flex flex-row items-center border-primary border-2 w-[130px]"
                : "bg-slate-200 p-2 rounded-lg flex flex-row items-center w-[130px]"
            }
            onPress={() => setSelect("ص")}
          >
            <Icon
              source={selected === "ص" ? "circle" : "circle-outline"}
              size={23}
              color={selected === "ص" ? "#2563eb" : "black"}
            />
            <Text className="font-reg flex-1 text-center text-xl">صباحا</Text>
          </Pressable>
          <Pressable
            className={
              selected === "م"
                ? "bg-slate-200 p-2 rounded-lg flex flex-row items-center border-primary border-2 w-[130px]"
                : "bg-slate-200 p-2 rounded-lg flex flex-row items-center w-[130px]"
            }
            onPress={() => setSelect("م")}
          >
            <Icon
              source={selected === "م" ? "circle" : "circle-outline"}
              size={23}
              color={selected === "م" ? "#2563eb" : "black"}
            />
            <Text className="font-reg flex-1 text-center text-xl">مساءا</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
