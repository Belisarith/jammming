import { redirectUri } from "./Constants.js";
import sleep from "sleep-promise";

let accessToken = "";
let expiresIn = "";
let userId = "";
let clientId = "3736c7f452654b798ce2275f6df30cfa";

const Spotify = {
  init() {
    return Spotify.getAccessToken();
  },

  getAccessToken() {
    if (sessionStorage.getItem("SpotifyToken")) {
      accessToken = sessionStorage.getItem("SpotifyToken");
      return Promise.resolve("Successful");
    }

    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=playlist-modify-private playlist-read-private`;

    let regExAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let regExExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    accessToken = regExAccessToken ? regExAccessToken[1] : "";
    expiresIn = regExExpiresIn ? regExExpiresIn[1] : 0;

    if (accessToken) {
      sessionStorage.setItem("SpotifyToken", accessToken);
      window.setTimeout(() => {
        sessionStorage.setItem("SpotifyToken", "");
        accessToken = "";
      }, expiresIn * 1000);
      window.location.replace(redirectUri);
    } else {
      window.location.replace(url);
    }
  },

  refinedSearch(track, artist) {
    track = track.replace("&", "and");
    let url = `https://api.spotify.com/v1/search?q=track:${track}+artist:${artist}&type=track&offset=0&limit=25`;

    return fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Connection failed!");
      })
      .then(respJson => {
        if (!respJson || !respJson.tracks) return undefined;
        return respJson.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        });
      });
  },

  search(term) {
    let url =
      "https://api.spotify.com/v1/search?type=track&q=" +
      term +
      "&offset=0&limit=25";

    return fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Connection failed!");
      })
      .then(respJson => {
        if (!respJson || !respJson.tracks) return undefined;
        return respJson.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        });
      });
  },

  savePlaylist(playlistName, trackUri) {
    if (!(playlistName && trackUri.length > 0)) return;
    let playlistID = "";
    let limit = 100;

    trackUri = [...new Set(trackUri)];

    return Spotify.getUserId().then(() => {
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: playlistName,
          public: "true"
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure retrieving Spotify-playlistId");
        })
        .then(respJson => {
          playlistID = respJson.id;

          let nestedTrackUris = trackUri.reduce(function(rows, key, index) {
            return (
              (index % limit === 0
                ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows
            );
          }, []);

          return nestedTrackUris.reduce((chain, chunk) => {
            return chain.then(sleep(100)).then(() => {
              console.log(chunk);
              return fetch(
                `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
                {
                  method: "POST",
                  headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    uris: chunk
                  })
                }
              );
            });
          }, Promise.resolve());
        });
    });
  },

  getUserId() {
    if (!userId) {
      return fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure retrieving Spotify-userId"); //TODO: What good are uncaught exceptions???
        })
        .then(respJson => (userId = respJson.id));
    } else {
      return Promise.resolve("Success");
    }
  },

  getPlaylists() {
    return Spotify.getUserId().then(() => {
      let url = `https://api.spotify.com/v1/users/${userId}/playlists`;
      return fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure retrieving Spotify playlists"); //TODO: What good are uncaught exceptions???
        })
        .then(respJson => {
          return respJson.items.map(playList => {
            return {
              identifier: playList.id,
              name: playList.name
            };
          });
        });
    });
  },

  getNumberOfTracksInPlaylist(playlistId) {
    return Spotify.getUserId().then(() => {
      let url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;

      return fetch(url, {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure retrieving songs from Spotify playlist"); //TODO: What good are uncaught exceptions???
        })
        .then(respJson => {
          return respJson.total;
        });
    });
  },

  getPlaylistTracks(playlistId) {
    return Spotify.getUserId().then(() => {
      let limit = 100;
      let offset = 0;
      return Spotify.getNumberOfTracksInPlaylist(playlistId)
        .then(total => {
          let playListPages = [];
          for (offset = 0; offset <= total; offset = offset + limit) {
            let url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`;
            playListPages = playListPages.concat(
              fetch(url, {
                method: "GET",
                headers: { Authorization: "Bearer " + accessToken }
              })
                .then(response => {
                  if (response.ok) {
                    return response.json();
                  }
                  throw new Error(
                    "Failure retrieving songs from Spotify playlist"
                  ); //TODO: What good are uncaught exceptions???
                })
                .then(respJson => {
                  return respJson.items.map(element => {
                    return {
                      id: element.track.id,
                      name: element.track.name,
                      artist: element.track.artists[0].name,
                      album: element.track.album.name,
                      uri: element.track.uri
                    };
                  });
                })
            );
          }
          return Promise.all(playListPages);
        })
        .then(playListPages => {
          return [].concat.apply([], playListPages);
        });
    });
  }
};

export default Spotify;
