import React, { Component } from 'react';
import moment from 'moment';
import { DragDropContext } from 'react-beautiful-dnd';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import AccordionCard from './accordion_card';

class CalendarAccordion extends Component {
  constructor(props) {
    super(props);

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    /* global $ */
    $('.calendar-link').tooltip({
      html: true,
      trigger: 'click'
    });
  }

  renderAccordionCard(phase, id, title, index) {
    return (
      <AccordionCard
        phase={phase}
        id={id}
        title={title}
        challenges={this.props.challenges}
        calendar={this.props.calendar}
        selectChallenge={this.props.selectChallenge}
        selectedClient={this.props.selectedClient}
        selectedChallenge={this.props.selectedChallenge}
        handleEditChallengeClick={this.props.handleEditChallengeClick}
        addChallengeToCalendar={this.props.addChallengeToCalendar}
        deleteChallengeFromCalendar={this.props.deleteChallengeFromCalendar}
        setEditingChallenge={this.props.setEditingChallenge}
      >
      </AccordionCard>
    );
  }

  onDragEnd(result) {
    const draggingChallenge = this.props.calendar.filter(challenge => challenge.id === result.draggableId)[0];
    draggingChallenge.fields['Phase'] = result.destination.droppableId;

    // TODO: Also commit the update to airtable
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

    return (

      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="calendar-accordion my-4 clear" id="accordion" role="tablist">
          {this.renderAccordionCard(yearlong, 'yearlong', 'Yearlong', 0)}
          {this.renderAccordionCard(phase1, 'phase1', 'Phase 1', 1)}
          {this.renderAccordionCard(phase2, 'phase2', 'Phase 2', 2)}
          {this.renderAccordionCard(phase3, 'phase3', 'Phase 3', 3)}
          {this.renderAccordionCard(phase4, 'phase4', 'Phase 4', 4)}
        </div>
      </DragDropContext>

    );
  }
}

export default CalendarAccordion;
