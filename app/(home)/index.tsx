import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeScreen from "@/screens/home";

const MusicRoute = () => <Text>Music</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

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
    {
      key: "notifications",
      title: "الاشعارات",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
    {
      key: "profile",
      title: "الحساب",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    recents: RecentsRoute,
    notifications: NotificationsRoute,
    profile: NotificationsRoute,
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
