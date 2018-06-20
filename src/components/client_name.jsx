import React, { Component } from 'react';

class ClientName extends Component {
  render() {
    return (
      <h4 className="client-name my-5">{this.props.selectedClient.fields['Account Name']}</h4>
    );
  }
}

export default ClientName;
