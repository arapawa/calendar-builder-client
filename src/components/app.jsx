import React, { Component } from 'react';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import Header from './header';
import CalendarAccordion from './calendar_accordion';
import ConfirmDeleteModal from './confirm_delete_modal';
import ConfirmApproveModal from './confirm_approve_modal';
import CongratulationsModal from './congratulations_modal';
import EditChallengeModal from './edit_challenge_modal';
import CategoryTotals from './category_totals';
import PointTotals from './point_totals';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendar: [],
      challenges: [],
      calendarName: '',
      selectedClient: null,
      selectedChallenge: null,
      totalPoints: 0,
      editingChallenge: null,
      editingCalendar: null
    };

    this.addChallengeToCalendar = this.addChallengeToCalendar.bind(this);
    this.deleteChallengeFromCalendar = this.deleteChallengeFromCalendar.bind(this);
    this.selectChallenge = this.selectChallenge.bind(this);
    this.calculateTotalPoints = this.calculateTotalPoints.bind(this);
    this.setEditingChallenge = this.setEditingChallenge.bind(this);
    this.openEditChallengeModal = this.openEditChallengeModal.bind(this);
    this.updateEditingChallenge = this.updateEditingChallenge.bind(this);
    this.openApproveModal = this.openApproveModal.bind(this);
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

      if (calendar) {
        base('Clients').select({
          filterByFormula: `{Limeade e=}='${calendar.fields['client']}'`
        }).eachPage((records, fetchNextPage) => {
          const client = records[0];

          this.setState({
            calendarName: calendar.fields['name'],
            selectedClient: client,
            editingCalendar: calendar
          });

          fetchNextPage();
        }, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }

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
      this.calculateTotalPoints(this.state.calendar);

      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  fetchChallenges() {
    const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appa7mnDuYdgwx2zP');

    base('Challenges').select().eachPage((records, fetchNextPage) => {

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

  selectCalendar(calendar) {
    this.setState({ calendar: calendar });
  }

  calculateTotalPoints(calendar) {
    let totalPoints = 0;
    calendar.map(challenge => {
      const points = Number(challenge.fields['Total Points']);
      if (!isNaN(points)) {
        totalPoints += points;
      }
    });
    this.setState({ totalPoints: totalPoints });
  }

  openApproveModal() {
    /* global $ */
    $('#approve-modal').modal();

    // Handler for the Save button
    $('#approve-modal .modal-footer .btn-primary').off('click');
    $('#approve-modal .modal-footer .btn-primary').click(() => {
      $('#approve-modal').modal('hide');

      const calendar = this.state.editingCalendar;
      calendar.fields.status = 'Approved by Client';

      base('Calendars').replace(calendar.id, calendar.fields, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }

        $('#congratulations-modal').modal();
      });
    });

  }

  openEditChallengeModal() {
    /* global $ */
    $('#edit-challenge-modal').modal();

    // Make sure to clear the editingChallenge when the modal is closed
    $('#edit-challenge-modal').off('hidden.bs.modal');
    $('#edit-challenge-modal').on('hidden.bs.modal', () => {
      this.setState({ editingChallenge: null });
    });

    // Handler for the Save button
    $('.modal-footer .btn-primary').off('click');
    $('.modal-footer .btn-primary').click(() => {
      $('#edit-challenge-modal').modal('hide');
    });
  }

  setEditingChallenge(challenge) {
    this.setState({ editingChallenge: challenge });

    // TODO: Find a better way to handle this problem!
    // I had a meeting at 1p today and this was the best I could do on such short notice
    setTimeout(this.openEditChallengeModal, 200);
  }

  updateEditingChallenge(updatedChallenge) {

    base('Challenges').replace(updatedChallenge.id, updatedChallenge.fields, function(err, record) {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Updated: ', updatedChallenge);
      console.log('Saving updated challenge!');
    });

    // Clear editingChallenge out
    this.setState({ editingChallenge: null });

    // Recalculate total points
    this.calculateTotalPoints(this.state.calendar);

  }

  render() {
    const hash = window.location.hash.slice(2);
    const accountName = this.state.selectedClient ? this.state.selectedClient.fields['Account Name'] : '';

    let totalPoints = 0;
    this.state.calendar.map(challenge => {
      const points = Number(challenge.fields['Total Points']);
      if (!isNaN(points)) {
        totalPoints += points;
      }
    });

    return (
      <div className="app">
        <Header />
        <h2>Edit Calendar</h2>
        <h4 className="client-name my-5">{accountName}</h4>

        <div className="calendar-name-and-link">
          <h4 className="calendar-name">{this.state.calendarName}</h4>
          <CategoryTotals calendar={this.state.calendar} />
        </div>

        <CalendarAccordion
          calendar={this.state.calendar}
          challenges={this.state.challenges}
          selectedClient={this.state.selectedClient}
          selectChallenge={this.selectChallenge}
          selectedChallenge={this.state.selectedChallenge}
          addChallengeToCalendar={this.addChallengeToCalendar}
          deleteChallengeFromCalendar={this.deleteChallengeFromCalendar}
          setEditingChallenge={this.setEditingChallenge} />

        <PointTotals totalPoints={this.state.totalPoints} />

        <ConfirmDeleteModal />
        <ConfirmApproveModal />
        <CongratulationsModal />

        <button id="approveButton" type="button" className="btn btn-primary" onClick={this.openApproveModal}>Approve</button>

        {
          this.state.editingChallenge ?
          <EditChallengeModal
            challenge={this.state.editingChallenge}
            updateEditingChallenge={this.updateEditingChallenge} /> :
          ''
        }

      </div>
    );
  }
}

export default App;
