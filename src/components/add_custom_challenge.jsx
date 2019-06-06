import React, { Component } from 'react';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

class AddCustomChallenge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      challengeName: ''
    };
  }

  addChallenge() {
    this.props.addChallengeToCalendar(this.state.challengeName, this.props.phaseTitle);
    this.setState({ challengeName: '' });
  }

  handleChange(e) {
    this.setState({ challengeName: e.target.value });
  }

  render() {
    return (
      <div className="add-custom-challenge">
        <input className="form-control" type="text" value={this.state.challengeName} onChange={(e) => this.handleChange(e)} placeholder="Add Custom Challenge" />
        <img className="add-challenge-icon" src="images/icon_add.svg" onClick={() => this.addChallenge()} />
      </div>
    );
  }
}

export default AddCustomChallenge;
