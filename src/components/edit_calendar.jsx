import React, { Component } from 'react';
import moment from 'moment';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import AccordionCard from './accordion_card';
import ConfirmModal from './confirm_modal';

class EditCalendar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    /* global $ */
    $('.calendar-link').tooltip({
      html: true,
      trigger: 'click'
    });
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

    const hash = this.props.hash;

    return (
      <div className="edit-calendar">

        <div className="calendar-accordion my-4 clear" id="accordion" role="tablist">
          {<AccordionCard
            phase={yearlong} id={'yearlong'} title={'Yearlong'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
          {<AccordionCard
            phase={phase1} id={'phase1'} title={'Phase 1'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
          {<AccordionCard
            phase={phase1b} id={'phase1b'} title={'Phase 1B'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
          {<AccordionCard
            phase={phase2} id={'phase2'} title={'Phase 2'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
          {<AccordionCard
            phase={phase2b} id={'phase2b'} title={'Phase 2B'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
          {<AccordionCard
            phase={phase3} id={'phase3'} title={'Phase 3'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
          {<AccordionCard
            phase={phase3b} id={'phase3b'} title={'Phase 3B'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
          {<AccordionCard
            phase={phase4} id={'phase4'} title={'Phase 4'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
          {<AccordionCard
            phase={phase4b} id={'phase4b'} title={'Phase 4B'}
            challenges={this.props.challenges}
            calendar={this.props.calendar}
            selectChallenge={this.props.selectChallenge}
            selectedClient={this.props.selectedClient}
            selectedCalendar={this.props.selectedCalendar}
            selectedChallenge={this.props.selectedChallenge}
            handleEditChallengeClick={this.props.handleEditChallengeClick}
            addChallengeToCalendar={this.props.addChallengeToCalendar}
            deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar} />}
        </div>

        <h5 className="point-total my-3">{totalPoints} Points</h5>

        <ConfirmModal />

        <div className="buttons">
          <button className="btn btn-primary done-button" onClick={this.props.handleDoneClick}>Done</button>
        </div>

      </div>
    );
  }
}

export default EditCalendar;
