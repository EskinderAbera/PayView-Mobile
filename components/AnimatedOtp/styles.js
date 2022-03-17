import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../constants";

export const CELL_SIZE = 55;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = COLORS.white;
export const NOT_EMPTY_CELL_BG_COLOR = COLORS.primary;
export const ACTIVE_CELL_BG_COLOR = "#f7fafe";

const styles = StyleSheet.create({
  codeFiledRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },
  // =======================

  root: {
    minHeight: 800,
    padding: 20,
    textAlign: "center",
  },
  title: {
    paddingTop: 50,
    color: "#000",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 40,
  },
  icon: {
    width: 217 / 2.4,
    height: 158 / 2.4,
    marginLeft: "auto",
    marginRight: "auto",
  },
  subTitle: {
    paddingTop: 30,
    color: "#000",
    textAlign: "center",
  },
  nextButton: {
    marginTop: 30,
    borderRadius: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    minWidth: 300,
    marginBottom: 100,
  },
  nextButtonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
});

export default styles;
