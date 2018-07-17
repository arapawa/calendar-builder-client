import React, { Component } from 'react';
import TilePreview from './tile_preview';

class EditChallengeModal extends Component {
  constructor() {
    super();

    this.state = {
      teamSizeVisible: false,
      unitsVisible: false
    };
  }

  setTeamSizeVisible(visible) {
    this.setState({ teamSizeVisible: visible });
  }

  setUnitsVisible(e) {
    switch (e.target.value) {
      case 'Units':
      case 'Days':
        this.setState({ unitsVisible: true });
        break;
      case 'Event':
        this.setState({ unitsVisible: false });
        break;
    }
  }

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
                        <label htmlFor="verified">Verified</label>
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
                        <label htmlFor="individual">Individual</label>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Individual" id="individual" value="Individual"
                            onChange={() => this.setTeamSizeVisible(false)} />
                          <label className="form-check-label" htmlFor="individual">Individual</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Individual" id="team" value="Team"
                            onChange={() => this.setTeamSizeVisible(true)} />
                          <label className="form-check-label" htmlFor="team">Team</label>
                        </div>
                      </div>
                    </div>
                    <div className="col" style={this.state.teamSizeVisible ? {} : { display: 'none' }}>
                      <div className="form-group">
                        <label htmlFor="minTeamSize">Team Size</label>
                        <div className="row">
                          <div className="col">
                            <label htmlFor="minTeamSize">Min</label>
                            <select className="form-control" id="minTeamSize" defaultValue="4">
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                            </select>
                          </div>
                          <div className="col">
                            <label htmlFor="maxTeamSize">Max</label>
                            <select className="form-control" id="maxTeamSize" defaultValue="12">
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                              <option>6</option>
                              <option>7</option>
                              <option>8</option>
                              <option>9</option>
                              <option>10</option>
                              <option>11</option>
                              <option>12</option>
                              <option>13</option>
                              <option>14</option>
                              <option>15</option>
                              <option>16</option>
                              <option>17</option>
                              <option>18</option>
                              <option>19</option>
                              <option>20</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="rewardOccurrence">Reward Occurrence</label>
                        <select className="form-control" id="rewardOccurrence">
                          <option>Once</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                          <option>Bi-weekly</option>
                          <option>Unlimited</option>
                        </select>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="activityTrackingType">Activity Tracking Type</label>
                        <select className="form-control" id="activityTrackingType" onChange={(e) => this.setUnitsVisible(e)}>
                          <option>Event</option>
                          <option>Days</option>
                          <option>Units</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="trackingText">Tracking Text</label>
                        <input type="text" className="form-control" id="trackingText" />
                      </div>
                    </div>
                    <div className="col" style={this.state.unitsVisible ? {} : { opacity: 0 }}>
                      <div className="form-group">
                        <label htmlFor="activityGoal">Activity Goal</label>
                        <input type="text" className="form-control" id="activityGoal" />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-3">
                      <div className="form-group">
                        <label htmlFor="points">Points</label>
                        <input type="text" className="form-control" id="points" />
                      </div>
                    </div>
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
              <button type="button" className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditChallengeModal;
