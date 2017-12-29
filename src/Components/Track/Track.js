import React from "react";
import "./Track.css";
import PropTypes from "prop-types";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction() {
    return this.props.isRemoval ? (
      <a className="Track-action" onClick={this.removeTrack}>
        -
      </a>
    ) : (
      <a className="Track-action" onClick={this.addTrack}>
        +
      </a>
    );
  }

  addTrack() {
    this.props.onAdd(this.props.trackInfo);
  }

  removeTrack() {
    this.props.onRemove(this.props.trackInfo);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.trackInfo.name}</h3>
          <p>
            {this.props.trackInfo.artist} | {this.props.trackInfo.album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

Track.propTypes = {
  isRemoval: PropTypes.bool,
  onAdd: PropTypes.func,
  trackInfo: PropTypes.object,
  onRemove: PropTypes.func
};

export default Track;
