import React from "react";
import "./Playlist.css";
import Tracklist from "../Tracklist/Tracklist.js";
import PropTypes from "prop-types";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
***REMOVED***

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
***REMOVED***

  render() {
    return (
      <div className="Playlist">
        <input
          value={this.props.playlistName}
          onChange={this.handleNameChange}
        />
        <Tracklist
          trackInfos={this.props.trackInfos}
          isRemoval={true}
          onRemove={this.props.onRemove}
        />
        <a className="Playlist-save" onClick={this.props.onSave}>
          SAVE TO SPOTIFY
        </a>
      </div>
    );
***REMOVED***
}

Playlist.propTypes = {
  onNameChange: PropTypes.func,
  playlistName: PropTypes.string,
  trackInfos: PropTypes.array,
  onRemove: PropTypes.func,
  onSave: PropTypes.func
***REMOVED***

export default Playlist;
