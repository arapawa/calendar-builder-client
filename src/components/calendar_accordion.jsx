import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import AccordionCard from './accordion_card';

class CalendarAccordion extends Component {
  constructor(props) {
    super(props);
  }

  renderAccordionCard(challenges, id, phaseTitle) {
    return (
      <AccordionCard
        id={id}
        challenges={challenges}
        phaseTitle={phaseTitle}
        calendar={this.props.calendar}
        selectedClient={this.props.selectedClient}
        addChallengeToCalendar={this.props.addChallengeToCalendar}
        setPreviewChallenge={this.props.setEditingChallenge}
        deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar}>
      </AccordionCard>
    );
  }

  render() {
    const calendar = this.props.calendar;

    const yearlongChallenges = calendar.filter(challenge => challenge.fields['Phase'] === 'Yearlong');
    const phaseOneChallenges = calendar.filter(challenge => challenge.fields['Phase'] === 'Phase 1');
    const phaseTwoChallenges = calendar.filter(challenge => challenge.fields['Phase'] === 'Phase 2');
    const phaseThreeChallenges = calendar.filter(challenge => challenge.fields['Phase'] === 'Phase 3');
    const phaseFourChallenges = calendar.filter(challenge => challenge.fields['Phase'] === 'Phase 4');

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
