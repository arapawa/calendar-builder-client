import React, { Component } from 'react';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import Header from './header';
import EditCalendar from './edit_calendar';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendar: [],
      challenges: [],
      calendarName: '',
      selectedClient: null,
      selectedChallenge: null
    };

    this.addChallengeToCalendar = this.addChallengeToCalendar.bind(this);
    this.deleteChallengeFromCalendar = this.deleteChallengeFromCalendar.bind(this);
    this.selectChallenge = this.selectChallenge.bind(this);    
  }

  // Make airtable calls when app starts
  componentDidMount() {
    this.fetchAccountName();
    this.fetchCalendar();
    this.fetchChallenges();
  }

  fetchAccountName() {
    const hash = window.location.hash.slice(2);

    base('Calendars').select({
      filterByFormula: `{hash}='${hash}'`
    }).eachPage((records, fetchNextPage) => {
      const calendar = records[0];

      base('Clients').select({
        filterByFormula: `{Limeade e=}='${calendar.fields['client']}'`
      }).eachPage((records, fetchNextPage) => {
        const client = records[0];

        this.setState({
          calendarName: calendar.fields['name'],
          selectedClient: client,
        });

        fetchNextPage();
      }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  fetchCalendar() {
    const hash = window.location.hash.slice(2);

    base('Challenges').select({
      view: 'Default',
      filterByFormula: `{Calendar}='${hash}'`
    }).eachPage((records, fetchNextPage) => {

      this.setState({ calendar: [...this.state.calendar, ...records] });

      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  fetchChallenges() {
    base('LibraryChallenges').select({
      view: 'Default'
    }).eachPage((records, fetchNextPage) => {

      this.setState({ challenges: [...this.state.challenges, ...records] });

      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  addChallengeToCalendar(challenge) {
    const newCalendar = [...this.state.calendar, challenge];
    this.setState({
      calendar: newCalendar,
      selectedChallenge: null
    });
  }

  deleteChallengeFromCalendar(challengeToBeDeleted) {
    const newCalendar = this.state.calendar.filter(challenge => challenge.id !== challengeToBeDeleted.id);
    this.setState({ calendar: newCalendar });
  }

  selectChallenge(challenge) {
    this.setState({ selectedChallenge: challenge });
  }

  render() {
    const hash = window.location.hash.slice(2);
    const accountName = this.state.selectedClient ? this.state.selectedClient.fields['Account Name'] : '';

    return (
      <div className="app">
        <Header />
        <h2>Edit Calendar</h2>
        <h4 className="client-name my-5">{accountName}</h4>

        <div className="calendar-name-and-link">
          <h4 className="calendar-name">{this.state.calendarName}</h4>
          <img className="calendar-link"
            type="image"
            src="images/icon_link.svg"
            data-toggle="tooltip"
            data-placement="bottom"
            title={`<h5 class='my-3'>Link to this Calendar</h5><h5 class='my-3'>http://mywellnessnumbers.sftp.adurolife.com/calendar-builder/#/${hash}</h5>`} />
        </div>

        <EditCalendar
          hash={hash}

          calendar={this.state.calendar}
          challenges={this.state.challenges}
          selectedClient={this.state.selectedClient}

          addChallengeToCalendar={this.addChallengeToCalendar}
          deleteChallengeFromCalendar={this.deleteChallengeFromCalendar}
          selectChallenge={this.selectChallenge}

          selectedCalendar={this.state.selectedCalendar}
          handleDoneClick={this.viewShowCalendars}
          handleEditChallengeClick={this.viewEditChallenge}
          selectedChallenge={this.state.selectedChallenge} />
      </div>
    );
  }
}

export default App;
