import { useEffect, useState } from "react";
import "./App.css";
import PieceBoard from "./components/PieceBoard.jsx";
import Board from "./components/Board.jsx";
import ManipulationWindow from "./components/ManipulationWindow";
import WinnerModal from "./components/WinnerModal";
import { initialPieces } from "./initialStates/initialPieces";
import { newInitalBoard, zeroBoard } from "./initialStates/initialBoard";
import { newZeroBoard } from "./helpers/newZeroBoard";
import ScoreBoard from "./components/ScoreBoard";
import { calculateScoresFromPieces } from "./helpers/calculateScores";

const row = 0;
const col = 1;
const first = 0;
const last = 13;

function App() {
  const [activePlayer, setActivePlayer] = useState(0);
  const [retired, setRetired] = useState([false, false]);
  const [board, setBoard] = useState(newInitalBoard());
  const [pieces, setPieces] = useState({
    0: [...initialPieces],
    1: [...initialPieces],
  });
  const [selectedPiece, setSelectedPiece] = useState({ ...initialPieces[0] });
  const [shadedTiles, setShadedTiles] = useState(newZeroBoard());
  const [shadedCoords, setShadedCoords] = useState([]);
  const [turn, setTurn] = useState(1);
  const [scores, setScores] = useState({ 0: 0, 1: 0 });
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
    // const xMax = Math.max(...xCoords);
    // const yMax = Math.max(...yCoords);
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

  // TODO - Break up this function into helpers
  // For determining playability
  // For determining seedability
  // for updating the board
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
      if (retired[1] === true) {
        setSelectedPiece(pieces[0].find((piece) => piece.status !== "used"));
      } else {
        setActivePlayer(1);
        setSelectedPiece(pieces[1].find((piece) => piece.status !== "used"));
      }
    } else {
      if (retired[0] === true) {
        setSelectedPiece(pieces[1].find((piece) => piece.status !== "used"));
      } else {
        setActivePlayer(0);
        setSelectedPiece(pieces[0].find((piece) => piece.status !== "used"));
      }
    }
  };

  const retire = () => {
    const newRetired = [...retired];
    newRetired[activePlayer] = true;
    setRetired(newRetired);
    setTurn(turn + 1);
  };

  const resetGame = () => {
    setActivePlayer(0);
    setRetired([false, false]);
    setBoard(newInitalBoard());
    setPieces({ 0: [...initialPieces], 1: [...initialPieces] });
    setSelectedPiece({ ...initialPieces[0] });
    setShadedTiles(newZeroBoard());
    setShadedCoords([]);
    setTurn(1);
    setScores({ 0: 0, 1: 0 });
    setGameWon(false);
  };

  useEffect(() => {
    if (retired[0] === true && retired[1] === true) {
      setGameWon(true);
    }
  }, [retired]);

  useEffect(() => {
    if (turn > 1) {
      determineNextPlayer();
    }
  }, [turn]);

  useEffect(() => {
    const newScores = { ...scores };
    Object.entries(pieces).forEach(([key, value]) => {
      newScores[key] = calculateScoresFromPieces(value);
    });
    setScores(newScores);
  }, [pieces]);

  return (
    <>
      <div className="App">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "35vw",
            justifyContent: "space-around",
          }}
        >
          <div style={{ display: "inline-flex", position: "relative" }}>
            <ScoreBoard scores={scores} />
            <button className="button-retire" onClick={retire}>
              Retire
            </button>
          </div>

          <div
            className={`neon-container-${activePlayer}`}
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "40px",
            }}
          >
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

      {gameWon && <WinnerModal scores={scores} rematchFnc={resetGame} />}
    </>
  );
}

export default App;
