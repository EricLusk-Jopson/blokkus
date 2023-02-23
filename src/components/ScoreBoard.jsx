import React from "react";

const ScoreBoard = ({ scores }) => {
  return (
    <div className="scorebox-container">
      <div className="scorebox neon-container">
        {Object.entries(scores).map(([key, value]) => (
          <h1>{`Player ${1 + parseInt(key)}   -  ${value}`}</h1>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;
