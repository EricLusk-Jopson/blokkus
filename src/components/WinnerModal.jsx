import React from "react";

const WinnerModal = ({ scores, rematchFnc }) => {
  const getWinningPlayer = (scores) => {
    if (scores[0] === scores[1]) {
      return "Tie Game!";
    } else if (scores[0] > scores[1]) {
      return "Player 1 Wins!";
    } else if (scores[0] < scores[1]) {
      return "Player 2 wins!";
    } else return "Something went wrong";
  };
  const winner = getWinningPlayer(scores);
  return (
    <div className="modal">
      <div className="modal-window">
        <h2>{winner}</h2>
        <p>Thanks for playing. Would you like to have a rematch?</p>
        <button className="rematch-button" onClick={rematchFnc}>
          Rematch
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
