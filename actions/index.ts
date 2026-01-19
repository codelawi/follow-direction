import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createNewRequest = async (datas: any) => {
  const storeName = `recent-${Math.random()}`;
  const { error, status } = await supabase.from("requests").insert({
    from: datas.from,
    to: datas.to,
    time: datas.time,
    phone: datas.number,
  });
  if (error) {
    return {
      status,
      message: "حدثت مشكلة",
    };
  }

  const stringData = JSON.stringify(datas);
  await AsyncStorage.setItem(storeName, stringData);

  return {
    status,
    message: "تم ارسال طلبك بنجاح",
  };
};
