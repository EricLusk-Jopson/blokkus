import { useEffect, useState } from "react";
import "./App.css";
import PieceBoard from "./components/PieceBoard.jsx";
import Board from "./components/Board.jsx";
import ManipulationWindow from "./components/ManipulationWindow";
import { initialPieces } from "./initialStates/initialPieces";
import { initialBoard, zeroBoard } from "./initialStates/initialBoard";
import { modulo } from "./helpers/modulo";
import { newZeroBoard } from "./helpers/newZeroBoard";

function App() {
  const [activePlayer, setActivePlayer] = useState("player1");
  const [board, setBoard] = useState(initialBoard);
  const [pieces, setPieces] = useState({
    playerOne: initialPieces,
    playerTwo: initialPieces,
  });
  const [selectedPiece, setSelectedPiece] = useState([
    ...initialPieces[0].coords,
  ]);
  const [shadedTiles, setShadedTiles] = useState(zeroBoard);
  const [shadedCoords, setShadedCoords] = useState([]);

  const handleSelection = (e) => {
    e.preventDefault();
    let selectedPieceID = parseInt(e.currentTarget.id);
    setSelectedPiece(initialPieces[selectedPieceID].coords);
  };

  const handleRotation = (angle) => {
    const selectedCoords = [...selectedPiece];
    const rotatedCoords = selectedCoords.map((coord) => {
      return [-coord[1] * angle, coord[0] * angle];
    });
    setSelectedPiece(rotatedCoords);
  };

  const handleReflection = (axis) => {
    const selectedCoords = [...selectedPiece];
    const reflectedCoords = [];

    const xCoords = new Set();
    const yCoords = new Set();
    selectedPiece.forEach((coord) => {
      xCoords.add(Math.abs(coord[0]));
      yCoords.add(Math.abs(coord[1]));
    });
    const xMax = Math.max(...xCoords);
    const yMax = Math.max(...yCoords);
    switch (axis) {
      case "vertical":
        selectedCoords.forEach((coord) => {
          reflectedCoords.push([coord[0], -coord[1] + yMax]);
        });
        break;

      case "horizontal":
        selectedCoords.forEach((coord) => {
          reflectedCoords.push([-coord[0] + xMax, coord[1]]);
        });
        break;

      default:
        break;
    }
    setSelectedPiece(reflectedCoords);
  };

  const handleOnMouseEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let focusedID = parseInt(e.currentTarget.id);
    let focusedCoord = [focusedID % 14, Math.floor(focusedID / 14)];
    let shadowCoords = [];
    selectedPiece.forEach((coord) => {
      if (
        coord[0] + focusedCoord[0] > 13 ||
        coord[0] + focusedCoord[0] < 0 ||
        coord[1] + focusedCoord[1] > 13 ||
        coord[1] + focusedCoord[1] < 0
      ) {
        return;
      }
      shadowCoords.push([
        coord[0] + focusedCoord[0],
        coord[1] + focusedCoord[1],
      ]);
    });
    let newTiles = newZeroBoard();
    shadowCoords.forEach((coord) => (newTiles[coord[1]][coord[0]] = 1));
    setShadedCoords(shadowCoords);
    setShadedTiles(newTiles);
  };

  const handleOnMouseLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShadedTiles(newZeroBoard);
    setShadedCoords([]);
  };

  return (
    <div className="App">
      {activePlayer === "player1" ? (
        <PieceBoard
          pieces={pieces.playerOne}
          selectedPiece={selectedPiece}
          handleSelection={handleSelection}
        />
      ) : (
        <ManipulationWindow selectedPiece={selectedPiece} />
      )}
      <Board
        board={board}
        shadedTiles={shadedTiles}
        shadedCoords={shadedCoords}
        selectedPiece={selectedPiece}
        activePlayer={activePlayer}
        handleOnMouseEnter={handleOnMouseEnter}
        handleOnMouseLeave={handleOnMouseLeave}
      />
      {activePlayer === "player1" ? (
        <ManipulationWindow
          selectedPiece={selectedPiece}
          handleRotation={handleRotation}
          handleReflection={handleReflection}
        />
      ) : (
        <PieceBoard
          pieces={pieces.playerTwo}
          selectedPiece={selectedPiece}
          handleSelection={handleSelection}
        />
      )}
    </div>
  );
}

export default App;
