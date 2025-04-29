import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView } from "react-native";

export default function GameScreen() {
  const [matrix, setMatrix] = useState<string[][]>([]);

  useEffect(() => {
    generateMatrix();
  }, []);

  const generateMatrix = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const newMatrix: string[][] = [];

    for (let i = 0; i < 15; i++) {
      const row: string[] = [];
      for (let j = 0; j < 15; j++) {
        if (Math.random() < 0.3) {
          const randomLetter =
            letters[Math.floor(Math.random() * letters.length)];
          row.push(randomLetter);
        } else {
          row.push("");
        }
      }
      newMatrix.push(row);
    }

    setMatrix(newMatrix);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{ flexDirection: "column", alignItems: "center", padding: 10 }}
      >
        {matrix.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row" }}>
            {row.map((cell, cellIndex) => (
              <TouchableOpacity
                key={cellIndex}
                style={{
                  width: 20,
                  height: 20,
                  margin: 1,
                  backgroundColor: "#f0f0f0",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text style={{ fontSize: 12 }}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
