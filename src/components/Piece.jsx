import React from "react";

const Piece = ({ coords, unitLength, activePlayer }) => {
  const xCoords = new Set();
  const yCoords = new Set();
  coords.forEach((coord) => {
    yCoords.add(Math.abs(coord[0]));
    xCoords.add(Math.abs(coord[1]));
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
      {coords.map((coord, i) => {
        return (
          <div
            key={i}
            className={`piece piece-${activePlayer}`}
            style={{ left: coord[1] * unitLength, top: coord[0] * unitLength }}
          ></div>
        );
      })}
    </div>
  );
};

export default Piece;
