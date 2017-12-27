import React from "react";
import "./Tracklist.css";
import Track from "../Track/Track.js";

class Tracklist extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.trackInfos.map(trackInfo => (
          <Track
            key={trackInfo.id}
            trackInfo={trackInfo}
            isRemoval={this.props.isRemoval}
            onAdd={this.props.onAdd}
            onRemove={this.props.onRemove}
          />
        ))}
      </div>
    );
  }
}

export default Tracklist;
