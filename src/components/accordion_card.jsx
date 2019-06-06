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
    });

    // When user hits enter, also change it back
    $('#editingStartDate').on('keypress', (event) => {
      if (event.which === 13) {
        $('#editingStartDate').parent().html(`${moment(challenge.fields['Start date']).format('L')}`);
      }
    });

    // The blur event triggers the change event
    $('#editingStartDate').change((event) => {
      challenge.fields['Start date'] = event.target.value;

      // Update airtable w/ the changes
      base('Challenges').update(challenge.id, {
        'Start date': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
      });

    });
  }

  editEndDate(e, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="date" class="form-control" id="editingEndDate" value="${challenge.fields['End date']}" />`;

    $('#editingEndDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingEndDate').blur((event) => {
      $('#editingEndDate').parent().html(`${moment(challenge.fields['End date']).format('L')}`);
    });

    // When user hits enter, also change it back
    $('#editingEndDate').on('keypress', (event) => {
      if (event.which === 13) {
        $('#editingEndDate').parent().html(`${moment(challenge.fields['End date']).format('L')}`);
      }
    });

    // The blur event triggers the change event
    $('#editingEndDate').change((event) => {
      challenge.fields['End date'] = event.target.value;

      // Update airtable w/ the changes
      base('Challenges').update(challenge.id, {
        'End date': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
      });

    });
  }

  editPoints(event, challenge) {
    let td = event.target;
    td.innerHTML = `<input type="text" class="form-control" id="editingPoints" value="${challenge.fields['Points']}" />`;

    // Since autofocus wasn't working, focus using jquery
    $('#editingPoints').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingPoints').blur((event) => {
      $('#editingPoints').parent().html(`${challenge.fields['Points']} (${challenge.fields['Total Points']})`);
    });

    // The blur event triggers the change event
    $('#editingPoints').change((event) => {
      challenge.fields['Points'] = event.target.value;

      // Update airtable w/ the changes
      base('Challenges').update(challenge.id, {
        'Points': event.target.value
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
      });
    });

    // When user hits enter, also change it back
    $('#editingPoints').on('keypress', (event) => {
      if (event.which === 13) {
        challenge.fields['Points'] = event.target.value;

        // Update airtable w/ the changes
        base('Challenges').update(challenge.id, {
          'Points': event.target.value
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
        });

        $('#editingPoints').parent().html(`${challenge.fields['Points']} (${challenge.fields['Total Points']})`);
      }
    });
  }

  hpImage(category) {
    switch (category) {
      case 'Health & Fitness':
        return 'images/HP_Icon_Health_Fitness.png';
      case 'Growth & Development':
        return 'images/HP_Icon_Growth_Development.png';
      case 'Contribution & Sustainability':
        return 'images/HP_Icon_Contribution_Sustainability.png';
      case 'Money & Prosperity':
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
    const hasBeenEdited = challenge.fields['Content Changed'] === 'yes';

    return (
      <Draggable draggableId={challenge.id} index={index} key={challenge.id}>
        {(provided) => (
          <tr
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref = {provided.innerRef}
          >
            <td>
              <img className="table-icon-wide" src={challenge.fields['Header Image']} onClick={() => this.props.setPreviewChallenge(challenge)} />
            </td>
            <td scope="row">
              <div className="challenge-title" onClick={() => this.props.setPreviewChallenge(challenge)}>
                {challenge.fields['Title']}
              </div>
              { isFeatured ? <div><p className="featured-badge">Featured</p></div> : '' }
            </td>
            <td>{challenge.fields['Verified']}</td>
            <td className="text-center">
              <img className="table-icon category-icon" src={this.hpImage(challenge.fields['Category'])} />
              <img className="table-icon team-icon" src={this.teamImage(challenge.fields['Team Activity'])} />
            </td>
            <td onDoubleClick={(e) => this.editStartDate(e, challenge)}>{moment(startDate).format('L')}</td>
            <td onDoubleClick={(e) => this.editEndDate(e, challenge)}>{moment(endDate).format('L')}</td>
            <td>{challenge.fields['Reward Occurrence']}</td>
            <td onDoubleClick={(e) => this.editPoints(e, challenge)}>{challenge.fields['Points']} ({challenge.fields['Total Points']})</td>
            <td className="actions text-center">
              <img className="table-icon preview-icon" src={hasBeenEdited ? 'images/icon_preview_notification.svg' : 'images/icon_preview.svg'} onClick={() => this.props.setPreviewChallenge(challenge)} />
              <img className="table-icon delete-icon" src="images/icon_delete.svg" onClick={() => this.openDeleteConfirmModal(challenge)} />
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
                      <th scope="col" className="actions-header">Actions</th>
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
                          calendar={this.props.calendar}
                          selectedClient={this.props.selectedClient}
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
