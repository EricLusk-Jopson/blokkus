import React from "react";
import Piece from "./Piece";

const PieceWrapper = ({
  id,
  coords,
  status,
  handleSelection,
  activePlayer,
  ...props
}) => {
  return (
    <div
      style={props.style}
      className={`piecewrapper piecewrapper-${status}`}
      id={id}
      onClick={handleSelection}
      // player={activePlayer}
    >
      <Piece coords={coords} unitLength={16} activePlayer={activePlayer} />
    </div>
  );
};

export default PieceWrapper;
