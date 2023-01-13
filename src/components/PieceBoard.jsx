import React from "react";
import PieceWrapper from "./PieceWrapper";

const PieceBoard = ({ pieces, handleSelection }) => {
  // console.log(pieces);
  return (
    <div className="sidewindow">
      <h2>Piece Board</h2>
      <div className="pieces">
        {pieces.map((piece, i) => {
          // console.log(piece);
          // console.log(piece.coords);
          return (
            <PieceWrapper
              key={i}
              id={i}
              coords={piece.coords}
              status={piece.status}
              handleSelection={handleSelection}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PieceBoard;
