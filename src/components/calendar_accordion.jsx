import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import AccordionCard from './accordion_card';

function CalendarAccordion({
  calendarChallenges,
  onDragEnd,
  setPreviewChallenge,
  toggleFeaturedChallengeInCalendar,
  deleteChallengeFromCalendar,
  addChallengeToCalendar,
  updateChallenges
}) {
  // Split calendar into phases
  const yearlongChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Yearlong');
  const phaseOneChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Phase 1');
  const phaseTwoChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Phase 2');
  const phaseThreeChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Phase 3');
  const phaseFourChallenges = calendarChallenges.filter(challenge => challenge.fields['Phase'] === 'Phase 4');

  function renderAccordionCard(challenges, phaseId, phaseTitle) {
    return (
      <AccordionCard
        challenges={challenges}
        phaseId={phaseId}
        phaseTitle={phaseTitle}
        setPreviewChallenge={setPreviewChallenge}
        toggleFeaturedChallengeInCalendar={toggleFeaturedChallengeInCalendar}
        deleteChallengeFromCalendar={deleteChallengeFromCalendar}
        addChallengeToCalendar={addChallengeToCalendar}
        updateChallenges={updateChallenges}
      ></AccordionCard>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="calendar-accordion my-4 clear" id="accordion" role="tablist">
        {renderAccordionCard(yearlongChallenges, 'Yearlong', 'Yearlong')}
        {renderAccordionCard(phaseOneChallenges, 'PhaseOne', 'Phase 1')}
        {renderAccordionCard(phaseTwoChallenges, 'PhaseTwo', 'Phase 2')}
        {renderAccordionCard(phaseThreeChallenges, 'PhaseThree', 'Phase 3')}
        {renderAccordionCard(phaseFourChallenges, 'PhaseFour', 'Phase 4')}
      </div>
    </DragDropContext>
  );
}

export default CalendarAccordion;
