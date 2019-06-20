import React from 'react';
import moment from 'moment';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import AddCustomChallenge from './add_custom_challenge';

function AccordionCard({
  challenges,
  phaseId,
  phaseTitle,
  setPreviewChallenge,
  toggleFeaturedChallengeInCalendar,
  deleteChallengeFromCalendar,
  addChallengeToCalendar,
  updateChallenges
}) {
  /* global $ */

  function openFeaturedConfirmModal(challenge, isFeatured) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#confirm-modal').modal('hide');

    $('#featured-modal').modal();

    // updates the modal content based on whether we would be setting or disabling this challenge as Featured
    if (isFeatured) {
      $('.modal-body').html('<p>Would you like to remove this tile from the Featured Activity banner?</p>');
      $('.modal-footer .btn-primary').html('Stop Featuring');
    } else {
      $('.modal-body').html('<p>Would you like to add this tile to the Featured Activity banner?</p>');
      $('.modal-footer .btn-primary').html('Feature Activity');
    }

    $('.modal-footer .btn-primary').off('click');
    $('.modal-footer .btn-primary').click(() => toggleFeaturedChallengeInCalendar(challenge, isFeatured));
  }

  function openDeleteConfirmModal(challenge) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#featured-modal').modal('hide');

    $('#confirm-modal').modal();
    $('.modal-body').html('<p>Are you sure you want to delete this challenge?</p>');
    $('.modal-footer .btn-danger').off('click');
    $('.modal-footer .btn-danger').click(() => deleteChallengeFromCalendar(challenge));
  }

  function editStartDate(e, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="date" class="form-control" id="editingStartDate" value="${challenge.fields['Start date']}" />`;

    $('#editingStartDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingStartDate').blur((event) => {
      validateStartDate(e, challenge);
    });

    // When user hits enter, also change it back
    $('#editingStartDate').on('keypress', (event) => {
      if (event.key === 'Enter') {
        validateStartDate(e, challenge);
      }
    });

    function validateStartDate(e, challenge) {
      let startDate = moment(event.target.value);
      let endDate = moment(challenge.fields['End date']);

      // alert user if the end date is before the start date
      if (endDate.isBefore(startDate)) {
        alert('Error: The Start Date must be before the End Date.');
        $('#editingStartDate').addClass('invalid');
      } else {
        // do other actions because end date is valid
        $('#editingStartDate').parent().removeClass('invalid');
        $('#editingStartDate').parent().html(`${moment(challenge.fields['Start date']).format('L')}`);

        challenge.fields['Start date'] = event.target.value;
        updateChallenges();

        // Update airtable w/ the changes
        $('#saveNotification').show().html('Saving...');
        base('Challenges').update(challenge.id, {
          'Start date': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          $('#saveNotification').html('Saved.').delay(800).fadeOut(1200);
        });
      }
    }

  }

  function editEndDate(e, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="date" class="form-control" id="editingEndDate" value="${challenge.fields['End date']}" />`;

    $('#editingEndDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingEndDate').blur((event) => {
      validateEndDate(e, challenge);
    });

    // When user hits enter, also change it back
    $('#editingEndDate').on('keypress', (event) => {
      if (event.key === 'Enter') {
        validateEndDate(e, challenge);
      }
    });

    function validateEndDate(e, challenge) {
      let startDate = moment(challenge.fields['Start date']);
      let endDate = moment(event.target.value);

      // alert user if the end date is before the start date
      if (endDate.isBefore(startDate)) {
        alert('Error: The Start Date must be before the End Date.');
        $('#editingEndDate').parent().addClass('invalid');
      } else {
        // do other actions because end date is valid
        $('#editingEndDate').parent().removeClass('invalid');
        $('#editingEndDate').parent().html(`${moment(challenge.fields['End date']).format('L')}`);

        challenge.fields['End date'] = event.target.value;
        updateChallenges();

        // Update airtable w/ the changes
        $('#saveNotification').show().html('Saving...');
        base('Challenges').update(challenge.id, {
          'End date': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          $('#saveNotification').html('Saved.').delay(800).fadeOut(1200);
        });
      }
    }

  }

  function editPoints(event, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="text" class="form-control" id="editingPoints" value="${challenge.fields['Points']}" />`;

    // Since autofocus wasn't working, focus using jquery
    $('#editingPoints').focus();

    // Math for weekly calculation
    const start = moment(challenge.fields['Start date']);
    const end = moment(challenge.fields['End date']);
    const dayDifference = end.diff(start, 'days');
    const weeks = Math.ceil(dayDifference / 7);

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingPoints').blur((event) => {
      challenge.fields['Points'] = event.target.value;
      challenge.fields['Total Points'] = challenge.fields['Reward Occurrence'] === 'Weekly' ?
                                         event.target.value * weeks :
                                         event.target.value;

      $('#editingPoints').parent().html(`${challenge.fields['Points']} (${challenge.fields['Total Points']})`);
      updateChallenges();

      // Update airtable w/ the changes
      $('#saveNotification').show().html('Saving...');
      base('Challenges').update(challenge.id, {
        'Points': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        $('#saveNotification').html('Saved.').delay(800).fadeOut(1200);
      });
    });

    // When user hits enter, also change it back
    $('#editingPoints').on('keypress', (event) => {
      if (event.key === 'Enter') {
        challenge.fields['Points'] = event.target.value;
        challenge.fields['Total Points'] = challenge.fields['Reward Occurrence'] === 'Weekly' ?
                                           event.target.value * weeks :
                                           event.target.value;

        $('#editingPoints').parent().html(`${challenge.fields['Points']} (${challenge.fields['Total Points']})`);
        updateChallenges();

        // Update airtable w/ the changes
        $('#saveNotification').show().html('Saving...');
        base('Challenges').update(challenge.id, {
          'Points': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          $('#saveNotification').html('Saved.').delay(800).fadeOut(1200);
        });
      }
    });
  }

  function hpImage(category) {
    switch (category) {
      case 'Health and Fitness':
        return 'images/HP_Icon_Health_Fitness.png';
      case 'Growth and Development':
        return 'images/HP_Icon_Growth_Development.png';
      case 'Contribution and Sustainability':
        return 'images/HP_Icon_Contribution_Sustainability.png';
      case 'Money and Prosperity':
        return 'images/HP_Icon_Money_Prosperity.png';
      default:
        return 'images/HP_Icon_All.png';
    }
  }

  function teamImage(team) {
    if (team === 'yes') {
      return 'images/icon_team.svg';
    } else {
      return 'images/icon_individual.svg';
    }
  }

  function renderRow(challenge, index) {
    const startDate = moment(challenge.fields['Start date']).format('YYYY-MM-DD');
    const endDate = moment(challenge.fields['End date']).format('YYYY-MM-DD');
    const name = challenge.fields['Title'];
    const points = challenge.fields['Points'];
    const frequency = challenge.fields['Reward Occurrence'];
    const verified = challenge.fields['Verified'];

    const isFeatured = challenge.fields['Featured Activity'] === 'yes';
    const isTeam = (challenge.fields['Team Activity'] === 'yes');
    const hasBeenEdited = challenge.fields['Content Changed'] === 'yes';

    return (
      <Draggable draggableId={challenge.id} index={index} key={challenge.id}>
        {(provided) => (
          <tr
            {...provided.draggableProps}
            ref = {provided.innerRef}
          >
            <td>
              <img className="table-icon drag-icon" {...provided.dragHandleProps} src="images/icon_drag.svg" title="Drag row"/>
              <img className="table-icon-wide" src={challenge.fields['Header Image']} title="View image" onClick={() => setPreviewChallenge(challenge)} />
            </td>
            <td scope="row">
              <span className="challenge-title" title="View content" onClick={() => setPreviewChallenge(challenge)}>
                {challenge.fields['Title']}
              </span>
              { isFeatured ? <div><p className="featured-badge">Featured</p></div> : '' }
            </td>
            <td title="Tracking type">{challenge.fields['Verified']}</td>
            <td className="text-center">
              <img className="table-icon category-icon" src={hpImage(challenge.fields['Category'])} title={(challenge.fields['Category'])} />
              <img className="table-icon team-icon" src={teamImage(challenge.fields['Team Activity'])} title={ isTeam ? 'Team' : 'Individual' } />
            </td>
            <td title="Start date" onDoubleClick={(e) => editStartDate(e, challenge)}><span className="start-date">{moment(startDate).format('L')}</span></td>
            <td title="End date" onDoubleClick={(e) => editEndDate(e, challenge)}><span className="end-date">{moment(endDate).format('L')}</span></td>
            <td title="Reward Occurrence">{challenge.fields['Reward Occurrence']}</td>
            <td title="Points (Total Points)" onDoubleClick={(e) => editPoints(e, challenge)}><span className="points-text">{challenge.fields['Points']} ({challenge.fields['Total Points']})</span></td>
            <td className="actions text-center">
              <img className="table-icon featured-icon" src={ isFeatured ? 'images/icon_star_notification.svg' : 'images/icon_star.svg' } title="Toggle Featured activity" onClick={() => openFeaturedConfirmModal(challenge, isFeatured)} />
              <img className="table-icon delete-icon" src="images/icon_delete.svg" title="Delete row" onClick={() => openDeleteConfirmModal(challenge)} />
            </td>
          </tr>
        )}
      </Draggable>
    );
  }

  let startDate, endDate, totalPoints = 0;

  if (challenges.length > 0) {
    startDate = moment(challenges[0].fields['Start date']).format('YYYY-MM-DD');
    endDate = moment(challenges[0].fields['End date']).format('YYYY-MM-DD');

    challenges.map(challenge => {
      const start = moment(challenge.fields['Start date']);
      const end = moment(challenge.fields['End date']);
      const dayDifference = end.diff(start, 'days');
      const weeks = Math.ceil(dayDifference / 7);

      // Update total points based on points and frequency
      switch (challenge.fields['Reward Occurrence']) {
        case 'Weekly':
          challenge.fields['Total Points'] = (challenge.fields['Points'] * weeks).toString();
          break;
        default:
          challenge.fields['Total Points'] = challenge.fields['Points'];
      }

      // Calculate total points for the whole phase
      const points = Number(challenge.fields['Total Points']);
      if (!isNaN(points)) {
        totalPoints += points;
      }
    });
  } else {
    startDate = '';
    endDate = '';
  }

  const formattedStartDate = startDate ? moment(startDate).format('L') : '';
  const formattedEndDate = endDate ? moment(endDate).format('L') : '';

  // Sort challenges by index
  challenges.sort((a, b) => a.fields['Index'] - b.fields['Index']);

  return (
    <section className="card">

      <div className="card-header" role="tab" id={'header' + phaseId}>
        <div className="mb-0 row">
          <div className="col-md-4">
            <h5 id={'title' + phaseId}>{phaseTitle}</h5>
          </div>
          <div className="col-md-4">
            <h5 id={'dates' + phaseId}>{formattedStartDate} - {formattedEndDate}</h5>
          </div>
          <div className="col-md-3">
            <h5 id={'points' + phaseId}>{totalPoints} Points</h5>
          </div>
          <div className="col-md-1">
            <a data-toggle="collapse" href={'#collapse' + phaseId}>
              <h5 className="oi oi-caret-bottom"></h5>
            </a>
          </div>
        </div>
      </div>

      <div id={'collapse' + phaseId} className="collapse show" role="tabpanel">
        <div className="card-body">
          <Droppable droppableId={phaseTitle}>
            {(provided) => (
              <table className="table table-striped"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <thead>
                  <tr>
                    <th scope="col" className="image-header"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Tracking</th>
                    <th scope="col">Category</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Frequency</th>
                    <th scope="col">Points (Total)</th>
                    <th scope="col" className="actions-header"></th>
                  </tr>
                </thead>
                <tbody>
                  { challenges.map((challenge, index) => renderRow(challenge, index)) }
                  { provided.placeholder }
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="7">
                      <AddCustomChallenge phaseTitle={phaseTitle} addChallengeToCalendar={addChallengeToCalendar} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </Droppable>
        </div>
      </div>

    </section>
  );
}

export default AccordionCard;
