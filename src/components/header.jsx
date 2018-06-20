import React, { Component } from 'react';

class Header extends Component {
  reloadPage() {
    window.location.reload();
  }

  render() {
    return (
      <div className="header">
        <a onClick={this.reloadPage}>
          <img className="home-button" src="images/icon_home.svg" />
        </a>
        <img className="logo" src="images/ADURO-Logo-Horizontal.png" />
        <h3 className="my-4">Calendar Builder</h3>
      </div>
    );
  }
}

export default Header;
