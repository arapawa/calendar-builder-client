import React, { Component } from 'react';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appN1J6yscNwlzbzq');

class CommentBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showComments: false,
      text: props.challenge.fields['Comment']
    };

    this.toggleComments = this.toggleComments.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggleComments() {
    if (this.state.showComments) {
      this.setState({ showComments: false });

      if (this.state.text && this.state.text.length > 0) {
        base('Challenges').update(this.props.challenge.id, {
          'Comment': this.state.text
        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
        });
      }

    } else {
      this.setState({ showComments: true });
    }
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  renderTextArea() {
    return (
      <div className="tooltip bs-tooltip-bottom comment-box-tooltip">
        <div className="arrow"></div>
        <div className="tooltip-inner comment-box-tooltip-inner">
          <h5 className='my-3'>Comments</h5>
          <textarea value={this.state.text} onChange={this.handleChange}></textarea>
          <button className="btn btn-primary done-button" onClick={this.toggleComments}>Done</button>
        </div>
      </div>
    );
  }

  render() {
    const challenge = this.props.challenge;
    const commentExists = this.state.text && this.state.text.length > 0;

    return (
      <div className="comment-box">
        {
          commentExists ?
          <img className="table-icon" src="images/icon_comment_notification.svg" onClick={this.toggleComments}/> :
          <img className="table-icon" src="images/icon_comment.svg" onClick={this.toggleComments}/>
        }
        {this.state.showComments ? this.renderTextArea() : ''}
      </div>
    );
  }
}

export default CommentBox;
