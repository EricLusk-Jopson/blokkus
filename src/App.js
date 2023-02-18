import { useEffect, useState } from "react";
import "./App.css";
import PieceBoard from "./components/PieceBoard.jsx";
import Board from "./components/Board.jsx";
import ManipulationWindow from "./components/ManipulationWindow";
import { initialPieces } from "./initialStates/initialPieces";
import { initialBoard, zeroBoard } from "./initialStates/initialBoard";
import { newZeroBoard } from "./helpers/newZeroBoard";

const row = 0;
const col = 1;
const first = 0;
const last = 13;

function App() {
  const [activePlayer, setActivePlayer] = useState("player1");
  const [board, setBoard] = useState(initialBoard);
  const [pieces, setPieces] = useState({
    playerOne: [...initialPieces],
    playerTwo: [...initialPieces],
  });
  const [selectedPiece, setSelectedPiece] = useState({ ...initialPieces[0] });
  const [shadedTiles, setShadedTiles] = useState(zeroBoard);
  const [shadedCoords, setShadedCoords] = useState([]);
  const [turn, setTurn] = useState(1);

  const handleSelection = (e, status) => {
    e.preventDefault();
    if (status === "used") return;
    let selectedPieceID = parseInt(e.currentTarget.id);
    setSelectedPiece(initialPieces[selectedPieceID]);
  };

  const handleRotation = (angle) => {
    const selectedCoords = [...selectedPiece.coords];
    const rotatedCoords = selectedCoords.map((coord) => {
      return [coord[1] * angle, -coord[0] * angle];
    });
    const newPiece = { ...selectedPiece };
    newPiece.coords = rotatedCoords;
    setSelectedPiece(newPiece);
  };

  const handleReflection = (axis) => {
    const selectedCoords = [...selectedPiece.coords];
    const reflectedCoords = [];

    const xCoords = new Set();
    const yCoords = new Set();

    const template = initialPieces.find(
      (piece) => piece.name === selectedPiece.name
    );
    template.coords.forEach((coord) => {
      yCoords.add(Math.abs(coord[0]));
      xCoords.add(Math.abs(coord[1]));
    });
    const xMax = Math.max(...xCoords);
    const yMax = Math.max(...yCoords);
    switch (axis) {
      case "vertical":
        selectedCoords.forEach((coord) => {
          reflectedCoords.push([-coord[0], coord[1]]);
        });
        break;

      case "horizontal":
        selectedCoords.forEach((coord) => {
          reflectedCoords.push([coord[0], -coord[1]]);
        });
        break;

      default:
        break;
    }

    reflectedCoords.forEach((reflectedCoord) => {});
    console.log(Math.min());
    const newPiece = { ...selectedPiece };
    newPiece.coords = reflectedCoords;
    setSelectedPiece(newPiece);
  };

  const handleOnMouseEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let focusedID = parseInt(e.currentTarget.id);
    let focusedCoord = [Math.floor(focusedID / 14), focusedID % 14];
    let shadowCoords = [];
    selectedPiece.coords.forEach((coord) => {
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
    shadowCoords.forEach((coord) => (newTiles[coord[0]][coord[1]] = 1));
    setShadedCoords(shadowCoords);
    setShadedTiles(newTiles);
  };

  const handleOnMouseLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShadedTiles(newZeroBoard);
    setShadedCoords([]);
  };

  const handlePlay = (e, valid) => {
    e.stopPropagation();
    e.preventDefault();

    // guard clauses
    if (!valid) {
      return;
    }

    if (activePlayer !== "player1" && activePlayer !== "player2") {
      return;
    }

    const tempBoard = [...board];

    // set ownership and playability of shaded tiles
    shadedCoords.forEach((coord) => {
      tempBoard[coord[row]][coord[col]].occupant = activePlayer;
      tempBoard[coord[row]][coord[col]].isPlayable.player1 = false;
      tempBoard[coord[row]][coord[col]].isPlayable.player2 = false;
      tempBoard[coord[row]][coord[col]].isSeedable.player1 = false;
      tempBoard[coord[row]][coord[col]].isSeedable.player2 = false;
    });

    // update playablity of adjacent tiles
    shadedCoords.forEach((coord) => {
      const adjacenctTiles = [
        [0, -1],
        [-1, 0],
        [0, 1],
        [1, 0],
      ];

      if (coord[row] === first) {
        const top = adjacenctTiles.findIndex(
          (coord) => coord[0] === -1 && coord[1] === 0
        );
        adjacenctTiles.splice(top, 1);
      }

      if (coord[col] === first) {
        const left = adjacenctTiles.findIndex(
          (coord) => coord[0] === 0 && coord[1] === -1
        );
        adjacenctTiles.splice(left, 1);
      }

      if (coord[row] === last) {
        const bottom = adjacenctTiles.findIndex(
          (coord) => coord[0] === 1 && coord[1] === 0
        );
        adjacenctTiles.splice(bottom, 1);
      }

      if (coord[col] === last) {
        const right = adjacenctTiles.findIndex(
          (coord) => coord[0] === 0 && coord[1] === 1
        );
        adjacenctTiles.splice(right, 1);
      }

      adjacenctTiles.forEach((tile) => {
        tempBoard[coord[row] + tile[row]][coord[col] + tile[col]].isPlayable[
          activePlayer
        ] = false;
      });
    });

    // update seedability of corner tiles
    shadedCoords.forEach((coord) => {
      const cornerTiles = [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1],
      ];

      if (coord[row] === first) {
        const topLeft = cornerTiles.findIndex(
          (coord) => coord[0] === -1 && coord[1] === -1
        );
        cornerTiles.splice(topLeft, 1);
        const topRight = cornerTiles.findIndex(
          (coord) => coord[0] === -1 && coord[1] === 1
        );
        cornerTiles.splice(topRight, 1);
      }

      if (coord[col] === first) {
        const topLeft = cornerTiles.findIndex(
          (coord) => coord[0] === -1 && coord[1] === -1
        );
        cornerTiles.splice(topLeft, 1);
        const bottomLeft = cornerTiles.findIndex(
          (coord) => coord[0] === 1 && coord[1] === -1
        );
        cornerTiles.splice(bottomLeft, 1);
      }

      if (coord[row] === last) {
        const bottomLeft = cornerTiles.findIndex(
          (coord) => coord[0] === 1 && coord[1] === -1
        );
        cornerTiles.splice(bottomLeft, 1);
        const bottomRight = cornerTiles.findIndex(
          (coord) => coord[0] === 1 && coord[1] === 1
        );
        cornerTiles.splice(bottomRight, 1);
      }

      if (coord[col] === last) {
        const topRight = cornerTiles.findIndex(
          (coord) => coord[0] === -1 && coord[1] === 1
        );
        cornerTiles.splice(topRight, 1);
        const bottomRight = cornerTiles.findIndex(
          (coord) => coord[0] === 1 && coord[1] === 1
        );
        cornerTiles.splice(bottomRight, 1);
      }

      cornerTiles.forEach((tile, i) => {
        if (
          tempBoard[coord[row] + tile[row]][coord[col] + tile[col]].isPlayable[
            activePlayer
          ]
        ) {
          tempBoard[coord[row] + tile[row]][coord[col] + tile[col]].isSeedable[
            activePlayer
          ] = true;
        }
      });
    });

    // Construct a new series of pieces to replace the state
    const player = activePlayer === "player1" ? "playerOne" : "playerTwo";
    const newPieces = { ...pieces };
    const playerPieces = [...pieces[player]];
    const usedPiece = playerPieces.findIndex(
      (piece) => piece.name === selectedPiece.name
    );
    const usedTemplateName = pieces[player][usedPiece].name;
    const usedTemplateCoords = [...pieces[player][usedPiece].coords];
    const newPiece = {
      coords: usedTemplateCoords,
      name: usedTemplateName,
      status: "used",
    };
    playerPieces[usedPiece] = newPiece;
    newPieces[player] = playerPieces;

    setPieces(newPieces);
    setBoard(tempBoard);
    if (activePlayer === "player1") {
      setActivePlayer("player2");
      setSelectedPiece(
        pieces.playerTwo.find((piece) => piece.status != "used")
      );
    } else {
      setActivePlayer("player1");
      setSelectedPiece(
        pieces.playerOne.find((piece) => piece.status != "used")
      );
    }

    setTurn(turn + 1);
  };

  const skipTurn = () => {
    if (activePlayer === "player1") {
      setActivePlayer("player2");
      setSelectedPiece(
        pieces.playerTwo.find((piece) => piece.status != "used")
      );
    } else {
      setActivePlayer("player1");
      setSelectedPiece(
        pieces.playerOne.find((piece) => piece.status != "used")
      );
    }
    setTurn(turn + 1);
  };

  useEffect(() => {
    console.log(turn);
  }, [turn]);

  return (
    <div className="App">
      {activePlayer === "player1" ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <PieceBoard
            pieces={pieces.playerOne}
            handleSelection={handleSelection}
            activePlayer={activePlayer}
          />
          <button className="button" onClick={skipTurn}>
            Skip Turn
          </button>
        </div>
      ) : (
        <>
          <ManipulationWindow
            selectedPiece={selectedPiece}
            handleRotation={handleRotation}
            handleReflection={handleReflection}
            activePlayer={activePlayer}
          />
        </>
      )}
      <Board
        board={board}
        shadedTiles={shadedTiles}
        shadedCoords={shadedCoords}
        selectedPiece={selectedPiece}
        activePlayer={activePlayer}
        turn={turn}
        handleOnMouseEnter={handleOnMouseEnter}
        handleOnMouseLeave={handleOnMouseLeave}
        handlePlay={handlePlay}
      />
      {activePlayer === "player1" ? (
        <ManipulationWindow
          selectedPiece={selectedPiece}
          handleRotation={handleRotation}
          handleReflection={handleReflection}
          activePlayer={activePlayer}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <PieceBoard
            pieces={pieces.playerTwo}
            handleSelection={handleSelection}
            activePlayer={activePlayer}
          />
          <button className="button" onClick={skipTurn}>
            Skip Turn
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
