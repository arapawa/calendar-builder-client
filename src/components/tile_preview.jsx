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
            <div className="form-group">
              <input className="form-control" type="text" id="challengeTitle" value={this.props.title} onChange={(e) => this.props.setTitle(e)} />
            </div>
          </div>

          <div id="instructions-box" className="info-header">
            <div className="form-group">
              <textarea className="form-control" type="text" id="challengeInstructions" value={this.props.instructions} onChange={(e) => this.props.setInstructions(e)}></textarea>
            </div>
          </div>

          {
            this.props.instructions === 'THIS TEXT CANNOT BE MODIFIED' ?
            <textarea className="form-control" type="text" id="readOnlyDescription" value={this.props.description} readOnly></textarea> :
            <TrumbowygBox text={this.props.description} onChange={(e) => this.props.setDescription(e)} />
          }

        </div>
      </div>
    );
  }
}

export default TilePreview;
