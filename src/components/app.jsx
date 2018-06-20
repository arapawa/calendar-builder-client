import React, { Component } from 'react';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import ShowCalendars from './show_calendars';
import AddCalendar from './add_calendar';
import EditCalendar from './edit_calendar';
import EditChallenge from './edit_challenge';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'ShowCalendars',
      clients: [],
      selectedClient: null,
      selectedCalendar: null,
      selectedChallenge: null,
      programYear: null
    };

    this.selectClient = this.selectClient.bind(this);
    this.selectCalendar = this.selectCalendar.bind(this);
    this.selectChallenge = this.selectChallenge.bind(this);
    this.viewShowCalendars = this.viewShowCalendars.bind(this);
    this.viewAddCalendar = this.viewAddCalendar.bind(this);
    this.viewEditCalendar = this.viewEditCalendar.bind(this);
    this.viewEditChallenge = this.viewEditChallenge.bind(this);
    this.setProgramYear = this.setProgramYear.bind(this);
  }

  // When app starts, fetch clients and set initial view
  componentDidMount() {
    this.fetchClients();
  }

  fetchClients() {
    base('Clients').select().eachPage((records, fetchNextPage) => {

      this.setState({ clients: [...this.state.clients, ...records] });

      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  selectClient(client) {
    this.setState({ selectedClient: client });
  }

  selectCalendar(calendar) {
    this.setState({ selectedCalendar: calendar });
  }

  selectChallenge(challenge) {
    this.setState({ selectedChallenge: challenge });
  }

  setProgramYear(year) {
    this.setState({ programYear: year });
  }

  renderView(view) {
    switch (view) {
      case 'ShowCalendars':
        return (
          <ShowCalendars
            clients={this.state.clients}
            selectedClient={this.state.selectedClient}
            selectClient={this.selectClient}
            selectCalendar={this.selectCalendar}
            handleEditClick={this.viewEditCalendar}
            handleAddClick={this.viewAddCalendar}
            setProgramYear={this.setProgramYear} />
        );
      case 'AddCalendar':
        return (
          <AddCalendar
            selectedClient={this.state.selectedClient}
            handleCancelClick={this.viewShowCalendars}
            handleNextClick={this.viewEditCalendar}
            setProgramYear={this.setProgramYear}
            selectCalendar={this.selectCalendar} />
        );
      case 'EditCalendar':
        return (
          <EditCalendar
            selectedClient={this.state.selectedClient}
            selectedCalendar={this.state.selectedCalendar}
            programYear={this.state.programYear}
            handleDoneClick={this.viewShowCalendars}
            handleEditChallengeClick={this.viewEditChallenge}
            selectChallenge={this.selectChallenge}
            selectedChallenge={this.state.selectedChallenge} />
        );
      case 'EditChallenge':
        return (
          <EditChallenge
            selectedChallenge={this.state.selectedChallenge}
            handleCancelClick={this.viewEditCalendar} />
        );
    }
  }

  viewShowCalendars() {
    this.setState({ view: 'ShowCalendars' });
  }

  viewAddCalendar() {
    this.setState({ view: 'AddCalendar' });
  }

  viewEditCalendar() {
    this.setState({ view: 'EditCalendar' });
  }

  viewEditChallenge() {
    this.setState({ view: 'EditChallenge' });
  }

  render() {
    return (
      <div className="app">
        {this.renderView(this.state.view)}
      </div>
    );
  }
}

export default App;
