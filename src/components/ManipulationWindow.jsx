import React from "react";
import PieceWrapper from "./PieceWrapper";

const ManipulationWindow = ({
  selectedPiece,
  handleRotation,
  handleReflection,
}) => {
  // console.log(selectedPiece);
  // console.log(`rotate(${selectedRotation * 90})`);
  return (
    <div className="sidewindow">
      ManipulationWindow
      <div className="manipulationwindow">
        <PieceWrapper coords={selectedPiece} />
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleRotation(-1);
        }}
      >
        Rotate Left
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleRotation(1);
        }}
      >
        Rotate Right
      </button>
      <button onClick={(e) => handleReflection("vertical")}>Flip Up</button>
      <button onClick={(e) => handleReflection("horizontal")}>
        Flip Sideways
      </button>
    </div>
  );
};

export default ManipulationWindow;
