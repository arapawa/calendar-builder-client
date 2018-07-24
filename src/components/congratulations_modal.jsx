import React, { Component } from 'react';

class CongratulationsModal extends Component {
  render() {
    return (
      <div id="congratulations-modal" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="congratulations-modal-title">Congratulations!</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Your calendar is complete and will be loaded into your site.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CongratulationsModal;
