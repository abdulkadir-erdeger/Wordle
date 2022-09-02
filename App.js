import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, ScrollView, Alert } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "./src/constants";
import Keyboard from "./src/components/Keyboard";
import * as Clipboard from "expo-clipboard";
import kelime from "./kelime.json";
import styles from "./App.styles";

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

export default function App() {
  const [number, setNumber] = useState(0);
  useEffect(() => {
    setNumber(Math.floor(Math.random() * kelime.length));
  }, []);

  const word = kelime[number].toLowerCase();
  console.log(word);
  const letters = word.split(""); // ['h', 'e', 'l', 'l', 'o']

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("playing"); // won, lost, playing

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState !== "won") {
      Alert.alert("Tebrikler", "Kazandın!", [
        { text: "Paylaş", onPress: shareScore },
      ]);
      setGameState("won");
    } else if (checkIfLost() && gameState !== "lost") {
      Alert.alert("Olmadı", "Yarın Tekrar Dene!");
      setGameState("lost");
    }
  };

  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    const textToShare = `Wordle \n${textMap}`;
    Clipboard.setString(textToShare);
    Alert.alert("Başarıyla kopyalandı", "Puanınızı sosyal medyada paylaşın");
  };

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === letters[i]);
  };

  const checkIfLost = () => {
    return !checkIfWon() && curRow === rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }

    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }

      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  };

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
              <View
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.grey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps} // ['a', 'b']
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
}
