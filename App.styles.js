import { StyleSheet, Platform } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "./src/constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },

  map: {
    alignSelf: "stretch",
    marginVertical: 20,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  },
});
