import React from 'react';

function AddCustomChallengeButton() {
  // grabbing the calendar hash the lazy way
  const hash = window.location.hash.slice(2);
  const blackburrowUrl = `https://calendarbuilder.dev.adurolife.com/ctrt/#/${hash}`;

  return (
    <div className="add-custom-challenge-button">
      <a href={blackburrowUrl} target="_blank"><button type="button" className="btn btn-outline-info">Create Custom Challenge</button></a>
    </div>
  );
}

export default AddCustomChallengeButton;
