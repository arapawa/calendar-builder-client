import React from 'react';

function PointTotals({ totalPoints }) {
  const oneHundredPercent = totalPoints;
  const twentyFivePercent = Math.floor(oneHundredPercent * 0.25);
  const fiftyPercent = Math.floor(oneHundredPercent * 0.5);
  const seventyFivePercent = Math.floor(oneHundredPercent * 0.75);

  return (
    <div className="point-total">
      <h5 className="my-2">Point Totals</h5>
      <div className="percentages">
        <h5 className="my-2">25%: {twentyFivePercent}</h5>
        <h5 className="my-2">50%: {fiftyPercent}</h5>
        <h5 className="my-2">75%: {seventyFivePercent}</h5>
        <h5 className="my-2">100%: {oneHundredPercent} Points</h5>
      </div>
    </div>
  );
}

export default PointTotals;
