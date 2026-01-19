import Carousel from "@/components/caoursel";
import React, { useRef } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import FirstPage from "./caoursel/page-1";
import SecondPage from "./caoursel/page-2";
import ThirdPage from "./caoursel/page-3";

export default function NewCar() {
  const nextRef = useRef<{ goNext: () => void }>(null);
  const handleGoNext = () => {
    nextRef?.current?.goNext();
  };

  const data = [
    { id: "1", component: <FirstPage /> },
    {
      id: "2",
      component: <SecondPage />,
    },
    { id: "3", component: <ThirdPage /> },
  ];

  const handleEnd = () => {
    console.log("its end now");
  };
  return (
    <View className="flex-1">
      <View className="flex-1">
        <Carousel data={data} ref={nextRef} onEnd={handleEnd} />
      </View>
      <View className="p-4">
        <Button mode="contained">متابعة</Button>
      </View>
    </View>
  );
}
