import React from "react";
import PieceWrapper from "./PieceWrapper";

const ManipulationWindow = ({
  selectedPiece,
  handleRotation,
  handleReflection,
  activePlayer,
}) => {
  const centrePiece = (coordinates) => {
    const xCoords = new Set();
    coordinates.forEach((coord) => xCoords.add(coord[1]));
    const minX = Math.min(...xCoords);
    const matches = coordinates
      .filter((coord) => coord[1] === minX)
      .map((coord) => coord[0]);
    const minY = Math.min(...matches);
    const result = coordinates.map((coord) => [
      coord[0] + Math.abs(minY),
      coord[1] + Math.abs(minX),
    ]);
    return result;
  };

  return (
    <div className="sidewindow">
      ManipulationWindow
      <div className="manipulationwindow">
        <PieceWrapper
          coords={centrePiece(selectedPiece.coords)}
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
