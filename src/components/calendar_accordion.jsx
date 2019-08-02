import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import AccordionCard from './accordion_card';

function CalendarAccordion({
  calendarChallenges,
  updateChallenge,
  onDragEnd,
  openPreviewChallengeModal,
  toggleFeaturedChallengeInCalendar,
  deleteChallengeFromCalendar,
  duplicateChallengeInCalendar,
  addChallengeToCalendar,
  selectedCalendar
}) {
  // Split calendar into phases
  const yearlongChallenges = calendarChallenges['Yearlong'];
  const phaseOneChallenges = calendarChallenges['Phase 1'];
  const phaseTwoChallenges = calendarChallenges['Phase 2'];
  const phaseThreeChallenges = calendarChallenges['Phase 3'];
  const phaseFourChallenges = calendarChallenges['Phase 4'];

  function renderAccordionCard(challenges, phaseId, phaseTitle) {
    return (
      <AccordionCard
        challenges={challenges}
        updateChallenge={updateChallenge}
        phaseId={phaseId}
        phaseTitle={phaseTitle}
        openPreviewChallengeModal={openPreviewChallengeModal}
        toggleFeaturedChallengeInCalendar={toggleFeaturedChallengeInCalendar}
        deleteChallengeFromCalendar={deleteChallengeFromCalendar}
        duplicateChallengeInCalendar={duplicateChallengeInCalendar}
        addChallengeToCalendar={addChallengeToCalendar}
        selectedCalendar={selectedCalendar}
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
