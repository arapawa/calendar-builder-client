import React, { Component } from 'react';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import ChallengeSelect from './challenge_select';
import CommentBox from './comment_box';

class AccordionCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      challenges: [],
      editingChallenge: null
    };

    this.renderRow = this.renderRow.bind(this);
  }

  editChallenge(challenge) {
    this.props.setEditingChallenge(challenge);
  }

  openDeleteConfirmModal(challenge) {
    /* global $ */
    $('#confirm-modal').modal();
    $('.modal-body').html('<p>Are you sure you want to delete this challenge?</p>');
    $('.modal-footer .btn-danger').off('click');
    $('.modal-footer .btn-danger').click(() => {
      this.deleteChallenge(challenge);
    });
  }

  deleteChallenge(challenge) {
    this.props.deleteChallengeFromCalendar(challenge);

    // Hide the ConfirmModal
    $('#confirm-modal').modal('hide');

    base('Challenges').destroy(challenge.id, (err, deletedRecord) => {
      if (err) {
        console.error(err);
        return;
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
      case 'All':
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

  renderRow(challenge) {
    const startDate = moment(challenge.fields['Start date']).format('YYYY-MM-DD');
    const endDate = moment(challenge.fields['End date']).format('YYYY-MM-DD');
    const name = challenge.fields['Title'];
    const points = challenge.fields['Points'];
    const frequency = challenge.fields['Reward Occurrence'];
    const verified = challenge.fields['Verified'];

    const hasBeenEdited = challenge.fields['Content Changed'] === 'yes';

    return (
      <tr key={challenge.id}>
        <td scope="row">{challenge.fields['Title']}</td>
        <td>{challenge.fields['Verified']}</td>
        <td>
          <img className="table-icon" src={this.hpImage(challenge.fields['Category'])} />
          <img className="table-icon" src={this.teamImage(challenge.fields['Team Activity'])} />
        </td>
        <td>{moment(startDate).format('L')} - {moment(endDate).format('L')}</td>
        <td>{challenge.fields['Reward Occurrence']}</td>
      <td>{challenge.fields['Points']} ({challenge.fields['Total Points']})</td>
        <td>
          <img className="table-icon" src={hasBeenEdited ? 'images/icon_edit_notification.svg' : 'images/icon_edit.svg'} onClick={() => this.editChallenge(challenge)} />
          <CommentBox challenge={challenge} />
          <img className="table-icon" src="images/icon_delete.svg" onClick={() => this.openDeleteConfirmModal(challenge)} />
        </td>
      </tr>
    );
  }

  render() {
    /* global $ */
    $('.table-icon').tooltip({
      html: true,
      trigger: 'click'
    });

    const { id, phase, title } = this.props;

    let startDate, endDate, totalPoints = 0;
    if (phase.length > 0) {
      startDate = moment(phase[0].fields['Start date']).format('YYYY-MM-DD');
      endDate = moment(phase[0].fields['End date']).format('YYYY-MM-DD');

      phase.map(challenge => {
        const frequency = challenge.fields['Reward Occurrence'];
        const start = moment(challenge.fields['Start date']);
        const end = moment(challenge.fields['End date']);
        const dayDifference = end.diff(start, 'days');
        const weeks = Math.ceil(dayDifference / 7);

        // Update total points based on points and frequency
        switch (frequency) {
          case 'Weekly':
            challenge.fields['Total Points'] = (challenge.fields['Points'] * weeks).toString();
            break;
          case 'Bi-weekly':
            challenge.fields['Total Points'] = (challenge.fields['Points'] * 26).toString();
            break;
          case 'Monthly':
            challenge.fields['Total Points'] = (challenge.fields['Points'] * 12).toString();
            break;
          case 'Unlimited':
            challenge.fields['Total Points'] = (challenge.fields['Points'] * 4).toString();
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

    return (
      <div className="card">

        <div className="card-header" role="tab" id={'header' + id}>
          <h5 className="mb-0">
            <a data-toggle="collapse" href={'#collapse' + id}>
              <span>{title}</span>
              <span className="left-15">{formattedStartDate} - {formattedEndDate}</span>
              <span className="left-abs-73">{totalPoints} Points</span>
              <span className="oi oi-caret-bottom"></span>
            </a>
          </h5>
        </div>

        <div id={'collapse' + id} className="collapse" role="tabpanel">
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Category</th>
                  <th scope="col">Dates</th>
                  <th scope="col">Tracking</th>
                  <th scope="col">Points (Total)</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {phase.map(challenge => this.renderRow(challenge))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <ChallengeSelect
                      calendar={this.props.calendar}
                      challenges={this.props.challenges}
                      selectChallenge={this.props.selectChallenge}
                      selectedClient={this.props.selectedClient}
                      selectedChallenge={this.props.selectedChallenge}
                      addChallengeToCalendar={this.props.addChallengeToCalendar}
                      phase={this.props.title}
                      startDate={startDate}
                      endDate={endDate} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    );
  }
}

export default AccordionCard;
