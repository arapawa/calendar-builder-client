import React from 'react';

function PreviewChallengeModal({ challenge }) {
  function trackingDetails(challenge) {
    let activityGoalText = challenge.fields['Activity Goal Text'] ? challenge.fields['Activity Goal Text'] : 'do the activity in the description';
    let trackingDetailsText = '';

    // tracking config details
    let activityGoalNumber = challenge.fields['Activity Goal'];

    // determine if Individual or Team, add tracking text as needed
    if (challenge.fields['Team Activity'] === 'yes') {
      // switch case for device or manual tracking
      switch (challenge.fields['Device Enabled']) {
        // case for device enabled
        case 'yes':
          trackingDetailsText = `To complete this team challenge, collectively ${activityGoalText} at least ${activityGoalNumber} ${challenge.fields['Device Units']}.`;
          break;
        case 'no':
          trackingDetailsText = `To complete this team challenge, collectively track at least ${activityGoalNumber} ${activityGoalText}.`;
          break;
      }
    } else if (challenge.fields['Team Activity'] === 'no') {
      // switch case for Activity Tracking Type
      switch (challenge.fields['Activity Tracking Type']) {
        case 'Event':
          trackingDetailsText = `To complete this challenge, ${activityGoalText}.`;
          break;
        case 'Days':
          trackingDetailsText = `To complete this challenge, ${activityGoalText} on at least ${challenge.fields['Activity Goal']} ${(challenge.fields['Activity Goal'] > 1 ? 'separate days' : 'day')} ${(challenge.fields['Reward Occurrence'] === 'Weekly' ? 'each week' : '')}.`;
          break;
        case 'Units':
          // set text based on if it's device or manual tracking
          if (challenge.fields['Device Enabled'] === 'yes') {
            trackingDetailsText = `To complete this challenge, ${activityGoalText} at least ${activityGoalNumber} ${challenge.fields['Device Units']}.`;
          } else {
            trackingDetailsText = `To complete this challenge, track at least ${activityGoalNumber} ${activityGoalText}.`;
          }
          break;
      }
    }

    return trackingDetailsText;
  }

  // sets team size in preview if available/required
  function teamSize(challenge) {
    let teamSizeText = '';
    if (challenge.fields['Team Activity'] === 'yes') {
      teamSizeText = `Team Size:  ${(challenge.fields['Team Size Minimum'] ? challenge.fields['Team Size Minimum'] : '4')}-${(challenge.fields['Team Size Maximum'] ? challenge.fields['Team Size Maximum'] : '12')}`;
    }
    return teamSizeText;
  }

  return (
    <div id="editChallengeModal" className="modal fade" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="edit-challenge-modal-title">Challenge Preview</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <img className="item-info-image" src={challenge.fields['Header Image']} />

            <div className="more-info-container">
              <h3>{challenge.fields['Title']}</h3>
              <p>{trackingDetails(challenge)}</p>
              <p>{teamSize(challenge)}</p>
              <hr/>
              <h4>About this activity:</h4>
              <p dangerouslySetInnerHTML={{ __html: challenge.fields['Instructions'] }}></p>
              <p dangerouslySetInnerHTML={{ __html: challenge.fields['More Information Html'] }}></p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewChallengeModal;
