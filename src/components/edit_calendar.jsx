import React, { Component } from 'react';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import AccordionCard from './accordion_card';
import ConfirmModal from './confirm_modal';

class EditCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalPoints: 0
    };
  }

  componentDidMount() {
    /* global $ */
    $('.calendar-link').tooltip({
      html: true,
      trigger: 'click'
    });
  }

  renderAccordionCard(phase, id, title) {
    return (
      <AccordionCard
        phase={phase} id={id} title={title}
        challenges={this.props.challenges}
        calendar={this.props.calendar}
        selectChallenge={this.props.selectChallenge}
        selectedClient={this.props.selectedClient}
        selectedChallenge={this.props.selectedChallenge}
        handleEditChallengeClick={this.props.handleEditChallengeClick}
        addChallengeToCalendar={this.props.addChallengeToCalendar}
        deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />
    );
  }

  render() {
    const calendar = this.props.calendar;

    const yearlong = calendar.filter(challenge => challenge.fields.Phase === 'Yearlong');
    const phase1 = calendar.filter(challenge => challenge.fields.Phase === 'Phase 1');
    const phase1b = calendar.filter(challenge => challenge.fields.Phase === 'Phase 1B');
    const phase2 = calendar.filter(challenge => challenge.fields.Phase === 'Phase 2');
    const phase2b = calendar.filter(challenge => challenge.fields.Phase === 'Phase 2B');
    const phase3 = calendar.filter(challenge => challenge.fields.Phase === 'Phase 3');
    const phase3b = calendar.filter(challenge => challenge.fields.Phase === 'Phase 3B');
    const phase4 = calendar.filter(challenge => challenge.fields.Phase === 'Phase 4');
    const phase4b = calendar.filter(challenge => challenge.fields.Phase === 'Phase 4B');

    let totalPoints = 0;
    calendar.map(challenge => {
      const points = Number(challenge.fields['Total Points']);
      if (!isNaN(points)) {
        totalPoints += points;
      }
    });

    return (
      <div className="edit-calendar">
        <div className="calendar-accordion my-4 clear" id="accordion" role="tablist">
          {this.renderAccordionCard(yearlong, 'yearlong', 'Yearlong')}
          {this.renderAccordionCard(phase1, 'phase1', 'Phase 1')}
          {this.renderAccordionCard(phase1b, 'phase1b', 'Phase 1B')}
          {this.renderAccordionCard(phase2, 'phase2', 'Phase 2')}
          {this.renderAccordionCard(phase2b, 'phase2b', 'Phase 2B')}
          {this.renderAccordionCard(phase3, 'phase3', 'Phase 3')}
          {this.renderAccordionCard(phase3b, 'phase3b', 'Phase 3B')}
          {this.renderAccordionCard(phase4, 'phase4', 'Phase 4')}
          {this.renderAccordionCard(phase4b, 'phase4b', 'Phase 4B')}
        </div>

        <h5 className="point-total my-3">{totalPoints} Points</h5>

        <ConfirmModal />

      </div>
    );
  }
}

export default EditCalendar;
