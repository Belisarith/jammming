import React from "react";
import "./App.css";

import Searchbar from "../Searchbar/Searchbar.js";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import MusicService from "../../util/MusicService.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: "New Playlist"
  ***REMOVED***;
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.musicService = new MusicService("Spotify");
***REMOVED***

  search(searchTerm) {
    this.musicService.getPlaylists().then(playlists => {
      this.musicService
        .getPlaylistTracks(playlists[5].identifier)
        .then(result => result);
  ***REMOVED***);
    this.musicService.search(searchTerm).then(results => {
      this.setState({
        searchResults: results
***REMOVED***);
  ***REMOVED***);
***REMOVED***

  updatePlaylistName(playlistName) {
    this.setState({ playlistName: playlistName });
***REMOVED***

  addTrack(trackInfo) {
    if (
      !this.state.playlistTracks.every(
        playlistTrack => playlistTrack.id !== trackInfo.id
      )
    )
      return;
    this.setState(prevState => {
      return { playlistTracks: [...prevState.playlistTracks, trackInfo] ***REMOVED***
  ***REMOVED***);
***REMOVED***

  removeTrack(trackInfo) {
    this.setState(prevState => {
      return {
        playlistTracks: prevState.playlistTracks.filter(
          tr => tr.id !== trackInfo.id
        )
***REMOVED***;
  ***REMOVED***);
***REMOVED***

  savePlaylist() {
    this.musicService
      .savePlaylist(this.state.playlistName, this.state.playlistTracks)
      .then(() => {
        this.setState({
          playlistName: "New Playlist",
          playlistTracks: []
  ***REMOVED***);
***REMOVED***);
***REMOVED***

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <Searchbar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              trackInfos={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              onSave={this.savePlaylist}
              onNameChange={this.updatePlaylistName}
              trackInfos={this.state.playlistTracks}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack}
            />
          </div>
        </div>
      </div>
    );
***REMOVED***
}

export default App;
