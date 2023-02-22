import React from "react";

const ScoreBoard = ({ scores }) => {
  return (
    <div className="scorebox">
      {Object.entries(scores).map(([key, value]) => (
        <h1>{`Player ${1 + parseInt(key)}   -  ${value}`}</h1>
      ))}
    </div>
  );
};

export default ScoreBoard;
