import { redirectUri } from "./Constants.js";
import fetchJsonp from "fetch-jsonp";

let accessToken = "";
let expiresIn;
let appId = "265642";
let userId = "";

const Deezer = {
  init() {
    return Deezer.getAccessToken();
  },

  getAccessToken() {
    if (sessionStorage.getItem("DeezerToken")) {
      accessToken = sessionStorage.getItem("DeezerToken");
      return Promise.resolve("Successful");
    }

    let url = `https://connect.deezer.com/oauth/auth.php?app_id=${appId}&redirect_uri=${redirectUri}&perms=manage_library&response_type=token`;

    let regExAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let regExExpiresIn = window.location.href.match(/expires=([^&]*)/);
    accessToken = regExAccessToken ? regExAccessToken[1] : "";
    expiresIn = regExExpiresIn ? regExExpiresIn[1] : 0;

    if (accessToken) {
      sessionStorage.setItem("DeezerToken", accessToken);
      window.setTimeout(() => {
        sessionStorage.setItem("DeezerToken", "");
        accessToken = "";
      }, expiresIn * 1000);
      window.location.replace(redirectUri);
    } else {
      window.location.replace(url);
    }
  },

  search(term) {
    let url = `https://api.deezer.com/search?q=track:"${term}"&output=jsonp`;
    return fetchJsonp(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failure searching deezer");
      })
      .then(respJson => {
        if (!respJson || !respJson.data) return undefined;
        return respJson.data.map(track => {
          return {
            id: track.id,
            name: track.title,
            artist: track.artist.name,
            album: track.album.title,
            uri: track.link
          };
        });
      });
  },

  refinedSearch(track, artist) {
    let url = `https://api.deezer.com/search?q=track:"${track}" artist:"${artist}"&output=jsonp`;
    return fetchJsonp(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failure searching deezer");
      })
      .then(respJson => {
        if (!respJson || !respJson.data) return undefined;
        return respJson.data.map(track => {
          return {
            id: track.id,
            name: track.title,
            artist: track.artist.name,
            album: track.album.title,
            uri: track.link
          };
        });
      });
  },

  savePlaylist(playlistName, trackId) {
    if (!(playlistName && trackId.length > 0)) return;
    let playlistId = "";

    let url;
    return Deezer.getUserId().then(() => {
      url = `https://api.deezer.com/user/${userId}/playlists/&output=jsonp&request_method=post&access_token=${accessToken}&title=${playlistName}`;
      fetchJsonp(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure creating playlist deezer");
        })
        .then(respJson => {
          let limit = 50;
          playlistId = respJson.id;
          for (
            let offset = 0;
            offset <= trackId.length - 1;
            offset = offset + limit
          ) {
            url = `http://api.deezer.com/playlist/${playlistId}/tracks/&output=jsonp&access_token=${accessToken}&songs=${trackId
              .slice(offset, offset + limit)
              .join()}&request_method=post`;
            console.log(url);
            fetchJsonp(url)
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error("Failure adding songs deezer");
              })
              .then(respJson => console.log(respJson));
          }
        });
    });
  },

  getUserId() {
    let url =
      "https://api.deezer.com/user/me&output=jsonp&access_token=" + accessToken;

    if (!userId) {
      return fetchJsonp(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure accessing userid deezer");
        })
        .then(respJson => {
          userId = respJson.id;
        });
    } else {
      return Promise.resolve("Success");
    }
  },

  getPlaylists() {
    return Deezer.getUserId().then(() => {
      let url = `https://api.deezer.com/user/${userId}/playlists/&output=jsonp&access_token=${accessToken}`;
      return fetchJsonp(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failure accessing playlists in deezer");
        })
        .then(respJson => {
          return respJson.data.map(element => {
            return {
              identifier: element.id,
              name: element.title
            };
          });
        });
    });
  },

  getNumberOfTracksInPlaylist(playlistId) {
    let url = `https://api.deezer.com/playlist/${playlistId}/tracks&output=jsonp&access_token=${accessToken}`;

    return fetchJsonp(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failure accessing playlist tracks in deezer");
      })
      .then(respJson => {
        return respJson.total;
      });
  },

  getPlaylistTracks(playlistId) {
    return Deezer.getUserId()
      .then(() => {
        let limit = 100;
        let offset = 0;

        return Deezer.getNumberOfTracksInPlaylist(playlistId).then(total => {
          let playListPages = [];
          for (offset = 0; offset <= total; offset = offset + limit) {
            let url = `https://api.deezer.com/playlist/${playlistId}/tracks&output=jsonp&access_token=${accessToken}&index=${offset}&limit=${limit}`;
            playListPages = playListPages.concat(
              fetchJsonp(url)
                .then(response => {
                  if (response.ok) {
                    return response.json();
                  }
                  throw new Error(
                    "Failure accessing playlist tracks in deezer"
                  );
                })
                .then(respJson => {
                  return respJson.data.map(element => {
                    return {
                      id: element.id,
                      name: element.title,
                      artist: element.artist.name,
                      album: element.album.title,
                      uri: element.link
                    };
                  });
                })
            );
          }
          return Promise.all(playListPages);
        });
      })
      .then(playListPages => {
        return [].concat.apply([], playListPages);
      });
  }
};

export default Deezer;
