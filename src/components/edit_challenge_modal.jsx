import React, { Component } from 'react';
import moment from 'moment';
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
      verified: challenge.fields['Verified'],
      individual: challenge.fields['Team Activity'] === 'no',
      rewardOccurrence: challenge.fields['Reward Occurrence'],
      activityTrackingType: challenge.fields['Activity Tracking Type'],
      trackingText: challenge.fields['Activity Goal Text'] ? challenge.fields['Activity Goal Text'] : '',
      activityGoal: challenge.fields['Activity Goal'] ? challenge.fields['Activity Goal'] : '',
      points: challenge.fields['Points'],
      title: challenge.fields['Title'],
      instructions: challenge.fields['Instructions'] ? challenge.fields['Instructions'].replace(/<[^>]*>/g, '') : '',
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

  setStartDate(e) {
    this.setState({ startDate: e.target.value });
  }

  setEndDate(e) {
    this.setState({ endDate: e.target.value });
  }

  setVerified(e) {
    this.setState({ verified: e.target.value });
  }

  setIndividual(e) {
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

  saveUpdatedChallenge(updatedChallenge) {
    updatedChallenge.fields['Start date'] = this.state.startDate;
    updatedChallenge.fields['End date'] = this.state.endDate;
    updatedChallenge.fields['Verified'] = this.state.verified;
    updatedChallenge.fields['Team Activity'] = this.state.individual ? 'no' : 'yes';
    updatedChallenge.fields['Reward Occurrence'] = this.state.rewardOccurrence;
    updatedChallenge.fields['Activity Tracking Type'] = this.state.activityTrackingType;
    updatedChallenge.fields['Activity Goal Text'] = this.state.trackingText;
    updatedChallenge.fields['Activity Goal'] = this.state.activityGoal;
    updatedChallenge.fields['Points'] = this.state.points;
    updatedChallenge.fields['Title'] = this.state.title;
    updatedChallenge.fields['Instructions'] = this.state.instructions;
    updatedChallenge.fields['More Information Html'] = this.state.description;
    updatedChallenge.fields['Content Changed'] = 'yes';

    // Update Total Points based on points and frequency
    const start = moment(this.state.startDate);
    const end = moment(this.state.endDate);
    const dayDifference = end.diff(start, 'days');
    const weeks = Math.ceil(dayDifference / 7);

    switch (this.state.rewardOccurrence) {
      case 'Weekly':
        updatedChallenge.fields['Total Points'] = (this.state.points * weeks).toString();
        break;
      case 'Bi-weekly':
        updatedChallenge.fields['Total Points'] = (this.state.points * 26).toString();
        break;
      case 'Monthly':
        updatedChallenge.fields['Total Points'] = (this.state.points * 12).toString();
        break;
      case 'Unlimited':
        updatedChallenge.fields['Total Points'] = (this.state.points * 4).toString();
        break;
      default:
        updatedChallenge.fields['Total Points'] = this.state.points;
    }

    this.props.updateEditingChallenge(updatedChallenge);
  }

  render() {
    const challenge = this.props.challenge;
    const cannotModify = this.state.instructions === 'THIS TEXT CANNOT BE MODIFIED';

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
                          <input className="form-check-input" type="radio" name="Verified" id="verified" value="Verified"
                            checked={this.state.verified === 'Verified'} onChange={(e) => this.setVerified(e)} disabled={cannotModify} />
                          <label className="form-check-label" htmlFor="verified">Verified</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="Verified" id="selfReport" value="Self-Report"
                            checked={this.state.verified === 'Self-Report'} onChange={(e) => this.setVerified(e)} disabled={cannotModify} />
                          <label className="form-check-label" htmlFor="selfReport">Self-Report</label>
                        </div>
                      </div>
                    </div>
                  </div>

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
              <button type="button" className="btn btn-primary" onClick={(e) => this.saveUpdatedChallenge(challenge)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditChallengeModal;
