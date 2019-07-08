import React from 'react';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import CalendarAccordion from './calendar_accordion';
import CategoryTotals from './category_totals';
import ConfirmApproveModal from './confirm_approve_modal';
import ConfirmDeleteModal from './confirm_delete_modal';
import ConfirmFeaturedModal from './confirm_featured_modal';
import CongratulationsModal from './congratulations_modal';
import Header from './header';
import PointTotals from './point_totals';
import PreviewChallengeModal from './preview_challenge_modal';
import SaveNotification from './save_notification';

function App() {
  const [challenges, setChallenges] = React.useState([]);
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

        setChallenges(records);
        calculateTotalPoints(records);

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
      const newChallenges = [...challenges, record];
      setChallenges(newChallenges);
    });
  }

  function toggleFeaturedChallengeInCalendar(challengeToBeFeatured, isFeatured) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#confirm-modal').modal('hide');
    $('#featured-modal').modal('hide');

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
    const newChallenges = challenges.map(challenge => {
      // find the single featured activity and update it
      if (challenge.id === challengeToBeFeatured.id) {
        challenge.fields['Featured Activity'] = isFeatured ? 'no' : 'yes';
      }
      return challenge;
    });

    setChallenges(newChallenges);
  }

  function deleteChallengeFromCalendar(challengeToBeDeleted) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#confirm-modal').modal('hide');
    $('#featured-modal').modal('hide');

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

    const newChallenges = challenges.filter(challenge => challenge.id !== challengeToBeDeleted.id);
    setChallenges(newChallenges);
  }

  function calculateTotalPoints(calendar) {
    let totalPoints = 0;
    calendar.map(challenge => {
      const points = Number(challenge.fields['Total Points']);
      if (!isNaN(points)) {
        totalPoints += points;
      }
    });
    setTotalPoints(totalPoints);
  }

  function openApproveModal() {
    /* global $ */

    // Hide the other modals
    $('#confirm-modal').modal('hide');
    $('#featured-modal').modal('hide');

    $('#approve-modal').modal();
    $('.modal-body').html('<p>You are accepting that this calendar is complete and ready to be deployed to your site. No changes or edits can be made once approved.</p>');
    $('.modal-footer .btn-primary').html('Accept');

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
        $('.modal-body').html('<p>Your calendar is complete and will be loaded into your site.</p>');
        $('.modal-footer .btn-primary').html('Close');

      });

    });

  }

  function openPreviewChallengeModal(challenge) {
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

    const newChallenges = Array.from(challenges);
    const draggingChallenge = newChallenges.filter(challenge => challenge.id === draggableId)[0];

    const sourcePhase = newChallenges.filter(challenge => challenge.fields['Phase'] === source.droppableId);
    const destinationPhase = newChallenges.filter(challenge => challenge.fields['Phase'] === destination.droppableId);

    // Are we still in the same Phase?
    if (source.droppableId === destination.droppableId) {
      destinationPhase.splice(source.index, 1);
      destinationPhase.splice(destination.index, 0, draggingChallenge);

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
      draggingChallenge.fields['Phase'] = destination.droppableId;

      sourcePhase.splice(source.index, 1);
      destinationPhase.splice(destination.index, 0, draggingChallenge);

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
    const newChallenges = Array.from(challenges);
    setChallenges(newChallenges);
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
        onDragEnd={onDragEnd}
        updateChallenges={updateChallenges}
      />

      <PointTotals totalPoints={totalPoints} />

      <ConfirmFeaturedModal />
      <ConfirmDeleteModal />
      <ConfirmApproveModal />
      <CongratulationsModal />

      <button id="approveButton" type="button" className="btn btn-primary" onClick={openApproveModal}>Approve</button>

      { previewChallenge ? <PreviewChallengeModal challenge={previewChallenge} /> : '' }

    </div>
  );
}

export default App;
