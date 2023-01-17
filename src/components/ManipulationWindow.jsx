import React from "react";
import PieceWrapper from "./PieceWrapper";

const ManipulationWindow = ({
  selectedPiece,
  handleRotation,
  handleReflection,
  activePlayer,
}) => {
  return (
    <div className="sidewindow">
      ManipulationWindow
      <div className="manipulationwindow">
        <PieceWrapper
          coords={selectedPiece.coords}
          activePlayer={activePlayer}
        />
      </div>
      <button
        className="button"
        onClick={(e) => {
          e.preventDefault();
          handleRotation(-1);
        }}
      >
        Rotate Left
      </button>
      <button
        className="button"
        onClick={(e) => {
          e.preventDefault();
          handleRotation(1);
        }}
      >
        Rotate Right
      </button>
      <button className="button" onClick={(e) => handleReflection("vertical")}>
        Flip Up
      </button>
      <button
        className="button"
        onClick={(e) => handleReflection("horizontal")}
      >
        Flip Sideways
      </button>
    </div>
  );
};

export default ManipulationWindow;
