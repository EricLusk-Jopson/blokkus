export const calculateScoresFromPieces = (pieces) => {
  let sum = 0;
  pieces.forEach((piece) => {
    if (piece.status === "used") {
      sum += piece.coords.length;
    }
  });
  return sum;
};
