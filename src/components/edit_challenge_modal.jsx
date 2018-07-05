import React, { Component } from 'react';
import TilePreview from './tile_preview';

class EditChallengeModal extends Component {
  render() {
    return (
      <div id="edit-challenge-modal" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="edit-challenge-modal-title">Edit Challenge</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body container">
              <div className="row">
                <div className="col">

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input className="form-control" type="date" id="startDate" />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="endDate">Start Date</label>
                        <input className="form-control" type="date" id="startDate" />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="startDate">Required</label>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Required" id="requiredYes" value="Yes" />
                          <label className="form-check-label" htmlFor="requiredYes">Yes</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Required" id="requiredNo" value="No" />
                          <label className="form-check-label" htmlFor="requiredNo">No</label>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="startDate">Verified</label>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Verified" id="verified" value="Verified" />
                          <label className="form-check-label" htmlFor="verified">Verified</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Verified" id="selfReport" value="Self-Report" />
                          <label className="form-check-label" htmlFor="selfReport">Self-Report</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="startDate">Individual</label>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Individual" id="individual" value="Individual" />
                          <label className="form-check-label" htmlFor="individual">Individual</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Individual" id="team" value="Team" />
                          <label className="form-check-label" htmlFor="team">Team</label>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">

                      </div>
                    </div>
                  </div>

                  <form>

                  </form>

                  <div className="form-group">
                    <label htmlFor="tracking">Tracking</label>
                    <select className="form-control" id="tracking">
                      <option>One Time</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Bi-weekly</option>
                      <option>Unlimited</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="trackingText">Tracking Text</label>
                    <input type="text" className="form-control" id="trackingText" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="points">Points</label>
                    <input type="text" className="form-control" id="points" />
                  </div>

                </div>

                <div className="col">

                  <TilePreview
                    imageSrc={'https://d1dyf6uqjwvcrk.cloudfront.net/cfs-file.ashx/__key/CommunityServer-Components-PostAttachments/00-20-57-62-92/shrug.png'}
                    title={'A Cool Challenge Title'}
                    instructions={'YOUR CHALLENGE: Do something!'}
                    description={'This is where you do the stuff'} />

                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-link" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditChallengeModal;
