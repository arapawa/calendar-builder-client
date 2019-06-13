import React from 'react';

function ConfirmFeaturedModal() {
  return (
    <div id="featured-modal" className="modal fade" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="featured-modal-title">Featured Activities</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            ...
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-link" data-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary">...</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmFeaturedModal;
