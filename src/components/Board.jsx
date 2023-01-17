import React from "react";

const rowLength = 14;
const isShaded = 1;

const isValid = (board, activePlayer, shadedCoords, selectedPiece) => {
  let tileFitsOnBoard = shadedCoords.length === selectedPiece.coords.length;
  let allPlayable = true;
  let oneSeedable = false;
  shadedCoords.forEach((coord) => {
    let [y, x] = [...coord];
    if (!board[y][x].isPlayable[activePlayer]) {
      allPlayable = false;
      return;
    }
    if (board[y][x].isSeedable[activePlayer]) {
      oneSeedable = true;
    }
  });

  return tileFitsOnBoard && allPlayable && oneSeedable;
};

const Board = ({
  board,
  shadedTiles,
  shadedCoords,
  selectedPiece,
  activePlayer,
  turn,
  handleOnMouseEnter,
  handleOnMouseLeave,
  handlePlay,
}) => {
  return (
    <div className="board" onMouseLeave={handleOnMouseLeave}>
      {board.map((row, i) => {
        return (
          <div key={i} className={`row row${i}`}>
            {row.map((tile, j) => {
              const isValidTile = isValid(
                board,
                activePlayer,
                shadedCoords,
                selectedPiece
              );

              return (
                <div
                  onMouseEnter={handleOnMouseEnter}
                  onClick={(e) => handlePlay(e, isValidTile)}
                  id={tile.coords[0] * rowLength + tile.coords[1]}
                  key={tile.coords[0] * rowLength + tile.coords[1]}
                  className={`tile tile-${tile.occupant}
                  ${
                    tile.isPlayable[activePlayer] ? "playable" : "unplayable"
                  } ${
                    tile.isSeedable[activePlayer] ? "seedable" : "unseedable"
                  } ${
                    shadedTiles[tile.coords[0]][tile.coords[1]] === isShaded
                      ? `shaded-${isValidTile ? "valid" : "invalid"}`
                      : "unshaded"
                  }`}
                >
                  {tile.isSeedable[activePlayer] &&
                    (turn === 1 || turn === 2) &&
                    "*"}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
