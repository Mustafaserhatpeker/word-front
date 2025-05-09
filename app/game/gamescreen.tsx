import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import GameButton from "@/components/GameButton";

const letterData = [
  { letter: "K", points: 3, position: { x: 2, y: 0 } },
  { letter: "K", points: 3, position: { x: 0, y: 2 } },
  { letter: "K", points: 2, position: { x: 3, y: 3 } },
  { letter: "K", points: 3, position: { x: 12, y: 0 } },
  { letter: "K", points: 3, position: { x: 14, y: 2 } },
  { letter: "K", points: 2, position: { x: 7, y: 2 } },
  { letter: "K", points: 2, position: { x: 11, y: 3 } },
  { letter: "K", points: 2, position: { x: 2, y: 7 } },
  { letter: "K", points: 2, position: { x: 12, y: 7 } },
  { letter: "K", points: 2, position: { x: 3, y: 11 } },
  { letter: "K", points: 2, position: { x: 11, y: 11 } },
  { letter: "K", points: 3, position: { x: 0, y: 12 } },
  { letter: "K", points: 3, position: { x: 14, y: 12 } },
  { letter: "K", points: 2, position: { x: 7, y: 12 } },
  { letter: "K", points: 3, position: { x: 2, y: 14 } },
  { letter: "K", points: 3, position: { x: 12, y: 14 } },
  { letter: "H", points: 2, position: { x: 5, y: 0 } },
  { letter: "H", points: 2, position: { x: 9, y: 0 } },
  { letter: "H", points: 3, position: { x: 1, y: 1 } },
  { letter: "H", points: 2, position: { x: 6, y: 1 } },
  { letter: "H", points: 2, position: { x: 8, y: 1 } },
  { letter: "H", points: 3, position: { x: 13, y: 1 } },
  { letter: "H", points: 2, position: { x: 0, y: 5 } },
  { letter: "H", points: 2, position: { x: 5, y: 5 } },
  { letter: "H", points: 2, position: { x: 9, y: 5 } },
  { letter: "H", points: 2, position: { x: 14, y: 5 } },
  { letter: "H", points: 2, position: { x: 1, y: 6 } },
  { letter: "H", points: 2, position: { x: 6, y: 6 } },
  { letter: "H", points: 2, position: { x: 8, y: 6 } },
  { letter: "H", points: 2, position: { x: 13, y: 6 } },
  { letter: "H", points: 2, position: { x: 1, y: 8 } },
  { letter: "H", points: 2, position: { x: 6, y: 8 } },
  { letter: "H", points: 2, position: { x: 8, y: 8 } },
  { letter: "H", points: 2, position: { x: 13, y: 8 } },
  { letter: "H", points: 2, position: { x: 0, y: 9 } },
  { letter: "H", points: 2, position: { x: 5, y: 9 } },
  { letter: "H", points: 2, position: { x: 9, y: 9 } },
  { letter: "H", points: 2, position: { x: 14, y: 9 } },
  { letter: "H", points: 3, position: { x: 4, y: 10 } },
  { letter: "H", points: 3, position: { x: 10, y: 10 } },
  { letter: "H", points: 3, position: { x: 1, y: 13 } },
  { letter: "H", points: 2, position: { x: 6, y: 13 } },
  { letter: "H", points: 2, position: { x: 8, y: 13 } },
  { letter: "H", points: 3, position: { x: 13, y: 13 } },
  { letter: "H", points: 2, position: { x: 5, y: 14 } },
  { letter: "H", points: 2, position: { x: 9, y: 14 } },
  { letter: "S", points: 0, position: { x: 7, y: 7 } },
];
const colorMap = new Map<string, string>();
const colorPalette = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9844a",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#577590",
  "#277da1",
  "#4d908e",
  "#b5838d",
  "#6a4c93",
];

let colorIndex = 0;

const getColorForKey = (letter: string, points: number | null): string => {
  if (letter === "" || points === null) return "#ccc";

  const key = `${letter}-${points}`;
  if (!colorMap.has(key)) {
    colorMap.set(key, colorPalette[colorIndex % colorPalette.length]);
    colorIndex++;
  }
  return colorMap.get(key)!;
};

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
        row.push({ letter: "", points: null });
      }
      newMatrix.push(row);
    }

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
                backgroundColor={getColorForKey(cell.letter, cell.points)}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
