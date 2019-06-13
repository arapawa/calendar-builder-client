import React from 'react';

function Header() {
  function reloadPage() {
    window.location.reload();
  }

  return (
    <div className="header">
      <a onClick={reloadPage}>
        <img className="home-button" src="images/icon_home.svg" />
      </a>
      <img className="logo" src="images/ADURO-Logo-Horizontal.png" />
      <h3 className="my-4">Calendar Builder</h3>
    </div>
  );
}

export default Header;
