import React from 'react';
import './App.css'

import Searchbar from '../Searchbar/Searchbar.js'
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks :[],
      playlistName: "New Playlist"    
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    Spotify.getAccessToken(); //Ensure that spotify token will be generated at start-up of app. Otherwise, the first search result might be deleted.
  }

  search(searchTerm){    
    if(Spotify.getAccessToken()){
      Spotify.search(searchTerm).then(results=>{
        this.setState(
          {
            searchResults: results
          })
        });
    }    

  }

  updatePlaylistName(playlistName){
    this.setState({playlistName: playlistName});
  }

  addTrack(trackInfo){
    if (!this.state.playlistTracks.every(playlistTrack => playlistTrack.id !== trackInfo.id)) return;  
    this.setState(prevState => {
      return {playlistTracks: [...prevState.playlistTracks,trackInfo]};
    });
  }
  
  removeTrack(trackInfo){
    this.setState(prevState=>{
      return {playlistTracks: prevState.playlistTracks.filter(tr => tr.id !== trackInfo.id)};
    });
  }

  savePlaylist(){
    Spotify.savePlaylist(this.state.playlistName,this.state.playlistTracks.map(track=>track.uri)).then(()=>{
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  render() {
    return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <Searchbar onSearch={this.search}/>
        <div className="App-playlist">
        <SearchResults trackInfos={this.state.searchResults} onAdd={this.addTrack}/>
        <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} trackInfos={this.state.playlistTracks} playlistName={this.state.playlistName} onRemove={this.removeTrack}/>
        </div>
      </div>
    </div>
    );
  }
}

export default App;
