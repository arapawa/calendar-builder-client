import React, { Component } from 'react';

class ClientSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      searchText: this.props.selectedClient || ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (e.target.value) {
      this.setState({ open: true, searchText: e.target.value });
    } else {
      this.setState({ open: false, searchText: '' });
    }
  }

  selectClient(client) {
    const name = client.fields['Account Name'];
    this.props.selectClient(client);
    this.setState({ open: false, searchText: name });
  }

  renderClient(client) {
    const name = client.fields['Account Name'];
    return (
      <span className="dropdown-item" key={name}
        onClick={() => this.selectClient(client)}>
        {name}
      </span>
    );
  }

  render() {
      const filteredClients = this.props.clients.filter(client => {
      const name = client.fields['Account Name'].toLowerCase();
      const searchText = this.state.searchText.toLowerCase();
      return name.includes(searchText);
    });

    return (
      <div className="client-select">
        <h5>Select Client</h5>
        <div className="dropdown">
          <div className="client-search input-group">
            <input value={this.state.searchText} onChange={this.handleChange} type="text" className="form-control" placeholder="Client" />
            <span className="oi oi-magnifying-glass"></span>
          </div>

          <div className={'client-list dropdown-menu ' + (this.state.open ? 'show' : '')}>
            {filteredClients.length ? filteredClients.map(client => this.renderClient(client)) : ''}
          </div>
        </div>
      </div>
    );
  }
}

export default ClientSelect;
