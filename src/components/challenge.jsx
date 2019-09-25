import React from 'react';
import moment from 'moment';
import { Draggable } from 'react-beautiful-dnd';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

function Challenge({
  challenge,
  updateChallenge,
  index,
  openPreviewChallengeModal,
  toggleFeaturedChallengeInCalendar,
  featuredCount,
  deleteChallengeFromCalendar,
  duplicateChallengeInCalendar,
  selectedCalendar
 }) {
  /* globals $ */

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

  function openFeaturedConfirmModal(challenge, isFeatured) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#confirm-modal').modal('hide');
    $('duplicate-modal').modal('hide');

    $('#featured-modal').modal();

    // updates the modal content based on whether we would be setting or disabling this challenge as Featured
    if (isFeatured) {
      $('#featured-modal .modal-body').html(`<p>Would you like to remove this tile from the Featured Activity banner?</p><p>${featuredCount} of 4 challenges are currently featured for this phase.</p>`);
      $('#featured-modal .modal-footer .btn-primary').html('Stop Featuring');
    } else {
      $('#featured-modal .modal-body').html(`<p>Would you like to add this tile to the Featured Activity banner?</p><p>${featuredCount} of 4 challenges are currently featured for this phase.</p>`);
      $('#featured-modal .modal-footer .btn-primary').html('Feature Activity');
    }

    $('.modal-footer .btn-primary').off('click');
    $('.modal-footer .btn-primary').click(() => toggleFeaturedChallengeInCalendar(challenge, isFeatured));
  }

  function openDeleteConfirmModal(challenge) {
    // Hide the other modals
    $('#approve-modal').modal('hide');
    $('#featured-modal').modal('hide');
    $('duplicate-modal').modal('hide');

    $('#confirm-modal').modal();
    $('#confirm-modal .modal-body').html('<p>Are you sure you want to delete this challenge?</p>');
    $('#confirm-modal .modal-footer .btn-danger').off('click');
    $('#confirm-modal .modal-footer .btn-danger').click(() => deleteChallengeFromCalendar(challenge));
  }

  function openDuplicateConfirmModal(challenge) {
    $('#approve-modal').modal('hide');
    $('#featured-modal').modal('hide');
    $('#confirm-modal').modal('hide');

    $('#duplicate-modal').modal();
    $('#duplicate-modal .modal-body').html('<p>Would you like to duplicate this challenge?</p>');
    $('#duplicate-modal .modal-footer .btn-primary').off('click');
    $('#duplicate-modal .modal-footer .btn-primary').click(() => duplicateChallengeInCalendar(challenge));
  }

  function validateStartDate(e, challenge) {
    let startDate = moment(e.target.value);
    let endDate = moment(challenge.fields['End date']);

    // alert user if the end date is before the start date
    if (endDate.isBefore(startDate)) {
      alert('Error: The Start Date must be before the End Date.');
      $('#editingStartDate').addClass('invalid');
    } else {
      // do other actions because end date is valid
      challenge.fields['Start date'] = e.target.value;

      $('#editingStartDate').removeClass('invalid');
      $('#editingStartDate').parent().html(`${moment(challenge.fields['Start date']).format('L')}`);
      updateChallenge(challenge);

      // Update airtable w/ the changes
      $('#saveNotification').show().html('Saving...');
      base('Challenges').update(challenge.id, {
        'Start date': e.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        updateCalendarUpdated();
        $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
      });
    }
  }

  function editStartDate(event, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="date" class="input-dates_width form-control" id="editingStartDate" value="${challenge.fields['Start date']}" />`;

    $('#editingStartDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingStartDate').blur((event) => {
      validateStartDate(event, challenge);
    });
  }

  function validateEndDate(e, challenge) {
    let startDate = moment(challenge.fields['Start date']);
    let endDate = moment(e.target.value);

    // alert user if the end date is before the start date
    if (endDate.isBefore(startDate)) {
      alert('Error: The Start Date must be before the End Date.');
      $('#editingEndDate').addClass('invalid');
    } else {
      // do other actions because end date is valid
      challenge.fields['End date'] = e.target.value;

      $('#editingEndDate').removeClass('invalid');
      $('#editingEndDate').parent().html(`${moment(challenge.fields['End date']).format('L')}`);
      updateChallenge(challenge);

      // Update airtable w/ the changes
      $('#saveNotification').show().html('Saving...');
      base('Challenges').update(challenge.id, {
        'End date': e.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        updateCalendarUpdated();
        $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
      });
    }
  }

  function editEndDate(e, challenge) {
    let td = e.target;
    td.innerHTML = `<input type="date" class="input-dates_width form-control" id="editingEndDate" value="${challenge.fields['End date']}" />`;

    $('#editingEndDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingEndDate').blur((ev) => {
      validateEndDate(ev, challenge);
    });
  }

  function editPoints(event, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="text" class="input-points-total_width form-control" id="editingPoints" value="${challenge.fields['Points']}" />`;

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
      updateChallenge(challenge);

      // Update airtable w/ the changes
      $('#saveNotification').show().html('Saving...');
      base('Challenges').update(challenge.id, {
        'Points': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        updateCalendarUpdated();
        $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
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
        updateChallenge(challenge);

        // Update airtable w/ the changes
        $('#saveNotification').show().html('Saving...');
        base('Challenges').update(challenge.id, {
          'Points': event.target.value
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

  function hpImage(category) {
    switch (category) {
      case 'Health and Fitness':
      case 'Health & Fitness':
        return 'images/HP_Icon_Health_Fitness.png';
      case 'Growth and Development':
      case 'Growth & Development':
        return 'images/HP_Icon_Growth_Development.png';
      case 'Contribution and Sustainability':
      case 'Contribution & Sustainability':
        return 'images/HP_Icon_Contribution_Sustainability.png';
      case 'Money and Prosperity':
      case 'Money & Prosperity':
        return 'images/HP_Icon_Money_Prosperity.png';
      default:
        return 'images/HP_Icon_All.png';
    }
  }

  function teamImage(team) {
    if (team === 'yes' || team === 'Yes') {
      return 'images/icon_team.svg';
    } else {
      return 'images/icon_individual.svg';
    }
  }

  const startDate = moment(challenge.fields['Start date']).format('YYYY-MM-DD');
  const endDate = moment(challenge.fields['End date']).format('YYYY-MM-DD');
  const points = challenge.fields['Points'];
  const frequency = challenge.fields['Reward Occurrence'];
  const tileImage = challenge.fields['Header Image'];

  const isCustom = challenge.fields['Custom Tile Type'];
  const isFeatured = (challenge.fields['Featured Activity'] === 'yes' || challenge.fields['Featured Activity'] === 'Yes');
  const isTargeted = (challenge.fields['Targeted Activity'] === 'yes' || challenge.fields['Targeted Activity'] === 'Yes');
  const isTeam = (challenge.fields['Team Activity'] === 'yes' || challenge.fields['Team Activity'] === 'Yes');
  const hasBeenEdited = challenge.fields['Content Changed'] === 'yes';

  // Verified/Points Upload/System Awarded Exceptions
  // overriding Verified type for challenges that are Partner Challenges but function like CIEs from the client's perspective (auto awarded)
  let verified = challenge.fields['Verified'];
  if (challenge.fields['Title'] === 'Connect with a Coach' || challenge.fields['Title'] === 'Hot Topics On the Go!' || challenge.fields['Title'] === 'Health & Fitness' || challenge.fields['Title'] === 'Money & Prosperity' || challenge.fields['Title'] === 'Growth & Development' || challenge.fields['Title'] === 'Contribution & Sustainability') {
    verified = 'System Awarded';
  }

  // declares which color of custom tile badge will show
  function customTileBadge(challenge) {
    switch (challenge.fields['Custom Tile Type']) {
      case 'Net New':
        return <p className="badge custom-badge-netnew">Custom: {challenge.fields['Custom Tile Type']}</p>;
      case 'Rerun':
        return <p className="badge custom-badge-rerun">Custom: {challenge.fields['Custom Tile Type']}</p>;
      case 'Revised':
        return <p className="badge custom-badge-revised">Custom: {challenge.fields['Custom Tile Type']}</p>;
    }
  }

  function allowFeatured(challenge) {
    if (challenge.fields['Verified'] === 'System Awarded') {
      return <img className="table-icon" style={{ opacity: '0' }} />; // setting an empty image with 0 opacity so the icon space is taken up but not visible
    } else {
      // check if featured and feature if appropriate
      if (challenge.fields['Featured Activity'] === 'yes' || challenge.fields['Featured Activity'] === 'Yes') {
        return <img className="table-icon featured-icon" src="images/icon_star_notification.svg" title="Feature Activity" onClick={() => openFeaturedConfirmModal(challenge, isFeatured)} />;
      } else {
        return <img className="table-icon featured-icon" src="images/icon_star.svg" title="Feature Activity" onClick={() => openFeaturedConfirmModal(challenge, isFeatured)} />;
      }
    }
  }

  return (
    <Draggable draggableId={challenge.id} index={index} key={challenge.id}>
      {(provided) => (
        <tr
          {...provided.draggableProps}
          ref = {provided.innerRef}
        >
          <td>
            <div className="first-column-group">
              <img className="table-icon drag-icon" {...provided.dragHandleProps} src="images/icon_drag.svg" title="Drag row"/>
              <img className="tile-image challenge-image" src={ tileImage ? tileImage : 'images/placeholder.svg' } title="View image" onClick={() => openPreviewChallengeModal(challenge)} />
            </div>
          </td>
          <td scope="row">
            <div className="challenge-title" title="View content" onClick={() => openPreviewChallengeModal(challenge)}>
              {challenge.fields['Title']}
            </div>
            <div className="badges">
              { isCustom ? customTileBadge(challenge) : '' }
              { isFeatured ? <p className="badge featured-badge">Featured</p> : '' }
              { isTargeted ? <p className="badge targeted-badge" title={`Targeted to ${challenge.fields['Targeting Notes']}`}>Targeted</p> : '' }
            </div>
          </td>
          <td className="short-description">{challenge.fields['Instructions']}</td>
          <td title="Tracking type">{verified}</td>
          <td>
            <img className="table-icon table-icon_spacing category-icon" src={hpImage(challenge.fields['Category'])} title={(challenge.fields['Category'])} />
            <img className="table-icon team-icon table-icon_spacing" src={teamImage(challenge.fields['Team Activity'])} title={ isTeam ? 'Team' : 'Individual' } />
          </td>
          <td title="Start date" onDoubleClick={(e) => editStartDate(e, challenge)}><span className="cursor-type_pointer">{moment(startDate).format('L')}</span></td>
          <td title="End date" onDoubleClick={(e) => editEndDate(e, challenge)}><span className="cursor-type_pointer">{moment(endDate).format('L')}</span></td>
          <td title="Reward Occurrence">{challenge.fields['Reward Occurrence']}</td>
          <td title="Points (Total Points)" onDoubleClick={(e) => editPoints(e, challenge)}><span className="cursor-type_pointer">{challenge.fields['Points']} ({challenge.fields['Total Points']})</span></td>
          <td className="actions text-center">
            <div className="actions-icon-group">
              { allowFeatured(challenge) }
              <img className="table-icon duplicate-icon" src="images/icon_duplicate.svg" title="Duplicate challenge" onClick={() => openDuplicateConfirmModal(challenge)} />
              <img className="table-icon delete-icon" src="images/icon_delete.svg" title="Delete challenge" onClick={() => openDeleteConfirmModal(challenge)} />
              </div>
          </td>
        </tr>
      )}
    </Draggable>
  );
}

export default Challenge;
