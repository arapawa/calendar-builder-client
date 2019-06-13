import React from 'react';

function AddCustomChallenge({ phaseTitle, addChallengeToCalendar }) {
  const [challengeName, setChallengeName] = React.useState('');

  function addChallenge() {
    addChallengeToCalendar(challengeName, phaseTitle);
    setChallengeName('');
  }

  function handleChange(event) {
    setChallengeName(event.target.value);
  }

  return (
    <div className="add-custom-challenge">
      <input className="form-control" type="text" value={challengeName} onChange={handleChange} placeholder="Add Custom Challenge" />
      <img className="add-challenge-icon" src="images/icon_add.svg" onClick={addChallenge} />
    </div>
  );
}

export default AddCustomChallenge;
