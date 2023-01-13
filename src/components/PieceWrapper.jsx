import React from "react";
import Piece from "./Piece";

const PieceWrapper = ({ id, coords, status, handleSelection, ...props }) => {
  // console.log(coords);
  return (
    <div
      style={props.style}
      className={`piecewrapper piecewrapper-${status}`}
      id={id}
      onClick={handleSelection}
    >
      <Piece coords={coords} unitLength={16} />
    </div>
  );
};

export default PieceWrapper;
