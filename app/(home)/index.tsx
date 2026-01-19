import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeScreen from "@/screens/home";
import RecentScreen from "@/screens/recent";

const MainScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "الرئيسية",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },

    { key: "recents", title: "السجل", focusedIcon: "history" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    recents: RecentScreen,
  });

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        sceneAnimationType="opacity"
        activeIndicatorStyle={{
          backgroundColor: "#2563eb99",
        }}
        barStyle={{
          backgroundColor: "#2564eb08",
        }}
      />
    </SafeAreaView>
  );
};

export default MainScreen;
