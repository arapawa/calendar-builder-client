import React, { Component } from 'react';
import moment from 'moment';
import crypto from 'crypto';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

import Header from './header';
import ClientName from './client_name';

class AddCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      template: null,
      startDate: null,
      endDate: null,
      oneTimePoints: null,
      weeklyPoints: null,
      teamPoints: null,
      calendar: null
    };

    this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    this.handleChangeOneTimePoints = this.handleChangeOneTimePoints.bind(this);
    this.handleChangeWeeklyPoints = this.handleChangeWeeklyPoints.bind(this);
    this.handleChangeTeamPoints = this.handleChangeTeamPoints.bind(this);

    this.createCalendar = this.createCalendar.bind(this);
    this.submitCalendar = this.submitCalendar.bind(this);
  }

  validateFields() {
    /* globals $ */
    const $startDate = $('#startDate');
    const $endDate = $('#endDate');
    const $oneTimePoints = $('#oneTimePoints');
    const $weeklyPoints = $('#weeklyPoints');
    const $teamPoints = $('#teamPoints');

    let allInputsAreValid = true;

    function validate($element) {
      if ($element.val()) {
        $element.removeClass('is-invalid');
      } else {
        $element.addClass('is-invalid');
        allInputsAreValid = false;
      }
    }

    validate($startDate);
    validate($endDate);
    validate($oneTimePoints);
    validate($weeklyPoints);
    validate($teamPoints);

    return allInputsAreValid;
  }

  createCalendar(records) {
    const { startDate, endDate, oneTimePoints, weeklyPoints, teamPoints } = this.state;

    const phase1start = startDate;
    const phase1bstart = moment(phase1start).add(21, 'days').format('YYYY-MM-DD');
    const phase1end = moment(phase1start).add(90, 'days').format('YYYY-MM-DD');
    const phase2start = moment(phase1end).add(1, 'days').format('YYYY-MM-DD');
    const phase2bstart = moment(phase2start).add(21, 'days').format('YYYY-MM-DD');
    const phase2end = moment(phase2start).add(83, 'days').format('YYYY-MM-DD');
    const phase3start = moment(phase2end).add(1, 'days').format('YYYY-MM-DD');
    const phase3bstart = moment(phase3start).add(21, 'days').format('YYYY-MM-DD');
    const phase3end = moment(phase3start).add(83, 'days').format('YYYY-MM-DD');
    const phase4start = moment(phase3end).add(1, 'days').format('YYYY-MM-DD');
    const phase4bstart = moment(phase4start).add(21, 'days').format('YYYY-MM-DD');
    const phase4end = endDate;

    const employerName = this.props.selectedClient.fields['Limeade e='];
    const programYear = moment(startDate).format('YYYY');
    this.props.setProgramYear(programYear);

    const hash = crypto.randomBytes(14).toString('hex').slice(0, 14);

    // Create the calendar in airtable
    base('Calendars').create({
      hash: hash,
      name: 'Calendar_' + programYear,
      client: employerName,
      year: programYear,
      updated: moment().format('L'),
      status: 'In Progress'
    }, (err, record) => {
      if (err) {
        console.error(err);
        return;
      }
      this.props.selectCalendar(record);
      this.props.handleNextClick();
    });

    // Create all the challenges in airtable
    records.map(record => {
      // Update phase dates based on user input
      switch (record.fields['Phase']) {
        case 'Yearlong':
          record.fields['Start date'] = startDate;
          record.fields['End date'] = endDate;
          break;
        case 'Phase 1':
          record.fields['Start date'] = phase1start;
          record.fields['End date'] = phase1end;
          break;
        case 'Phase 1B':
          record.fields['Start date'] = phase1bstart;
          record.fields['End date'] = phase1end;
          break;
        case 'Phase 2':
          record.fields['Start date'] = phase2start;
          record.fields['End date'] = phase2end;
          break;
        case 'Phase 2B':
          record.fields['Start date'] = phase2bstart;
          record.fields['End date'] = phase2end;
          break;
        case 'Phase 3':
          record.fields['Start date'] = phase3start;
          record.fields['End date'] = phase3end;
          break;
        case 'Phase 3B':
          record.fields['Start date'] = phase3bstart;
          record.fields['End date'] = phase3end;
          break;
        case 'Phase 4':
          record.fields['Start date'] = phase4start;
          record.fields['End date'] = phase4end;
          break;
        case 'Phase 4B':
          record.fields['Start date'] = phase4bstart;
          record.fields['End date'] = phase4end;
          break;
      }

      // Update point values based on user input
      const teamType = record.fields['Team/Ix'];
      const frequency = record.fields['Frequency'];
      const verified = record.fields['Verified'] === 'Yes';

      if (!verified) {
        if (teamType === 'Team') {
          record.fields['Points'] = teamPoints;
        } else {
          if (frequency === 'One Time') {
            record.fields['Points'] = oneTimePoints;
          } else if (frequency === 'Weekly') {
            record.fields['Points'] = weeklyPoints;
          }
        }
      }

      // Save the record to Airtable
      record.fields['EmployerName'] = employerName;
      record.fields['Program Year'] = programYear;
      record.fields['Calendar'] = hash;

      base('Challenges').create(record.fields, (err, record) => {
        if (err) {
          console.error(err);
          return;
        }
      });

    });

    return { employerName, programYear };
  }

  submitCalendar(e) {
    const validated = this.validateFields();
    const { template } = this.state;

    if (validated) {
      let table;

      switch (template) {
        case 'HP 2018 Calendar':
          table = 'Templates';
          break;
        default:
          table = 'EmptyCalendar';
          break;
      }

      base(table).select({
        view: 'Default'
      }).eachPage((records, fetchNextPage) => {

        this.createCalendar(records);

        fetchNextPage();
      }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

  }

  handleChangeTemplate(e) {
    this.setState({ template: e.target.value });
  }

  handleChangeStartDate(e) {
    const date = moment(e.target.value).format('YYYY-MM-DD');
    this.setState({ startDate: date });
  }

  handleChangeEndDate(e) {
    const date = moment(e.target.value).format('YYYY-MM-DD');
    this.setState({ endDate: date });
  }

  handleChangeOneTimePoints(e) {
    this.setState({ oneTimePoints: e.target.value });
  }

  handleChangeWeeklyPoints(e) {
    this.setState({ weeklyPoints: e.target.value });
  }

  handleChangeTeamPoints(e) {
    this.setState({ teamPoints: e.target.value });
  }

  render() {
    return (
      <div className="add-calendar">
        <Header />
        <h2>Create New Calendar</h2>
        <ClientName selectedClient={this.props.selectedClient} />

        <div className="select-template my-5">
          <h5>Select Template:</h5>
          <select id="template" className="form-control" onChange={this.handleChangeTemplate}>
            <option>None</option>
            <option>HP 2018 Calendar</option>
          </select>
        </div>

        <div className="program-dates my-5">
          <h5>Program Dates:</h5>
          <span>Start Date:</span><input id="startDate" className="form-control" type="date" onChange={this.handleChangeStartDate} />
          <span>End Date:</span><input id="endDate" className="form-control" type="date" onChange={this.handleChangeEndDate} />
        </div>

        <div className="point-structure my-5">
          <h5 className="my-4">Point Structure:</h5>
          <p>
            <span>One-Time Challenge:</span>
            <input id="oneTimePoints" className="form-control" type="text" onChange={this.handleChangeOneTimePoints} />
            <span>points</span>
          </p>
          <p>
            <span>Weekly Challenges:</span>
            <input id="weeklyPoints" className="form-control" type="text" onChange={this.handleChangeWeeklyPoints} />
            <span>points</span>
          </p>
          <p>
            <span>Team Challenge:</span>
            <input id="teamPoints" className="form-control" type="text" onChange={this.handleChangeTeamPoints} />
            <span>points</span>
          </p>
        </div>

        <div className="buttons my-5">
          <span className="cancel-button" onClick={this.props.handleCancelClick}>Cancel</span>
          <button className="btn btn-primary next-button" onClick={this.submitCalendar}>Next</button>
        </div>

      </div>
    );
  }
}

export default AddCalendar;
