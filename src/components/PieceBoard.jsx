import React from "react";
import PieceWrapper from "./PieceWrapper";

const PieceBoard = ({ pieces, handleSelection, activePlayer }) => {
  return (
    <div className="sidewindow">
      <div className="pieces">
        {pieces.map((piece, i) => {
          return (
            <PieceWrapper
              key={i}
              id={i}
              coords={piece.coords}
              status={piece.status}
              handleSelection={(e) => handleSelection(e, piece.status)}
              activePlayer={activePlayer}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PieceBoard;
