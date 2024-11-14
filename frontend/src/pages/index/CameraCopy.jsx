import {
  View,
  Camera,
  Button,
  Image,
  Text,
  ScrollView,
} from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";

export default function CameraCopy() {
  const [src, setSrc] = useState("");
  const [text, setText] = useState(null);
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState(0);
  const [devicePosition, setDevicePosition] = useState("back");

  const modes = ["一言金句", "小红书文案", "闲鱼发布", "外卖好评", "夸夸怪"]; // 替换为你的模式名称

  function takePhoto() {
    const ctx = Taro.createCameraContext();
    ctx.takePhoto({
      quality: "high",
      success: (res) => {
        
        const tempImagePath = res.tempImagePath;
        setSrc(tempImagePath);
        console.log("Take photo successful", tempImagePath);
        Taro.uploadFile({
          url: "https://wechat-cop.aeonxai.com/upload", // 替换为你的服务器上传接口地址
          filePath: tempImagePath,
          name: "photo",
          header: {
            "Content-Type": "multipart/form-data",
          },
          formData: {
            mode: selectedMode, // 添加模式参数
          },
          success: (uploadRes) => {
            console.log("Server response:", uploadRes.data); // 打印原始响应数据
            try {
              const data = JSON.parse(uploadRes.data);
              console.log("reply", data.reply);
              console.log("Upload successful", uploadRes);
              setText(data.reply);
              setIsFloatingVisible(true); // 显示悬浮框
            } catch (e) {
              console.error(
                "Failed to parse JSON:",
                e,
                "Response:",
                uploadRes.data
              );
            }
          },
          fail: (err) => {
            console.error("Upload failed", err);
          },
        });
      },
      fail: (err) => {
        console.error("Take photo failed", err);
      },
    });
  }

  function switchCamera() {
    setDevicePosition((prevPosition) =>
      prevPosition === "back" ? "front" : "back"
    );
  }

  function hideFloatingBox() {
    setIsFloatingVisible(false);
  }

  function copyText() {
    if (text) {
      Taro.setClipboardData({
        data: text,
        success: () => {
          Taro.showToast({
            title: "文字已复制",
            icon: "success",
            duration: 2000,
          });
        },
        fail: (err) => {
          console.error("复制文字失败", err);
        },
      });
    }
  }

  return (
    <View
      onClick={hideFloatingBox}
      style={{
        backgroundColor: "#f5f5f7",
        color: "#333",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <ScrollView
        scrollX
        style={{
          whiteSpace: "nowrap",
          padding: "10px",
          background: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {modes.map((mode, index) => (
          <View
            key={index}
            style={{
              display: "inline-block",
              width: "100px",
              height: "50px",
              lineHeight: "50px",
              textAlign: "center",
              marginRight: "10px",
              backgroundColor: selectedMode === index ? "#007aff" : "#f1f1f1",
              color: selectedMode === index ? "#ffffff" : "#007aff",
              borderRadius: "25px",
              boxShadow:
                selectedMode === index ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onClick={() => setSelectedMode(index)}
          >
            {mode}
          </View>
        ))}
      </ScrollView>

      <Camera
        devicePosition={devicePosition}
        flash="off"
        onError={(err) => console.error("Camera error", err)}
        style={{
          width: "100%",
          height: "520px",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      ></Camera>

      <View
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #d9d9d9",
        }}
      >
        <View style={{ flex: 1, textAlign: "center" }}>
          {src && (
            <Image
              mode="widthFix"
              src={src}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "30px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          )}
        </View>

        <View style={{ flex: 1, textAlign: "center" }}>
          <Image
            src={require("../../assets/camera24.png")}
            style={{
              width: "80px", // 按钮的宽度
              height: "80px", // 按钮的高度
              display: "inline-block",
              verticalAlign: "middle",
              cursor: "pointer",
              backgroundColor: "#007aff",
              borderRadius: "40px",
              padding: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
            onClick={takePhoto} // 添加点击事件
          />
        </View>

        <View style={{ flex: 1, textAlign: "center" }}>
          <Image
            src={require("../../assets/cameraswitch24.png")}
            style={{
              width: "60px", // 按钮的宽度
              height: "60px", // 按钮的高度
              display: "inline-block",
              verticalAlign: "middle",
              cursor: "pointer",
              backgroundColor: "#007aff",
              borderRadius: "30px",
              padding: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
            onClick={switchCamera} // 添加点击事件
          />
        </View>
      </View>
      {isFloatingVisible && (
        <View
          className="floating-box"
          onClick={hideFloatingBox} // 点击悬浮框外部隐藏悬浮框
          style={{
            position: "fixed",
            top: "50%", // 悬浮窗位于相机视图的一半高度
            left: "50%",

            transform: "translate(-50%, -50%)",
            width: "90%", // 设置悬浮窗宽度
            height: "auto", // 修改为自适应高度
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)", // 半透明背景
            zIndex: 999, // 确保悬浮文字在最上层
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          <ScrollView
            className="floating-content"
            onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)", // 半透明黑色背景
              padding: "20px",
              borderRadius: "15px",
              color: "#ffffff", // 白色文字
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "100%", // 设置宽度为父元素宽度
              maxHeight: "80vh", // 设置最大高度为屏幕高度的80%
              overflowY: "auto", // 自动显示滚动条
            }}
          >
            <Text
              onClick={copyText}
              style={{
                fontSize: "16px",
              }}
            >
              {text}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
