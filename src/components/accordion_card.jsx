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
  duplicateChallengeInCalendar,
  addChallengeToCalendar,
  updateChallenges,
  selectedCalendar
}) {

  function editPhaseStartDate(e) {
    /* globals $ */
    const phaseStartDate = selectedCalendar.fields[`${phaseTitle} Start Date`];

    let el = e.target;
    console.log(el);
    el.innerHTML = `<input type="date" class="form-control" id="editingPhaseStartDate" value="${phaseStartDate}" />`;

    $('#editingPhaseStartDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingPhaseStartDate').blur((e) => {
      if (selectedCalendar.fields[`${phaseTitle} Start Date`] === e.target.value) {
        el.innerHTML = `${moment(phaseStartDate).format('L')}`;
      } else {
        selectedCalendar.fields[`${phaseTitle} Start Date`] = e.target.value;
        $('#saveNotification').show().html('Saving...');

        let data = {};
        data[`${phaseTitle} Start Date`] = e.target.value;
        data['updated'] = moment().format('l');

        // Update airtable w/ the changes
        base('Calendars').update(selectedCalendar.id, data, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
          el.innerHTML = `${moment(e.target.value).format('L')}`;
        });

      }
    });
  }

  function editPhaseEndDate(e) {
    /* globals $ */
    const phaseEndDate = selectedCalendar.fields[`${phaseTitle} End Date`];

    let el = e.target;
    console.log(el);
    el.innerHTML = `<input type="date" class="form-control" id="editingPhaseEndDate" value="${phaseEndDate}" />`;

    $('#editingPhaseEndDate').focus();

    // When user clicks out of the input, change it back to the original readonly version with the updated data
    $('#editingPhaseEndDate').blur((e) => {
      if (selectedCalendar.fields[`${phaseTitle} End Date`] === e.target.value) {
        el.innerHTML = `${moment(phaseEndDate).format('L')}`;
      } else {
        selectedCalendar.fields[`${phaseTitle} End Date`] = e.target.value;
        $('#saveNotification').show().html('Saving...');

        let data = {};
        data[`${phaseTitle} End Date`] = e.target.value;
        data['updated'] = moment().format('l');

        // Update airtable w/ the changes
        base('Calendars').update(selectedCalendar.id, data, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
          $('#saveNotification').html('Saved.').delay(800).fadeOut(2000);
          el.innerHTML = `${moment(e.target.value).format('L')}`;
        });

      }
    });
  }

  let startDate = '';
  let endDate = '';
  let totalPoints = 0;
  let featuredCount = 0;

  if (selectedCalendar) {
    startDate = selectedCalendar.fields[`${phaseTitle} Start Date`];
    endDate = selectedCalendar.fields[`${phaseTitle} End Date`];
  }

  if (challenges && challenges.length > 0) {

    if (!selectedCalendar || !selectedCalendar.fields[`${phaseTitle} Start Date`]) {
      startDate = moment(challenges[0].fields['Start date']).format('YYYY-MM-DD');
      endDate = moment(challenges[0].fields['End date']).format('YYYY-MM-DD');
    }

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

      // Count how many are Featured Challenges
      if (challenge.fields['Featured Activity'] === 'yes') {
        featuredCount++;
      }
    });
  }

  const formattedStartDate = startDate ? moment(startDate).format('L') : '';
  const formattedEndDate = endDate ? moment(endDate).format('L') : '';

  // Sort challenges within the phase by the Index column
  if (challenges) {
    challenges.sort((a, b) => a.fields['Index'] - b.fields['Index']);
  }

  return (
    <section className="card">

      <div className="card-header" role="tab" id={'header' + phaseId}>
        <div className="mb-0 row">
          <div className="col-md-4">
            <h5 id={'title' + phaseId}>{phaseTitle}</h5>
          </div>
          <div className="col-md-4">
            <h5 id={'dates' + phaseId} className="phase-dates">
              <span onDoubleClick={editPhaseStartDate}>{formattedStartDate}</span>
              <span> - </span>
              <span onDoubleClick={editPhaseEndDate}>{formattedEndDate}</span>
            </h5>
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
                    <th scope="col" className="short-description">Description</th>
                    <th scope="col">Tracking</th>
                    <th scope="col">Category</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Frequency</th>
                    <th scope="col">Points (Total)</th>
                    <th scope="col" className="actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges ? challenges.map((challenge, index) => {
                    return (
                      <Challenge
                        key={index}
                        challenge={challenge}
                        index={index}
                        openPreviewChallengeModal={openPreviewChallengeModal}
                        updateChallenges={updateChallenges}
                        toggleFeaturedChallengeInCalendar={toggleFeaturedChallengeInCalendar}
                        featuredCount={featuredCount}
                        deleteChallengeFromCalendar={deleteChallengeFromCalendar}
                        duplicateChallengeInCalendar={duplicateChallengeInCalendar}
                        selectedCalendar={selectedCalendar}
                      />
                    );
                  }): []}
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
