import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import AccordionCard from './accordion_card';

class CalendarAccordion extends Component {
  renderAccordionCard(challenges, id, phaseTitle) {
    return (
      <AccordionCard
        id={id}
        challenges={challenges}
        phaseTitle={phaseTitle}
        setPreviewChallenge={this.props.setPreviewChallenge}
        deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar}
        addChallengeToCalendar={this.props.addChallengeToCalendar}
        updateChallenges={this.props.updateChallenges}
      ></AccordionCard>
    );
  }

  render() {
    const calendarChallenges = this.props.calendarChallenges;

    // Split calendar into phases
    const yearlongChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Yearlong');
    const phaseOneChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Phase 1');
    const phaseTwoChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Phase 2');
    const phaseThreeChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Phase 3');
    const phaseFourChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Phase 4');

    return (
      <DragDropContext onDragEnd={this.props.onDragEnd}>
        <div className="calendar-accordion my-4 clear" id="accordion" role="tablist">
          {this.renderAccordionCard(yearlongChallenges, 'Yearlong', 'Yearlong', 0)}
          {this.renderAccordionCard(phaseOneChallenges, 'PhaseOne', 'Phase 1', 1)}
          {this.renderAccordionCard(phaseTwoChallenges, 'PhaseTwo', 'Phase 2', 2)}
          {this.renderAccordionCard(phaseThreeChallenges, 'PhaseThree', 'Phase 3', 3)}
          {this.renderAccordionCard(phaseFourChallenges, 'PhaseFour', 'Phase 4', 4)}
        </div>
      </DragDropContext>
    );
  }
}

export default CalendarAccordion;
