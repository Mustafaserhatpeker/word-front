// gamescreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import io from "socket.io-client";

// Socket.IO server bağlantısı
const socket = io("http://localhost:5001"); // Sunucu URL'sini burada değiştirin

// GameScreen bileşeni
const GameScreen = () => {
  // State'ler
  const [gameStatus, setGameStatus] = useState("waiting"); // waiting, inProgress, gameOver
  const [timeRemaining, setTimeRemaining] = useState(300); // Başlangıç süresi (5dk = 300 saniye)
  const [word, setWord] = useState("");
  const [playerTurn, setPlayerTurn] = useState(""); // Oyuncunun sırası
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState("");
  const [error, setError] = useState("");

  // Oyuncu sırasına göre oyun başlatma
  useEffect(() => {
    socket.on("game_start", (data) => {
      console.log("Oyun Başladı:", data);
      setOpponentName(
        data.players.find((p: any) => p.id !== socket.id).username
      );
      setPlayerTurn(data.turn);
      setGameStatus("inProgress");
    });

    socket.on("turn_change", (data) => {
      setPlayerTurn(data.turn);
      setTimeRemaining(data.timeRemaining / 1000); // Zamanı saniye cinsine çevir
    });

    socket.on("word_submitted", (data) => {
      // Kelime gönderildiğinde puanları güncelle
      if (data.playerId === socket.id) {
        setPlayerScore(playerScore + data.score);
      } else {
        setOpponentScore(opponentScore + data.score);
      }
    });

    socket.on("game_end", (data) => {
      setGameStatus("gameOver");
      const winner =
        data.winner.username === socket.id ? "Kazandınız!" : "Kaybettiniz!";
      Alert.alert("Oyun Bitti", winner + " " + data.message);
    });

    return () => {
      socket.off("game_start");
      socket.off("turn_change");
      socket.off("word_submitted");
      socket.off("game_end");
    };
  }, [playerScore, opponentScore]);

  // Oyuna katılma
  const joinGame = () => {
    socket.emit("join_game_queue", "5dk"); // 5dk'lık oyun kuyruğuna katıl
  };

  // Kelime gönderme
  const submitWord = () => {
    if (!word) {
      setError("Kelime girmelisiniz!");
      return;
    }

    socket.emit("word_submission", word); // Sunucuya kelime gönder
    setWord("");
    setError("");
  };

  // Timer güncelleme
  useEffect(() => {
    if (gameStatus === "inProgress" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStatus, timeRemaining]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oyun Ekranı</Text>

      {gameStatus === "waiting" && (
        <View style={styles.statusContainer}>
          <Text>Diğer oyuncunun gelmesini bekliyoruz...</Text>
          <Button title="Oyuna Katıl" onPress={joinGame} />
        </View>
      )}

      {gameStatus === "inProgress" && (
        <View style={styles.statusContainer}>
          <Text>Oyun Başladı!</Text>
          <Text>
            Oyuncu Sırası: {playerTurn === socket.id ? "Sizde" : opponentName}
          </Text>
          <Text>Kalan Süre: {timeRemaining} saniye</Text>

          <TextInput
            style={styles.input}
            placeholder="Kelime girin"
            value={word}
            onChangeText={setWord}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Kelime Gönder" onPress={submitWord} />
          <Text>Puanınız: {playerScore}</Text>
          <Text>
            {opponentName} Puanı: {opponentScore}
          </Text>
        </View>
      )}

      {gameStatus === "gameOver" && (
        <View style={styles.statusContainer}>
          <Text>Oyun Bitti!</Text>
          <Text>
            {playerScore > opponentScore ? "Kazandınız!" : "Kaybettiniz!"}
          </Text>
          <Button title="Yeniden Başlat" onPress={joinGame} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statusContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    width: "80%",
    paddingLeft: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default GameScreen;
