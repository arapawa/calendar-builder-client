import React from 'react';

function CustomTotals({ challenges }) {
  let netNewTotal = 0;
  let rerunTotal = 0;
  let revisedTotal = 0;

  for (let phase in challenges) {
    challenges[phase].map(challenge => {
      switch (challenge.fields['Custom Tile Type']) {
        case 'Net New':
          netNewTotal += 1;
          break;
        case 'Rerun':
          rerunTotal += 1;
          break;
        case 'Revised':
          revisedTotal += 1;
          break;
      }
    });
  }

  return (
    <div id="customTotals">
      <h5>Custom Content Totals</h5>
      <span className="badge custom-badge-netnew">Net New</span>
      <span>{netNewTotal}</span>
      <span className="badge custom-badge-rerun">Rerun</span>
      <span>{rerunTotal}</span>
      <span className="badge custom-badge-revised">Revised</span>
      <span>{revisedTotal}</span>
    </div>
  );
}

export default CustomTotals;
