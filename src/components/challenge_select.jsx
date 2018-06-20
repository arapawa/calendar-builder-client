import React, { Component } from 'react';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

class ChallengeSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      searchText: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.addChallenge = this.addChallenge.bind(this);
  }

  handleChange(e) {
    if (e.target.value) {
      this.setState({ open: true, searchText: e.target.value });
    } else {
      this.setState({ open: false, searchText: '' });
    }
  }

  selectChallenge(challenge) {
    const title = challenge.fields.title;
    this.props.selectChallenge(challenge);
    this.setState({ open: false, searchText: title });
  }

  addChallenge() {
    const calendar = this.props.calendar;
    const challenge = this.props.selectedChallenge;
    const employerName = this.props.selectedClient.fields['Limeade e='];
    const startDate = this.props.startDate ? this.props.startDate : moment().format('YYYY-MM-DD');
    const endDate = this.props.endDate ? this.props.endDate : moment().format('YYYY-MM-DD');
    const hash = this.props.selectedCalendar.fields.hash;

    let programYear = moment().format('YYYY');
    if (calendar[0]) {
      programYear = calendar[0].fields['Program Year'];
    }

    if (challenge) {
      base('Challenges').create({
        'Name': challenge.fields.title,
        'Calendar': hash,
        'EmployerName': employerName,
        'Program Year': programYear,
        'Phase': this.props.phase,
        'Start date': startDate,
        'End date': endDate,
        'Required': 'No',
        'Verified': 'No',
        'Team/Ix': 'Individual',
        'Frequency': 'One Time',
        'Points': '0',
        'Total Points': '0',
        'Device Enabled': 'No',
        'HP Element': 'Health & Fitness',
        'Slug': challenge.fields.slug
      }, (err, record) => {
        if (err) {
          console.error(err);
          return;
        }
        this.props.addChallengeToCalendar(record);
      });
      this.setState({ searchText: '' });
    } else if (challenge === null) {
      base('Challenges').create({
        'Name': 'Custom',
        'Calendar': hash,
        'EmployerName': employerName,
        'Program Year': programYear,
        'Phase': this.props.phase,
        'Start date': startDate,
        'End date': endDate,
        'Required': 'No',
        'Verified': 'Custom',
        'Team/Ix': 'Individual',
        'Frequency': 'One Time',
        'Points': '0',
        'Total Points': '0',
        'Device Enabled': 'No',
        'HP Element': 'Health & Fitness',
        'Slug': ''
        }, (err, record) => {
        if (err) {
          console.error(err);
          return;
        }
        this.props.addChallengeToCalendar(record);
      });
      this.setState({ searchText: '' });
      }
  }

  cleanTitle(title) {
    return title
      .replace('2017: ', '').replace('2018: ', '').replace(/&#8217;/g, '\'')
      .replace(/&#8211;/g, '–').replace(/&#038;/g, '&');
  }

  renderChallenge(challenge) {
    const slug = challenge.fields.slug;
    const title = this.cleanTitle(challenge.fields.title);

    return (
      <span className="dropdown-item" key={slug}
        onClick={() => this.selectChallenge(challenge)}>
        {title}
      </span>
    );
  }

  render() {
    const filteredChallenges = this.props.challenges.filter(challenge => {
      const title = this.cleanTitle(challenge.fields.title.toLowerCase());
      const searchText = this.state.searchText.toLowerCase();
      return title.includes(searchText);
    });

    return (
      <div className="challenge-select">
        <div className="dropdown">
          <div className="challenge-search input-group">
            <input value={this.state.searchText} onChange={this.handleChange} type="text" className="challenge-search-box form-control" placeholder="Add Challenge" />
            <span className="oi oi-magnifying-glass"></span>
          </div>

          <div className={'challenge-list dropdown-menu ' + (this.state.open ? 'show' : '')}>
            {filteredChallenges.length ? filteredChallenges.map(challenge => this.renderChallenge(challenge)) : ''}
          </div>
        </div>
        <img className="add-challenge-icon" src="images/icon_add.svg" onClick={this.addChallenge} />
      </div>
    );
  }
}

export default ChallengeSelect;
