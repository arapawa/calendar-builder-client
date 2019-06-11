import React, { Component } from 'react';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import Header from './header';
import CalendarAccordion from './calendar_accordion';
import ConfirmDeleteModal from './confirm_delete_modal';
import ConfirmApproveModal from './confirm_approve_modal';
import CongratulationsModal from './congratulations_modal';
import PreviewChallengeModal from './preview_challenge_modal';
import CategoryTotals from './category_totals';
import PointTotals from './point_totals';
import SaveNotification from './save_notification';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      challenges: [],
      selectedClient: null,
      selectedCalendar: null,
      calendarName: '',
      totalPoints: 0,
      previewChallenge: null
    };

    this.addChallengeToCalendar = this.addChallengeToCalendar.bind(this);
    this.deleteChallengeFromCalendar = this.deleteChallengeFromCalendar.bind(this);
    this.calculateTotalPoints = this.calculateTotalPoints.bind(this);
    this.openApproveModal = this.openApproveModal.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  // Make airtable calls when app starts
  componentDidMount() {
    this.fetchAccountName();
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
            selectedCalendar: calendar
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

  fetchChallenges() {
    const hash = window.location.hash.slice(2);

    base('Challenges').select({
      view: 'Default',
      filterByFormula: `{Calendar}='${hash}'`
    }).eachPage((records, fetchNextPage) => {

      this.setState({ challenges: [...this.state.challenges, ...records] });
      this.calculateTotalPoints(this.state.challenges);

      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  addChallengeToCalendar(challengeName, phaseTitle) {
    const hash = this.state.selectedCalendar.fields['hash'];
    const employerName = this.state.selectedClient.fields['Limeade e='];
    const programYear = this.state.selectedCalendar.fields['year'];

    // Make update in Airtable
    base('Challenges').create({
      'Title': challengeName,
      'Calendar': hash,
      'EmployerName': employerName,
      'Program Year': programYear,
      'Phase': phaseTitle,
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

      const newCalendar = [...this.state.challenges, record];

      this.setState({ challenges: newCalendar });
    });
  }

  deleteChallengeFromCalendar(challengeToBeDeleted) {
    // Hide the ConfirmModal
    $('#confirm-modal').modal('hide');

    // Make update in Airtable
    base('Challenges').destroy(challengeToBeDeleted.id, (err, deletedRecord) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    const newCalendar = this.state.challenges.filter(challenge => challenge.id !== challengeToBeDeleted.id);

    this.setState({ challenges: newCalendar });
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

    // Handler for the Accept button
    $('#approve-modal .modal-footer .btn-primary').off('click');
    $('#approve-modal .modal-footer .btn-primary').click(() => {
      $('#approve-modal').modal('hide');

      const calendar = this.state.selectedCalendar;
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

  setPreviewChallenge(challenge) {
    this.setState({ previewChallenge: challenge });

    // Open the preview challenge modal
    setTimeout(() => {
      $('#editChallengeModal').modal();
    }, 250);
  }

  editCalendarName(event) {
    const calendarName = this.state.calendarName;

    let h4 = event.target;
    h4.innerHTML = `<input type="text" class="form-control" id="editingCalendarName" value="${calendarName}" />`;

    // Since autofocus wasn't working, focus using jquery
    $('#editingCalendarName').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingCalendarName').blur((event) => {
      if (calendarName === event.target.value) {
        h4.innerHTML = `${calendarName}`;
      } else {
        this.setState({ calendarName: event.target.value });

        // Update airtable w/ the changes
        base('Calendars').update(this.state.selectedCalendar.id, {
          'name': this.state.calendarName
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
    });

    // Supports the user hitting the Enter key or otherwise triggering the change without blurring
    $('#editingCalendarName').change((event) => {
      this.setState({ calendarName: event.target.value });

      // Update airtable w/ the changes
      base('Calendars').update(this.state.selectedCalendar.id, {
        'name': this.state.calendarName
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  }

  onDragEnd(result) {
    const { source, destination, draggableId } = result;

    const newCalendar = Array.from(this.state.challenges);
    const draggingChallenge = newCalendar.filter(challenge => challenge.id === draggableId)[0];

    const sourcePhase = newCalendar.filter(challenge => challenge.fields['Phase'] === source.droppableId);
    const destinationPhase = newCalendar.filter(challenge => challenge.fields['Phase'] === destination.droppableId);

    // Are we still in the same Phase?
    if (source.droppableId === destination.droppableId) {
      destinationPhase.splice(source.index, 1);
      destinationPhase.splice(destination.index, 0, draggingChallenge);

      destinationPhase.map((challenge, index) => {
        challenge.fields['Index'] = index;

        // Make update to Airtable
        base('Challenges').update(challenge.id, {
          'Index': index
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
    } else { // We're moving from one phase to another
      draggingChallenge.fields['Phase'] = destination.droppableId;

      sourcePhase.splice(source.index, 1);
      destinationPhase.splice(destination.index, 0, draggingChallenge);

      sourcePhase.map((challenge, index) => {
        challenge.fields['Index'] = index;

        // Make update to Airtable
        base('Challenges').update(challenge.id, {
          'Index': index
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
        });
      });

      destinationPhase.map((challenge, index) => {
        challenge.fields['Index'] = index;

        if (challenge.id === draggableId) {
          base('Challenges').update(challenge.id, {
            'Index': index,
            'Phase': destination.droppableId
          }, function(err, record) {
            if (err) {
              console.error(err);
              return;
            }
          });
        } else {
          base('Challenges').update(challenge.id, {
            'Index': index
          }, function(err, record) {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
    }

    // Update the state to render the changes
    this.setState({ calendar: newCalendar });
  }

  render() {
    const hash = window.location.hash.slice(2);
    const accountName = this.state.selectedClient ? this.state.selectedClient.fields['Account Name'] : '';
    const calendarName = this.state.calendarName;

    return (
      <div className="app">
        <SaveNotification />
        <Header />
        <h2>Edit Calendar</h2>
        <h4 className="client-name my-5">{accountName}</h4>

        <div className="calendar-name-and-link">
          <h4 className="calendar-name" onDoubleClick={(e) => this.editCalendarName(e, calendarName)}>{calendarName}</h4>
          <CategoryTotals calendar={this.state.challenges} />
        </div>

        <CalendarAccordion
          calendarChallenges={this.state.challenges}
          selectedClient={this.state.selectedClient}
          addChallengeToCalendar={this.addChallengeToCalendar}
          setPreviewChallenge={this.setPreviewChallenge.bind(this)}
          deleteChallengeFromCalendar={this.deleteChallengeFromCalendar}
          onDragEnd={this.onDragEnd}
        />

        <PointTotals totalPoints={this.state.totalPoints} />

        <ConfirmDeleteModal />
        <ConfirmApproveModal />
        <CongratulationsModal />

        <button id="approveButton" type="button" className="btn btn-primary" onClick={this.openApproveModal}>Approve</button>

        { this.state.previewChallenge ? <PreviewChallengeModal challenge={this.state.previewChallenge} /> : '' }

      </div>
    );
  }
}

export default App;
