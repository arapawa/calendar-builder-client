import React from 'react';
import moment from 'moment';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import AddCustomChallenge from './add_custom_challenge';
import Challenge from './challenge';

// Each phase gets its own Card
function AccordionCard({
  challenges,
  phaseId,
  phaseTitle,
  openPreviewChallengeModal,
  toggleFeaturedChallengeInCalendar,
  deleteChallengeFromCalendar,
  addChallengeToCalendar,
  updateChallenges,
  selectedCalendar
}) {

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

  // Sort challenges within the phase by the Index column
  challenges.sort((a, b) => a.fields['Index'] - b.fields['Index']);

  return (
    <section className="card">

      <div className="card-header" role="tab" id={'header' + phaseId}>
        <div className="mb-0 row">
          <div className="col-md-4">
            <h5 id={'title' + phaseId}>{phaseTitle}</h5>
          </div>
          <div className="col-md-4">
            <h5 id={'dates' + phaseId}>{formattedStartDate} - {formattedEndDate}</h5>
          </div>
          <div className="col-md-3">
            <h5 id={'points' + phaseId}>{totalPoints} Points</h5>
          </div>
          <div className="col-md-1">
            <a data-toggle="collapse" href={'#collapse' + phaseId}>
              <h5 className="oi oi-caret-bottom"></h5>
            </a>
          </div>
        </div>
      </div>

      <div id={'collapse' + phaseId} className="collapse show" role="tabpanel">
        <div className="card-body">
          <Droppable droppableId={phaseTitle}>
            {(provided) => (
              <table className="table table-striped"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <thead>
                  <tr>
                    <th scope="col" className="image-header"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Tracking</th>
                    <th scope="col">Category</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Frequency</th>
                    <th scope="col">Points (Total)</th>
                    <th scope="col" className="actions-header"></th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map((challenge, index) => {
                    return (
                      <Challenge
                        key={index}
                        challenge={challenge}
                        index={index}
                        openPreviewChallengeModal={openPreviewChallengeModal}
                        updateChallenges={updateChallenges}
                        toggleFeaturedChallengeInCalendar={toggleFeaturedChallengeInCalendar}
                        deleteChallengeFromCalendar={deleteChallengeFromCalendar}
                        selectedCalendar={selectedCalendar}
                      />
                    );
                  })}
                  {provided.placeholder}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="7">
                      <AddCustomChallenge phaseTitle={phaseTitle} addChallengeToCalendar={addChallengeToCalendar} />
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

export default AccordionCard;
