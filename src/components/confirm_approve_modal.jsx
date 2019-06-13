import React from 'react';

function ConfirmApproveModal() {
  return (
    <div id="approve-modal" className="modal fade" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="approve-modal-title">Confirmation</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>You are accepting that this calendar is complete and ready to be deployed to your site.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-link" data-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary">Accept</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmApproveModal;
