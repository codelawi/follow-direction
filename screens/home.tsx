import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { Button, Icon, IconButton } from "react-native-paper";

import NewCar from "@/content/new-car";
import { useModal } from "@/providers/modal-provider";

const SENTENCES: string[] = [
  "احجز طلب رحلتك الان",
  "تنقل بسهولة وأمان في أي وقت",
  "رحلتك أقرب مما تتخيل",
  "خدمة سريعة وأسعار مناسبة",
  "ابدأ رحلتك معنا الآن",
];

export default function HomeScreen() {
  /* ---------- Typing Animation ---------- */
  const [text, setText] = useState<string>("");
  const sentenceIndex = useRef<number>(0);
  const charIndex = useRef<number>(0);

  const { open, close } = useModal();

  useEffect(() => {
    let typingInterval: ReturnType<typeof setInterval>;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        const currentSentence = SENTENCES[sentenceIndex.current];
        charIndex.current++;

        setText(currentSentence.slice(0, charIndex.current));

        if (charIndex.current === currentSentence.length) {
          clearInterval(typingInterval);

          // ⏸ Pause 2s then move to next sentence
          setTimeout(() => {
            charIndex.current = 0;
            sentenceIndex.current =
              (sentenceIndex.current + 1) % SENTENCES.length;
            setText("");
            startTyping();
          }, 2000);
        }
      }, 90);
    };

    startTyping();
    return () => clearInterval(typingInterval);
  }, []);

  /* ---------- Hand Shake Every 2s ---------- */
  const rotate = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    const shake = () => {
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: -1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    };

    shake();
    const timer = setInterval(shake, 2000);
    return () => clearInterval(timer);
  }, [rotate]);

  const rotation = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-20deg", "20deg"],
  });

  const openNew = () => {
    open(
      <View className="w-full h-full">
        <IconButton icon={"close"} onPress={close} />
        <NewCar />
      </View>,
    );
  };

  return (
    <View className="w-full h-full p-6">
      <View className="flex-1 justify-center items-center gap-y-3">
        <View className="flex-row items-center gap-x-2">
          <Text className="text-4xl font-bold">اهلا بك</Text>

          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon size={40} color="#2563eb" source="hand-wave" />
          </Animated.View>
        </View>

        <Text className="text-3xl text-center">{text}</Text>
      </View>

      <Button mode="contained" icon="car-clock" onPress={openNew}>
        حجز رحلة جديدة
      </Button>
    </View>
  );
}
