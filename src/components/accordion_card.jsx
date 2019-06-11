import React, { Component } from 'react';
import moment from 'moment';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import AddCustomChallenge from './add_custom_challenge';

class AccordionCard extends Component {
  openDeleteConfirmModal(challenge) {
    /* global $ */
    $('#confirm-modal').modal();
    $('.modal-body').html('<p>Are you sure you want to delete this challenge?</p>');
    $('.modal-footer .btn-danger').off('click');
    $('.modal-footer .btn-danger').click(() => {
      this.props.deleteChallengeFromCalendar(challenge);
    });
  }

  editStartDate(e, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="date" class="form-control" id="editingStartDate" value="${challenge.fields['Start date']}" />`;

    $('#editingStartDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingStartDate').blur((event) => {
      $('#editingStartDate').parent().html(`${moment(challenge.fields['Start date']).format('L')}`);

      challenge.fields['Start date'] = event.target.value;
      this.props.updateChallenges();

      // Update airtable w/ the changes
      $('#saveNotification').html('Saving...');
      base('Challenges').update(challenge.id, {
        'Start date': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        $('#saveNotification').html('Saved.');
      });

    });

    // When user hits enter, also change it back
    $('#editingStartDate').on('keypress', (event) => {
      if (event.which === 13) {
        $('#editingStartDate').parent().html(`${moment(challenge.fields['Start date']).format('L')}`);

        challenge.fields['Start date'] = event.target.value;
        this.props.updateChallenges();

        // Update airtable w/ the changes
        $('#saveNotification').html('Saving...');
        base('Challenges').update(challenge.id, {
          'Start date': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          $('#saveNotification').html('Saved.');
        });
      }
    });
  }

  editEndDate(e, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="date" class="form-control" id="editingEndDate" value="${challenge.fields['End date']}" />`;

    $('#editingEndDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingEndDate').blur((event) => {
      $('#editingEndDate').parent().html(`${moment(challenge.fields['End date']).format('L')}`);

      challenge.fields['End date'] = event.target.value;
      this.props.updateChallenges();

      // Update airtable w/ the changes
      $('#saveNotification').html('Saving...');
      base('Challenges').update(challenge.id, {
        'End date': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        $('#saveNotification').html('Saved.');
      });
    });

    // When user hits enter, also change it back
    $('#editingEndDate').on('keypress', (event) => {
      if (event.which === 13) {
        $('#editingEndDate').parent().html(`${moment(challenge.fields['End date']).format('L')}`);

        challenge.fields['End date'] = event.target.value;
        this.props.updateChallenges();

        // Update airtable w/ the changes
        $('#saveNotification').html('Saving...');
        base('Challenges').update(challenge.id, {
          'End date': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          $('#saveNotification').html('Saved.');
        });
      }
    });
  }

  editPoints(event, challenge) {
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
      this.props.updateChallenges();

      // Update airtable w/ the changes
      $('#saveNotification').html('Saving...');
      base('Challenges').update(challenge.id, {
        'Points': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        $('#saveNotification').html('Saved.');
      });
    });

    // When user hits enter, also change it back
    $('#editingPoints').on('keypress', (event) => {
      if (event.which === 13) {
        challenge.fields['Points'] = event.target.value;
        challenge.fields['Total Points'] = challenge.fields['Reward Occurrence'] === 'Weekly' ?
                                           event.target.value * weeks :
                                           event.target.value;

        $('#editingPoints').parent().html(`${challenge.fields['Points']} (${challenge.fields['Total Points']})`);
        this.props.updateChallenges();

        // Update airtable w/ the changes
        $('#saveNotification').html('Saving...');
        base('Challenges').update(challenge.id, {
          'Points': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          $('#saveNotification').html('Saved.');
        });
      }
    });
  }

  hpImage(category) {
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

  teamImage(team) {
    if (team === 'yes') {
      return 'images/icon_team.svg';
    } else {
      return 'images/icon_individual.svg';
    }
  }

  renderRow(challenge, index) {
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
              <img className="table-icon-wide" src={challenge.fields['Header Image']} title="View image" onClick={() => this.props.setPreviewChallenge(challenge)} />
            </td>
            <td scope="row">
              <span className="challenge-title" title="View content" onClick={() => this.props.setPreviewChallenge(challenge)}>
                {challenge.fields['Title']}
              </span>
              { isFeatured ? <div><p className="featured-badge">Featured</p></div> : '' }
            </td>
            <td title="Tracking type">{challenge.fields['Verified']}</td>
            <td className="text-center">
              <img className="table-icon category-icon" src={this.hpImage(challenge.fields['Category'])} title={(challenge.fields['Category'])} />
              <img className="table-icon team-icon" src={this.teamImage(challenge.fields['Team Activity'])} title={ isTeam ? 'Team' : 'Individual' } />
            </td>
            <td title="Start date" onDoubleClick={(e) => this.editStartDate(e, challenge)}><span className="start-date">{moment(startDate).format('L')}</span></td>
            <td title="End date" onDoubleClick={(e) => this.editEndDate(e, challenge)}><span className="end-date">{moment(endDate).format('L')}</span></td>
            <td title="Reward Occurrence">{challenge.fields['Reward Occurrence']}</td>
            <td title="Points (Total Points)" onDoubleClick={(e) => this.editPoints(e, challenge)}><span className="points-text">{challenge.fields['Points']} ({challenge.fields['Total Points']})</span></td>
            <td className="actions text-center">
              <img className="table-icon delete-icon" src="images/icon_delete.svg" title="Delete row" onClick={() => this.openDeleteConfirmModal(challenge)} />
            </td>
          </tr>
        )}
      </Draggable>
    );
  }

  render() {
    const { id, challenges, phaseTitle } = this.props;

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

        <div className="card-header" role="tab" id={'header' + id}>
          <div className="mb-0 row">
            <div className="col-md-4">
              <h5 id={'title' + id}>{phaseTitle}</h5>
            </div>
            <div className="col-md-4">
              <h5 id={'dates' + id}>{formattedStartDate} - {formattedEndDate}</h5>
            </div>
            <div className="col-md-3">
              <h5 id={'points' + id}>{totalPoints} Points</h5>
            </div>
            <div className="col-md-1">
              <a data-toggle="collapse" href={'#collapse' + id}>
                <h5 className="oi oi-caret-bottom"></h5>
              </a>
            </div>
          </div>
        </div>

        <div id={'collapse' + id} className="collapse show" role="tabpanel">
          <div className="card-body">
            <Droppable droppableId={this.props.phaseTitle}>
              {(provided) => (
                <table className="table table-striped"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead>
                    <tr>
                      <th scope="col">{/*Image*/}</th>
                      <th scope="col">Name</th>
                      <th scope="col">Type</th>
                      <th scope="col">Category</th>
                      <th scope="col">Start Date</th>
                      <th scope="col">End Date</th>
                      <th scope="col">Tracking</th>
                      <th scope="col">Points (Total)</th>
                      <th scope="col" className="actions-header">{/*Actions*/}</th>
                    </tr>
                  </thead>
                  <tbody>
                    { challenges.map((challenge, index) => this.renderRow(challenge, index)) }
                    { provided.placeholder }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="7">
                        <AddCustomChallenge
                          phaseTitle={this.props.phaseTitle}
                          addChallengeToCalendar={this.props.addChallengeToCalendar}
                        />
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
}

export default AccordionCard;
