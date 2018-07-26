import React, { Component } from 'react';

class CategoryTotals extends Component {
  render() {
    let hfTotal = 0;
    let gdTotal = 0;
    let csTotal = 0;
    let mpTotal = 0;

    this.props.calendar.map(challenge => {
      switch (challenge.fields['Category']) {
        case 'Health and Fitness':
          hfTotal += 1;
          break;
        case 'Growth and Development':
          gdTotal += 1;
          break;
        case 'Contribution and Sustainability':
          csTotal += 1;
          break;
        case 'Money and Prosperity':
          mpTotal += 1;
          break;
      }
    });

    return (
      <div id="categoryTotals">
        <h5>Category Totals</h5>
        <img className="table-icon" src="images/HP_Icon_Health_Fitness.png" />
        <span>{hfTotal}</span>
        <img className="table-icon" src="images/HP_Icon_Growth_Development.png" />
        <span>{gdTotal}</span>
        <img className="table-icon" src="images/HP_Icon_Contribution_Sustainability.png" />
        <span>{csTotal}</span>
        <img className="table-icon" src="images/HP_Icon_Money_Prosperity.png" />
        <span>{mpTotal}</span>
      </div>
    );
  }
}

export default CategoryTotals;
