import { useEffect, useState, useRef } from "react";
import "./App.css";
import PieceBoard from "./components/PieceBoard.jsx";
import Board from "./components/Board.jsx";
import ManipulationWindow from "./components/ManipulationWindow";
import WinnerModal from "./components/WinnerModal";
import { initialPieces } from "./initialStates/initialPieces";
import { initialBoard, zeroBoard } from "./initialStates/initialBoard";
import { newZeroBoard } from "./helpers/newZeroBoard";

const row = 0;
const col = 1;
const first = 0;
const last = 13;

function App() {
  const numberOfPlayers = 2;
  const [activePlayer, setActivePlayer] = useState(0);
  const [retired, setRetired] = useState([false, false]);
  const [board, setBoard] = useState(initialBoard);
  const [pieces, setPieces] = useState({
    0: [...initialPieces],
    1: [...initialPieces],
  });
  const [selectedPiece, setSelectedPiece] = useState({ ...initialPieces[0] });
  const [shadedTiles, setShadedTiles] = useState(zeroBoard);
  const [shadedCoords, setShadedCoords] = useState([]);
  const [turn, setTurn] = useState(1);
  const [gameWon, setGameWon] = useState(false);

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

    if (activePlayer !== 0 && activePlayer !== 1) {
      return;
    }

    const tempBoard = [...board];

    // set ownership and playability of shaded tiles
    shadedCoords.forEach((coord) => {
      tempBoard[coord[row]][coord[col]].occupant = activePlayer;
      tempBoard[coord[row]][coord[col]].isPlayable[0] = false;
      tempBoard[coord[row]][coord[col]].isPlayable[1] = false;
      tempBoard[coord[row]][coord[col]].isSeedable[0] = false;
      tempBoard[coord[row]][coord[col]].isSeedable[1] = false;
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
    const newPieces = { ...pieces };
    const playerPieces = [...pieces[activePlayer]];
    const usedPiece = playerPieces.findIndex(
      (piece) => piece.name === selectedPiece.name
    );
    const usedTemplateName = pieces[activePlayer][usedPiece].name;
    const usedTemplateCoords = [...pieces[activePlayer][usedPiece].coords];
    const newPiece = {
      coords: usedTemplateCoords,
      name: usedTemplateName,
      status: "used",
    };
    playerPieces[usedPiece] = newPiece;
    newPieces[activePlayer] = playerPieces;

    setPieces(newPieces);
    setBoard(tempBoard);
    setTurn(turn + 1);
  };

  const determineNextPlayer = () => {
    if (activePlayer === 0) {
      console.log("player 1 is the active player");
      if (retired[1] === true) {
        console.log("player 2 has already retired. Player 1 will play again");
        setSelectedPiece(pieces[0].find((piece) => piece.status != "used"));
      } else {
        console.log("player 2 will play next");
        console.log(pieces[1]);
        setActivePlayer(1);
        setSelectedPiece(pieces[1].find((piece) => piece.status != "used"));
      }
    } else {
      console.log("player 2 is the active player");
      if (retired[0] === true) {
        console.log("player 1 has already retired. Player 2 will play again");
        setSelectedPiece(pieces[1].find((piece) => piece.status != "used"));
      } else {
        console.log("player 1 will play next");
        setActivePlayer(0);
        setSelectedPiece(pieces[0].find((piece) => piece.status != "used"));
      }
    }
  };

  const skipTurn = () => {
    console.log(activePlayer);
    console.log(retired);
    const newRetired = [...retired];
    newRetired[activePlayer] = true;
    setRetired(newRetired);
    setTurn(turn + 1);
  };

  useEffect(() => {
    if (retired[0] == true && retired[1] == true) {
      setGameWon(true);
    }
  }, [retired]);

  useEffect(() => {
    if (turn > 1) {
      determineNextPlayer();
    }
  }, [turn]);

  return (
    <>
      <div className="App">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <ManipulationWindow
              selectedPiece={selectedPiece}
              handleRotation={handleRotation}
              handleReflection={handleReflection}
              activePlayer={activePlayer}
            />
            <PieceBoard
              pieces={pieces[activePlayer]}
              handleSelection={handleSelection}
              activePlayer={activePlayer}
            />
          </div>
          <button className="button" onClick={skipTurn}>
            Retire
          </button>
        </div>
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
      </div>

      {/* {gameWon && <WinnerModal></WinnerModal>} */}
    </>
  );
}

export default App;
