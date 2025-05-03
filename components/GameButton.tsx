import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
function GameButton({
  TopLeftText,
  MiddleText,
  backgroundColor,
}: {
  TopLeftText: string;
  MiddleText: string;
  backgroundColor: string;
}) {
  return (
    <TouchableOpacity
      style={{
        width: 22,
        height: 22,
        margin: 1,
        position: "relative",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
      }}
    >
      <Text
        style={{
          fontSize: 7,
          top: -6,
          left: 2,
          position: "absolute",
          color: "white",
        }}
      >
        {TopLeftText}
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: "white",
        }}
      >
        {MiddleText}
      </Text>
    </TouchableOpacity>
  );
}

export default GameButton;
