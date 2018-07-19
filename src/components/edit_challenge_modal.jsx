import React, { Component } from 'react';
import TilePreview from './tile_preview';

class EditChallengeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamSizeVisible: false,
      unitsVisible: false,
      startDate: '',
      endDate: '',
      verified: '',
      individual: '',
      rewardOccurrence: '',
      activityTrackingType: '',
      trackingText: '',
      activityGoal: '',
      points: '',
      title: '',
      instructions: '',
      description: ''
    };

    this.setTitle = this.setTitle.bind(this);
    this.setInstructions = this.setInstructions.bind(this);
    this.setDescription = this.setDescription.bind(this);
  }

  componentDidMount() {
    const challenge = this.props.challenge;
    this.setState({
      startDate: challenge.fields['Start date'],
      endDate: challenge.fields['End date'],
      verified: challenge.fields['Verified'] === 'Verified',
      individual: challenge.fields['Team Activity'] === 'yes',
      rewardOccurrence: challenge.fields['Reward Occurrence'],
      activityTrackingType: challenge.fields['Activity Tracking Type'],
      trackingText: challenge.fields['Activity Goal Text'],
      activityGoal: challenge.fields['Activity Goal'],
      points: challenge.fields['Points'],
      title: challenge.fields['Title'],
      instructions: challenge.fields['Instructions'],
      description: challenge.fields['More Information Html']
    });
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

  updateChallenge(challenge) {
    console.log(challenge);
    //this.props.updateEditingChallenge(challenge);
  }

  setStartDate(e) {
    this.setState({ startDate: e.target.value });
  }

  setEndDate(e) {
    this.setState({ endDate: e.target.value });
  }

  setVerified(e) {
    console.log(e.target.value);
    this.setState({ verified: e.target.value });
  }

  setIndividual(e) {
    console.log(e.target.value);
    this.setState({ individual: e.target.value });
  }

  setRewardOccurrence(e) {
    this.setState({ rewardOccurrence: e.target.value });
  }

  setActivityTrackingType(e) {
    this.setState({ activityTrackingType: e.target.value });
  }

  setTrackingText(e) {
    this.setState({ trackingText: e.target.value });
  }

  setActivityGoal(e) {
    this.setState({ activityGoal: e.target.value });
  }

  setPoints(e) {
    this.setState({ points: e.target.value });
  }

  setTitle(e) {
    this.setState({ title: e.target.value });
  }

  setInstructions(e) {
    this.setState({ instructions: e.target.value });
  }

  setDescription(e) {
    this.setState({ description: e.target.value });
  }

  render() {
    const challenge = this.props.challenge;

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
                        <input className="form-control" type="date" id="startDate" value={this.state.startDate} onChange={(e) => this.setStartDate(e)} />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input className="form-control" type="date" id="endDate" value={this.state.endDate} onChange={(e) => this.setEndDate(e)} />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="verified">Verified</label>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Verified" id="verified" value="Verified" defaultChecked={this.state.verified} onChange={(e) => this.setVerified(e)} />
                          <label className="form-check-label" htmlFor="verified">Verified</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Verified" id="selfReport" value="Self-Report" defaultChecked={!this.state.verified} onChange={(e) => this.setVerified(e)} />
                          <label className="form-check-label" htmlFor="selfReport">Self-Report</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="individual">Individual</label>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Individual" id="individual" value="Individual"
                            defaultChecked={!this.state.teamActivity} onChange={(e) => this.setIndividual(e)} />
                          <label className="form-check-label" htmlFor="individual">Individual</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Individual" id="team" value="Team"
                            defaultChecked={this.state.teamActivity} onChange={(e) => this.setIndividual(e)} />
                          <label className="form-check-label" htmlFor="team">Team</label>
                        </div>
                      </div>
                    </div>
                    <div className="col" style={this.state.teamSizeVisible ? {} : { display: 'None' }}>
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
                  </div> */}

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="rewardOccurrence">Reward Occurrence</label>
                        <select className="form-control" id="rewardOccurrence" value={this.state.rewardOccurrence} onChange={(e) => this.setRewardOccurrence(e)}>
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
                        <select className="form-control" id="activityTrackingType" value={this.state.activityTrackingType} onChange={(e) => this.setActivityTrackingType(e)}>
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
                        <input type="text" className="form-control" id="trackingText" value={this.state.trackingText} onChange={(e) => this.setTrackingText(e)} />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="activityGoal">Activity Goal</label>
                        <input type="text" className="form-control" id="activityGoal" value={this.state.activityGoal} onChange={(e) => this.setActivityGoal(e)} />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-3">
                      <div className="form-group">
                        <label htmlFor="points">Points</label>
                        <input type="text" className="form-control" id="points" value={this.state.points} onChange={(e) => this.setPoints(e)} />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="col">

                  <TilePreview
                    imageSrc={challenge.fields['Header Image']}
                    title={this.state.title}
                    instructions={this.state.instructions}
                    description={this.state.description}
                    setTitle={this.setTitle}
                    setInstructions={this.setInstructions}
                    setDescription={this.setDescription}
                  />

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
