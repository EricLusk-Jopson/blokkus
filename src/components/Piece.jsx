import React from "react";

const Piece = ({ coords, unitLength }) => {
  const xCoords = new Set();
  const yCoords = new Set();
  coords.forEach((coord) => {
    xCoords.add(Math.abs(coord[0]));
    yCoords.add(Math.abs(coord[1]));
  });
  const xMax = Math.max(...xCoords);
  const yMax = Math.max(...yCoords);
  const xWidth = (xMax + 1) * unitLength;
  const yWidth = (yMax + 1) * unitLength;

  return (
    <div
      className="piececontainer"
      style={{
        width: xWidth,
        height: yWidth,
      }}
    >
      {coords.map((coord) => {
        return (
          <div
            className="piece"
            style={{ left: coord[0] * unitLength, top: coord[1] * unitLength }}
          ></div>
        );
      })}
    </div>
  );
};

export default Piece;
