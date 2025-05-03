import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import GameButton from "@/components/GameButton";

const letterData = [
  { letter: "H", points: 3, position: { x: 0, y: 0 } },
  { letter: "H", points: 3, position: { x: 12, y: 12 } },
  { letter: "H", points: 2, position: { x: 5, y: 8 } },
  { letter: "K", points: 4, position: { x: 3, y: 7 } },
  { letter: "K", points: 5, position: { x: 10, y: 1 } },
];

export default function GameScreen() {
  const [matrix, setMatrix] = useState<
    { letter: string; points: number | null }[][]
  >([]);

  useEffect(() => {
    generateMatrix();
  }, []);

  const generateMatrix = () => {
    const newMatrix: { letter: string; points: number | null }[][] = [];

    for (let i = 0; i < 15; i++) {
      const row = [];
      for (let j = 0; j < 15; j++) {
        row.push({ letter: "", points: null }); // başlangıçta boş
      }
      newMatrix.push(row);
    }

    // JSON verisindeki harfleri yerleştir
    for (const item of letterData) {
      const { x, y } = item.position;
      newMatrix[y][x] = { letter: item.letter, points: item.points };
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
              <GameButton
                key={cellIndex}
                TopLeftText={cell.points !== null ? cell.points.toString() : ""}
                MiddleText={cell.letter}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
