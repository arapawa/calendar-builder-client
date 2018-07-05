import React, { Component } from 'react';
import TrumbowygBox from './trumbowyg_box';

class TilePreview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="tile-preview">
        <div className="stretchy-wrapper">
          <img className="item-info-image" src={this.props.imageSrc} />
        </div>
        <div id="more-info-container">

          <div id="title-box" className="info-header">
            <h3 className="info-title">{this.props.title}</h3>
          </div>

          <div id="instructions-box" className="info-header">
            <p className="info-title">{this.props.instructions}</p>
          </div>

          <TrumbowygBox text={this.props.description} />

          <div className="item-info-actions">
            <button className="button button-primary">Close</button>
          </div>
        </div>
      </div>
    );
  }
}

export default TilePreview;
