import { redirectUri } from "./Constants.js";
import fetchJsonp from "fetch-jsonp";

let accessToken = "";
let expiresIn;
let appId = "265642";
let userId = "";

const Deezer = {
  init() {
    Deezer.getAccessToken();
  },

  getAccessToken() {
    let url = `https://connect.deezer.com/oauth/auth.php?app_id=${appId}&redirect_uri=${redirectUri}&perms=manage_library&response_type=token`;

    if (accessToken) return true;

    let regExAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let regExExpiresIn = window.location.href.match(/expires=([^&]*)/);
    accessToken = regExAccessToken ? regExAccessToken[1] : "";
    expiresIn = regExExpiresIn ? regExExpiresIn[1] : 0;

    if (!accessToken) {
      window.location.replace(url);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
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
          playlistId = respJson.id;
          url = `http://api.deezer.com/playlist/${playlistId}/tracks/&output=jsonp&access_token=${accessToken}&songs=${trackId.join()}&request_method=post`;
          fetchJsonp(url).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Failure adding songs deezer");
          });
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
    //Implement
  }
};

export default Deezer;
