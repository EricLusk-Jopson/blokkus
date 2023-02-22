import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
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
    <div className="manipulation-window">
      <div className="manipulation-box">
        <PieceWrapper
          coords={centrePiece(selectedPiece.coords)}
          activePlayer={activePlayer}
        />
      </div>
      <div className="manipulation-button-wrapper">
        <button
          className="manipulation-button"
          onClick={(e) => {
            e.preventDefault();
            handleRotation(-1);
          }}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button
          className="manipulation-button"
          onClick={(e) => {
            e.preventDefault();
            handleRotation(1);
          }}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
        <button
          className="manipulation-button"
          onClick={(e) => handleReflection("vertical")}
        >
          {"—"}
        </button>
        <button
          className="manipulation-button"
          onClick={(e) => handleReflection("horizontal")}
        >
          {"|"}
        </button>
      </div>
    </div>
  );
};

export default ManipulationWindow;
