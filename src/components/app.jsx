import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import CalendarAccordion from './calendar_accordion';
import CustomTotals from './custom_totals';
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

function reducer(state, action) {
  let newChallenges;
  switch (action.type) {
    case 'addChallenges':
      newChallenges = _.cloneDeep(state);
      newChallenges['Yearlong'] = [...newChallenges['Yearlong'], ...action.payload.filter(record => record.fields['Phase'] === 'Yearlong')];
      newChallenges['Phase 1'] = [...newChallenges['Phase 1'], ...action.payload.filter(record => record.fields['Phase'] === 'Phase 1')];
      newChallenges['Phase 2'] = [...newChallenges['Phase 2'], ...action.payload.filter(record => record.fields['Phase'] === 'Phase 2')];
      newChallenges['Phase 3'] = [...newChallenges['Phase 3'], ...action.payload.filter(record => record.fields['Phase'] === 'Phase 3')];
      newChallenges['Phase 4'] = [...newChallenges['Phase 4'], ...action.payload.filter(record => record.fields['Phase'] === 'Phase 4')];
      return newChallenges;
    case 'updateChallenges':
      return action.payload;
  }
  
}

function App() {
  const [challenges, dispatch] = React.useReducer(
    reducer,
    {
      'Yearlong': [],
      'Phase 1': [],
      'Phase 2': [],
      'Phase 3': [],
      'Phase 4': []
    } // initial challenges
  );

  const [selectedClient, setSelectedClient] = React.useState(null);
  const [selectedCalendar, setSelectedCalendar] = React.useState(null);
  const [calendarName, setCalendarName] = React.useState('');
  const [previewChallenge, setPreviewChallenge] = React.useState(null);

  // Make airtable calls when app starts
  React.useEffect(() => {
    const hash = window.location.hash.slice(2);

    const fetchChallenges = () => {

      base('Challenges').select({
        view: 'Default',
        filterByFormula: `{Calendar}='${hash}'`
      }).eachPage((records, fetchNextPage) => {

        dispatch({ type: 'addChallenges', payload: records });

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
          setSelectedCalendar(calendar);
          setCalendarName(calendar.fields['name']);

          base('Clients').select({
            filterByFormula: `{Limeade e=}='${calendar.fields['client']}'`
          }).eachPage((records, fetchNextPage) => {
            const client = records[0];

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

    fetchAccountName();
    fetchChallenges();

  }, []); // Pass empty array to only run once on mount

  function updateChallenge(challengeToBeUpdated) {
    const newChallenges = _.cloneDeep(challenges);

    for (let phase in newChallenges) {
      newChallenges[phase].map((challenge, i) => {
        if (challenge.id === challengeToBeUpdated.id) {
          newChallenges[phase][i] = challengeToBeUpdated;
        }
      });
    }

    dispatch({ type: 'updateChallenges', payload: newChallenges });
  }

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
    // switch for getting the phase dates based on the phaseTitle
    let phaseStartDate = '';
    let phaseEndDate = '';
    switch (phaseTitle) {
      case 'Yearlong':
        phaseStartDate = $('#startDateYearlong').text();
        phaseEndDate = $('#endDateYearlong').text();
        break;
      case 'Phase 1':
        phaseStartDate = $('#startDatePhaseOne').text();
        phaseEndDate = $('#endDatePhaseOne').text();
        break;
      case 'Phase 2':
        phaseStartDate = $('#startDatePhaseTwo').text();
        phaseEndDate = $('#endDatePhaseTwo').text();
        break;
      case 'Phase 3':
        phaseStartDate = $('#startDatePhaseThree').text();
        phaseEndDate = $('#endDatePhaseThree').text();
        break;
      case 'Phase 4':
        phaseStartDate = $('#startDatePhaseFour').text();
        phaseEndDate = $('#endDatePhaseFour').text();
        break;
    }

    // Make update in Airtable
    base('Challenges').create({
      'Title': challengeName,
      'Calendar': selectedCalendar.fields['hash'],
      'EmployerName': selectedClient.fields['Limeade e='],
      'Phase': phaseTitle,
      'Start date': moment(phaseStartDate).format('YYYY-MM-DD'),
      'End date': moment(phaseEndDate).format('YYYY-MM-DD'),
      'Verified': 'Placeholder',
      'Team Activity': 'no',
      'Reward Occurrence': 'Once',
      'Points': '0',
      'Total Points': '0',
      'Device Enabled': 'No',
      'Category': 'Health and Fitness',
      'Challenge Id': '',
      'Custom Tile Type': 'Net New'
    }, (err, record) => {
      if (err) {
        console.error(err);
        return;
      }
      updateCalendarUpdated();
      const newChallenges = _.cloneDeep(challenges);
      newChallenges[phaseTitle] = [...newChallenges[phaseTitle], record];
      console.log(newChallenges);
      dispatch({ type: 'updateChallenges', payload: newChallenges });
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
    let newChallenges = _.cloneDeep(challenges);
    for (let phase in newChallenges) {
      newChallenges[phase].map(challenge => {
        // find the single featured activity and update it
        if (challenge.id === challengeToBeFeatured.id) {
          challenge.fields['Featured Activity'] = isFeatured ? 'no' : 'yes';
        }
        return challenge;
      });
    }

    dispatch({ type: 'updateChallenges', payload: newChallenges });
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

    const newChallenges = _.cloneDeep(challenges);
    for (let phase in newChallenges) {
      newChallenges[phase] = newChallenges[phase].filter(challenge => challenge.id !== challengeToBeDeleted.id);
    }

    dispatch({ type: 'updateChallenges', payload: newChallenges });
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
      'Limeade Image Url': challengeToBeDuplicated.fields['Limeade Image Url'],
      'Instructions': challengeToBeDuplicated.fields['Instructions'],
      'More Information Html': challengeToBeDuplicated.fields['More Information Html'],
      'Featured Activity': 'no',
      'Targeted Activity': challengeToBeDuplicated.fields['Targeted Activity'],
      'Targeting Notes': challengeToBeDuplicated.fields['Targeting Notes'],
      'Subgroup': challengeToBeDuplicated.fields['Subgroup'],
      'Targeting Column 1': challengeToBeDuplicated.fields['Targeting Column 1'],
      'Targeting Value 1': challengeToBeDuplicated.fields['Targeting Value 1'],
      'Targeting Column 2': challengeToBeDuplicated.fields['Targeting Column 2'],
      'Targeting Value 2': challengeToBeDuplicated.fields['Targeting Value 2'],
      'Targeting Column 3': challengeToBeDuplicated.fields['Targeting Column 3'],
      'Targeting Value 3': challengeToBeDuplicated.fields['Targeting Value 3'],
      'Custom Tile Type': challengeToBeDuplicated.fields['Custom Tile Type'],
      'Index': newIndex
    }, (err, record) => {
      if (err) {
        console.error(err);
        return;
      }
      updateCalendarUpdated();
      const newChallenges = _.cloneDeep(challenges);
      newChallenges[phaseTitle] = [...newChallenges[phaseTitle], record];
      dispatch({ type: 'updateChallenges', payload: newChallenges });
      $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
    });
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
    const newChallenges = _.cloneDeep(challenges);

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

      // only update the date if challenge is not custom
      if (removed.fields['Custom Tile Type'] === null || removed.fields['Custom Tile Type'] === undefined || removed.fields['Custom Tile Type'] === '') {
        // Update start and end date to match the phase if available in the Calendar object
        if (selectedCalendar.fields[`${destination.droppableId} Start Date`]) {
          removed.fields['Start date'] = selectedCalendar.fields[`${destination.droppableId} Start Date`];
          removed.fields['End date'] = selectedCalendar.fields[`${destination.droppableId} End Date`];
        }
      }
      
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

        if (challenge.id === draggableId) { // Update values for the dragged challenge
          $('#saveNotification').show().html('Saving...');

          // Update start and end date to match the phase if available in the Calendar object
          if (selectedCalendar.fields[`${destination.droppableId} Start Date`]) {
            base('Challenges').update(challenge.id, {
              'Index': index,
              'Phase': destination.droppableId,
              'Start date': selectedCalendar.fields[`${destination.droppableId} Start Date`],
              'End date': selectedCalendar.fields[`${destination.droppableId} End Date`]
            }, function(err, record) {
              if (err) {
                console.error(err);
                return;
              }
              updateCalendarUpdated();
              $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
            });
          } else {
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
          }

        } else { // Update indexes for all other challenges
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
    dispatch({ type: 'updateChallenges', payload: newChallenges });
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
        <div className="totals">
          <CategoryTotals challenges={challenges} />
          <CustomTotals challenges={challenges} />
        </div>
      </div>

      <CalendarAccordion
        calendarChallenges={challenges}
        updateChallenge={updateChallenge}
        selectedClient={selectedClient}
        selectedCalendar={selectedCalendar}
        addChallengeToCalendar={addChallengeToCalendar}
        openPreviewChallengeModal={openPreviewChallengeModal}
        toggleFeaturedChallengeInCalendar={toggleFeaturedChallengeInCalendar}
        deleteChallengeFromCalendar={deleteChallengeFromCalendar}
        duplicateChallengeInCalendar={duplicateChallengeInCalendar}
        onDragEnd={onDragEnd}
      />

      <PointTotals challenges={challenges} />

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
