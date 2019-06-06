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
    const calendar = this.props.calendar;
    const employerName = this.props.selectedClient.fields['Limeade e='];

    let programYear = moment().format('YYYY');
    if (calendar[0]) {
      programYear = calendar[0].fields['Program Year'];
    }

    const hash = window.location.hash.slice(2);

    base('Challenges').create({
      'Title': this.state.challengeName,
      'Calendar': hash,
      'EmployerName': employerName,
      'Program Year': programYear,
      'Phase': this.props.phaseTitle,
      'Start date': moment().format('YYYY-MM-DD'),
      'End date': moment().format('YYYY-MM-DD'),
      'Verified': 'Custom',
      'Team Activity': 'no',
      'Reward Occurrence': 'One Time',
      'Points': '0',
      'Total Points': '0',
      'Device Enabled': 'No',
      'Category': 'Health and Fitness',
      'Challenge Id': ''
    }, (err, record) => {
      if (err) {
        console.error(err);
        return;
      }
      this.props.addChallengeToCalendar(record);
    });

    this.setState({ challengeName: '' });

  }

  handleChange(e) {
    this.setState({ challengeName: e.target.value });
  }

  render() {
    return (
      <div className="add-custom-challenge">
        <input className="form-control" type="text" value={this.state.challengeName} onChange={(e) => this.handleChange(e)} placeholder="Add Custom Challenge" />
        <img className="add-challenge-icon" src="images/icon_add.svg" onClick={(e) => this.addChallenge(e)} />
      </div>
    );
  }
}

export default AddCustomChallenge;
