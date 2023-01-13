import React from "react";

const xAxis = 0;
const yAxis = 1;
const rowLength = 14;
const isShaded = 1;

const isValid = (board, activePlayer, shadedCoords, selectedPiece) => {
  // console.log(board, activePlayer, shadedCoords, selectedPiece);
  let tileFitsOnBoard = shadedCoords.length === selectedPiece.length;
  let allPlayable = true;
  let oneSeedable = false;
  shadedCoords.forEach((coord) => {
    let [x, y] = [...coord];
    // console.log(x, y);
    if (!board[y][x].isPlayable[activePlayer]) {
      allPlayable = false;
      return;
    }
    if (board[y][x].isSeedable[activePlayer]) {
      oneSeedable = true;
    }
  });
  // console.log(
  //   selectedPiece,
  //   `tile fits on board: ${tileFitsOnBoard}, all shaded tiles are playable: ${allPlayable}, at least one is seedable: ${oneSeedable}`
  // );
  return tileFitsOnBoard && allPlayable && oneSeedable;
};

const Board = ({
  board,
  shadedTiles,
  shadedCoords,
  selectedPiece,
  activePlayer,
  handleOnMouseEnter,
  handleOnMouseLeave,
}) => {
  // console.log(board);
  // console.log(shadedTiles);
  return (
    <div className="board" onMouseLeave={handleOnMouseLeave}>
      {board.map((row, i) => {
        return (
          <div key={i} className={`row row${i}`}>
            {row.map((tile, j) => {
              // console.log(tile);
              // console.log(tile.id);
              // console.log(tile.isSeedable);
              const isValidTile = isValid(
                board,
                activePlayer,
                shadedCoords,
                selectedPiece
              );

              return (
                <div
                  onMouseEnter={handleOnMouseEnter}
                  id={tile.coords[yAxis] * rowLength + tile.coords[xAxis]}
                  key={tile.coords[yAxis] * rowLength + tile.coords[xAxis]}
                  className={`tile ${
                    tile.isPlayable[activePlayer] ? "playable" : "unplayable"
                  } ${
                    tile.isSeedable[activePlayer] ? "seedable" : "unseedable"
                  } ${
                    shadedTiles[tile.coords[yAxis]][tile.coords[xAxis]] ===
                    isShaded
                      ? `shaded-${isValidTile ? "valid" : "invalid"}`
                      : "unshaded"
                  }`}
                >
                  {tile.isSeedable[activePlayer] && "P"}
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
