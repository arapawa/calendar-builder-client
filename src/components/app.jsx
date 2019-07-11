import React from 'react';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');
import cloneDeep from 'lodash.clonedeep';

import CalendarAccordion from './calendar_accordion';
import CategoryTotals from './category_totals';
import ConfirmApproveModal from './confirm_approve_modal';
import ConfirmDeleteModal from './confirm_delete_modal';
import ConfirmDuplicateModal from './confirm_duplicate_modal';
import ConfirmFeaturedModal from './confirm_featured_modal';
import CongratulationsModal from './congratulations_modal';
import Header from './header';
import PointTotals from './point_totals';
import PreviewChallengeModal from './preview_challenge_modal';
import SaveNotification from './save_notification';

function App() {
  const [challenges, setChallenges] = React.useState({});
  const [selectedClient, setSelectedClient] = React.useState(null);
  const [selectedCalendar, setSelectedCalendar] = React.useState(null);
  const [calendarName, setCalendarName] = React.useState('');
  const [totalPoints, setTotalPoints] = React.useState(0);
  const [previewChallenge, setPreviewChallenge] = React.useState(null);

  // Make airtable calls when app starts
  React.useEffect(() => {
    const hash = window.location.hash.slice(2);

    const fetchChallenges = () => {

      base('Challenges').select({
        view: 'Default',
        filterByFormula: `{Calendar}='${hash}'`
      }).eachPage((records, fetchNextPage) => {

        const phasedChallenges = {
          'Yearlong': records.filter(record => record.fields['Phase'] === 'Yearlong'),
          'Phase 1': records.filter(record => record.fields['Phase'] === 'Phase 1'),
          'Phase 2': records.filter(record => record.fields['Phase'] === 'Phase 2'),
          'Phase 3': records.filter(record => record.fields['Phase'] === 'Phase 3'),
          'Phase 4': records.filter(record => record.fields['Phase'] === 'Phase 4')
        };

        setChallenges(phasedChallenges);
        calculateTotalPoints(phasedChallenges);

        fetchNextPage();
      }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    };

    const fetchAccountName = () => {

      base('Calendars').select({
        filterByFormula: `{hash}='${hash}'`
      }).eachPage((records, fetchNextPage) => {
        const calendar = records[0];

        if (calendar) {
          base('Clients').select({
            filterByFormula: `{Limeade e=}='${calendar.fields['client']}'`
          }).eachPage((records, fetchNextPage) => {
            const client = records[0];

            setSelectedCalendar(calendar);
            setCalendarName(calendar.fields['name']);
            setSelectedClient(client);

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
    };

    fetchChallenges();
    fetchAccountName();

  }, []); // Pass empty array to only run once on mount

  function updateCalendarUpdated() {
    base('Calendars').update(selectedCalendar.id, {
      'updated': moment().format('l')
    }, function(err, record) {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  function addChallengeToCalendar(challengeName, phaseTitle) {
    // Make update in Airtable
    base('Challenges').create({
      'Title': challengeName,
      'Calendar': selectedCalendar.fields['hash'],
      'EmployerName': selectedClient.fields['Limeade e='],
      'Phase': phaseTitle,
      'Start date': moment().format('YYYY-MM-DD'),
      'End date': moment().format('YYYY-MM-DD'),
      'Verified': 'Custom',
      'Team Activity': 'no',
      'Reward Occurrence': 'Once',
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
      updateCalendarUpdated();
      const newChallenges = cloneDeep(challenges);
      newChallenges[phaseTitle] = [...newChallenges[phaseTitle], record];
      console.log(newChallenges);
      setChallenges(newChallenges);
    });
  }

  function toggleFeaturedChallengeInCalendar(challengeToBeFeatured, isFeatured) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#confirm-modal').modal('hide');
    $('#featured-modal').modal('hide');
    $('#duplicate-modal').modal('hide');

    // Make update in Airtable
    $('#saveNotification').show().html('Saving...');
    base('Challenges').update(challengeToBeFeatured.id, {
      'Featured Activity': isFeatured ? 'no' : 'yes'
    }, function(err, record) {
      if (err) {
        console.error(err);
        return;
      }
      updateCalendarUpdated();
      $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
    });

    // Update the state to render the changes
    let newChallenges = cloneDeep(challenges);
    for (let phase in newChallenges) {
      newChallenges[phase].map(challenge => {
        // find the single featured activity and update it
        if (challenge.id === challengeToBeFeatured.id) {
          challenge.fields['Featured Activity'] = isFeatured ? 'no' : 'yes';
        }
        return challenge;
      });
    }

    setChallenges(newChallenges);
  }

  function deleteChallengeFromCalendar(challengeToBeDeleted) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#confirm-modal').modal('hide');
    $('#featured-modal').modal('hide');
    $('#duplicate-modal').modal('hide');

    // Make update in Airtable
    $('#saveNotification').show().html('Saving...');
    base('Challenges').destroy(challengeToBeDeleted.id, (err, deletedRecord) => {
      if (err) {
        console.error(err);
        return;
      }
      updateCalendarUpdated();
      $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
    });

    const newChallenges = cloneDeep(challenges);
    for (let phase in newChallenges) {
      newChallenges[phase] = newChallenges[phase].filter(challenge => challenge.id !== challengeToBeDeleted.id);
    }
    
    setChallenges(newChallenges);
  }

  function duplicateChallengeInCalendar(challengeToBeDuplicated) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#confirm-modal').modal('hide');
    $('#featured-modal').modal('hide');
    $('#duplicate-modal').modal('hide');

    const phaseTitle = challengeToBeDuplicated.fields['Phase'];
    const newIndex = challenges[phaseTitle].filter(challenge => challenge.fields['Phase'] === challengeToBeDuplicated.fields['Phase']).length;

    // Make update in Airtable
    $('#saveNotification').show().html('Saving...');
    base('Challenges').create({
      'Title': challengeToBeDuplicated.fields['Title'],
      'Calendar': challengeToBeDuplicated.fields['Calendar'],
      'EmployerName': challengeToBeDuplicated.fields['EmployerName'],
      'Phase': phaseTitle,
      'Start date': challengeToBeDuplicated.fields['Start date'],
      'End date': challengeToBeDuplicated.fields['End date'],
      'Verified': challengeToBeDuplicated.fields['Verified'],
      'Team Activity': challengeToBeDuplicated.fields['Team Activity'],
      'Team Size Minimum': challengeToBeDuplicated.fields['Team Size Minimum'],
      'Team Size Maximum': challengeToBeDuplicated.fields['Team Size Maximum'],
      'Reward Occurrence': challengeToBeDuplicated.fields['Reward Occurrence'],
      'Points': challengeToBeDuplicated.fields['Points'],
      'Total Points': challengeToBeDuplicated.fields['Total Points'],
      'Device Enabled': challengeToBeDuplicated.fields['Device Enabled'],
      'Category': challengeToBeDuplicated.fields['Category'],
      'Challenge Id': challengeToBeDuplicated.fields['Challenge Id'],
      'Activity Tracking Type': challengeToBeDuplicated.fields['Activity Tracking Type'],
      'Activity Goal': challengeToBeDuplicated.fields['Activity Goal'],
      'Activity Goal Text': challengeToBeDuplicated.fields['Activity Goal Text'],
      'Device Units': challengeToBeDuplicated.fields['Device Units'],
      'Header Image': challengeToBeDuplicated.fields['Header Image'],
      'Instructions': challengeToBeDuplicated.fields['Instructions'],
      'More Information Html': challengeToBeDuplicated.fields['More Information Html'],
      'Featured Activity': 'no',
      'Index': newIndex
    }, (err, record) => {
      if (err) {
        console.error(err);
        return;
      }
      updateCalendarUpdated();
      const newChallenges = cloneDeep(challenges);
      newChallenges[phaseTitle] = [...newChallenges[phaseTitle], record];
      setChallenges(newChallenges);
      $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
    });
  }

  function calculateTotalPoints(calendar) {
    let totalPoints = 0;

    for (let phase in calendar) {
      calendar[phase].map(challenge => {
        const points = Number(challenge.fields['Total Points']);
        if (!isNaN(points)) {
          totalPoints += points;
        }
      });
    }

    setTotalPoints(totalPoints);
  }

  function openApproveModal() {
    /* global $ */

    // Hide the other modals
    $('#confirm-modal').modal('hide');
    $('#featured-modal').modal('hide');
    $('#duplicate-modal').modal('hide');

    $('#approve-modal').modal();
    $('#approve-modal .modal-body').html('<p>You are accepting that this calendar is complete and ready to be deployed to your site. No changes or edits can be made once approved.</p>');
    $('#approve-modal .modal-footer .btn-primary').html('Accept');

    // Handler for the Accept button
    $('#approve-modal .modal-footer .btn-primary').off('click');
    $('#approve-modal .modal-footer .btn-primary').click(() => {
      $('#approve-modal').modal('hide');

      selectedCalendar.fields['status'] = 'Approved by Client';
      selectedCalendar.fields['approved'] = moment().format('l');

      $('#saveNotification').show().html('Saving...');

      // Update airtable w/ the changes
      base('Calendars').update(selectedCalendar.id, {
        'status': 'Approved by Client',
        'approved': moment().format('l')
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }

        $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);

        $('#congratulations-modal').modal();
        $('#congratulations-modal .modal-body').html('<p>Your calendar is complete and will be loaded into your site.</p>');
        $('#congratulations-modal .modal-footer .btn-primary').html('Close');
        $('#congratulations-modal .modal-footer .btn-primary').off('click');

      });

    });

  }

  function openPreviewChallengeModal(challenge) {
    // Hide the other modals
    $('#confirm-modal').modal('hide');
    $('#featured-modal').modal('hide');
    $('#approve-modal').modal('hide');
    $('#duplicate-modal').modal('hide');

    setPreviewChallenge(challenge);

    // Open the preview challenge modal
    setTimeout(() => {
      $('#editChallengeModal').modal();
    }, 250);
  }

  function editCalendarName(event) {
    let h4 = event.target;
    h4.innerHTML = `<input type="text" class="form-control" id="editingCalendarName" value="${calendarName}" />`;

    // Since autofocus wasn't working, focus using jquery
    $('#editingCalendarName').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingCalendarName').blur((event) => {
      if (calendarName === event.target.value) {
        h4.innerHTML = `${calendarName}`;
      } else {
        setCalendarName(event.target.value);

        // Update airtable w/ the changes
        $('#saveNotification').show().html('Saving...');
        base('Calendars').update(selectedCalendar.id, {
          'name': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          updateCalendarUpdated();
          $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
        });
      }
    });

    // Supports the user hitting the Enter key or otherwise triggering the change without blurring
    $('#editingCalendarName').change((event) => {
      setCalendarName(event.target.value);

      // Update airtable w/ the changes
      $('#saveNotification').show().html('Saving...');
      base('Calendars').update(selectedCalendar.id, {
        'name': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        updateCalendarUpdated();
        $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
      });
    });
  }

  function onDragEnd(result) {

    const { source, destination, draggableId } = result;

    // clone the challenges object
    const newChallenges = cloneDeep(challenges);

    const sourcePhase = newChallenges[source.droppableId];
    const destinationPhase = newChallenges[destination.droppableId];

    // Are we still in the same Phase?
    if (source.droppableId === destination.droppableId) {

      const [removed] = destinationPhase.splice(source.index, 1);
      destinationPhase.splice(destination.index, 0, removed);

      destinationPhase.map((challenge, index) => {
        challenge.fields['Index'] = index;

        // Make update to Airtable
        $('#saveNotification').show().html('Saving...');
        base('Challenges').update(challenge.id, {
          'Index': index
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          updateCalendarUpdated();
          $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
        });
      });

    } else { // We're moving from one phase to another

      const [removed] = sourcePhase.splice(source.index, 1);
      removed.fields['Phase'] = destination.droppableId;
      destinationPhase.splice(destination.index, 0, removed);

      sourcePhase.map((challenge, index) => {
        challenge.fields['Index'] = index;

        // Make update to Airtable
        $('#saveNotification').show().html('Saving...');
        base('Challenges').update(challenge.id, {
          'Index': index
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          updateCalendarUpdated();
          $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
        });
      });

      destinationPhase.map((challenge, index) => {
        challenge.fields['Index'] = index;

        if (challenge.id === draggableId) {
          $('#saveNotification').show().html('Saving...');
          base('Challenges').update(challenge.id, {
            'Index': index,
            'Phase': destination.droppableId
          }, function(err, record) {
            if (err) {
              console.error(err);
              return;
            }
            updateCalendarUpdated();
            $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
          });
        } else {
          $('#saveNotification').show().html('Saving...');
          base('Challenges').update(challenge.id, {
            'Index': index
          }, function(err, record) {
            if (err) {
              console.error(err);
              return;
            }
            updateCalendarUpdated();
            $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
          });
        }
      });
    }

    // Update the state to render the changes
    setChallenges(newChallenges);
  }

  function updateChallenges() {
    const newChallenges = cloneDeep(challenges);
    setChallenges(newChallenges);
    calculateTotalPoints(newChallenges);
  }

  const accountName = selectedClient ? selectedClient.fields['Account Name'] : '';

  return (
    <div className="app">
      <SaveNotification />
      <Header />
      <h2>Edit Calendar</h2>
      <h4 className="client-name my-5">{accountName}</h4>

      <div className="calendar-name-and-link">
        <h4 className="calendar-name" onDoubleClick={(e) => editCalendarName(e, calendarName)}>{calendarName}</h4>
        <CategoryTotals challenges={challenges} />
      </div>

      <CalendarAccordion
        calendarChallenges={challenges}
        selectedClient={selectedClient}
        selectedCalendar={selectedCalendar}
        addChallengeToCalendar={addChallengeToCalendar}
        openPreviewChallengeModal={openPreviewChallengeModal}
        toggleFeaturedChallengeInCalendar={toggleFeaturedChallengeInCalendar}
        deleteChallengeFromCalendar={deleteChallengeFromCalendar}
        duplicateChallengeInCalendar={duplicateChallengeInCalendar}
        onDragEnd={onDragEnd}
        updateChallenges={updateChallenges}
      />

      <PointTotals totalPoints={totalPoints} />

      <ConfirmFeaturedModal />
      <ConfirmDeleteModal />
      <ConfirmDuplicateModal />
      <ConfirmApproveModal />
      <CongratulationsModal />

      <button id="approveButton" type="button" className="btn btn-primary" onClick={openApproveModal}>Approve</button>

      { previewChallenge ? <PreviewChallengeModal challenge={previewChallenge} /> : '' }

    </div>
  );
}

export default App;
