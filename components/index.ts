import { Board } from "./board/index.js";
import { SINGLE_WIDTH, PADDING, SINGLE_HEIGHT } from "./board/index.js";

import { STRING_NUMS, GRADE_NUMS, transChordTaps } from "to-guitar";
import { typesChecker } from "./widgets/types-checker.js";
import { chordsChecker } from "./widgets/chords-checker.js";

let allButton = false;
const allButtonCheck = document.getElementById("all-button-check");

const app = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (canvas) {
    canvas.width = SINGLE_WIDTH * (STRING_NUMS - 1) + PADDING * 2;
    canvas.height = SINGLE_HEIGHT * (GRADE_NUMS - 1) + PADDING * 2;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const board = new Board(ctx, canvas);

    board.addButtonListener("change", (btn) => {
      // console.log('onChange', btn);
    });
    board.addButtonListener("mousemove", (btn) => {
      // console.log('onMousemove', btn);
    });
    board.draw();

    allButtonCheck?.addEventListener("change", () => {
      allButton = !allButton;
      board.drawSetOptions(allButton);
    });

    typesChecker((type) => {
      console.log(type);
      board.boardButtons.forEach((button) => {
        button.setOptions({ pointType: type });
      });
    });

    chordsChecker(transChordTaps(["C", "E", "G"]).chordList, (chord) => {
      board.drawSetOptions2(chord);
    });
  }
};

export { app };
