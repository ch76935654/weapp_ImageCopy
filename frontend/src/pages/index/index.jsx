import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.css";
import CameraCopy from "./CameraCopy";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View>
      <CameraCopy />
    </View>
  );
}
