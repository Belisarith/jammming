import Fuzzyset from "fuzzyset";
import sleep from "sleep-promise";

const PlaylistConverter = {
  convertPlaylist(playlistTracks, DestinationService) {
    let nestedPlaylistTracks = [];
    nestedPlaylistTracks = playlistTracks.reduce(function(rows, key, index) {
      return (
        (index % 500 == 0
          ? rows.push([key])
          : rows[rows.length - 1].push(key)) && rows
      );
    }, []);

    console.log(nestedPlaylistTracks);
    return Promise.all(
      nestedPlaylistTracks.map(playlistChunk =>
        PlaylistConverter.convertPlaylistChunks(
          playlistChunk,
          DestinationService
        )
      )
    ).then(convertedPlaylist => {
      console.log(convertedPlaylist);
      return [].concat.apply([], convertedPlaylist);
    });
  },

  convertPlaylistChunks(playlistTracks, DestinationService) {
    let matchList = [];
    let i = 0;
    console.log(playlistTracks);

    return playlistTracks
      .reduce(
        (chain, track) =>
          chain.then(sleep(30)).then(() => {
            i++;
            let report = "Reporting for: \n" + track.artist + "\n" + track.name;
            return DestinationService.refinedSearch(
              track.name,
              track.artist
            ).then(searchTracks => {
              report += "\n" + JSON.stringify(searchTracks);

              let fzSetName = Fuzzyset();
              let fzSetArtist = Fuzzyset();
              fzSetName.add(track.name);
              fzSetArtist.add(track.artist);
              if (!searchTracks || searchTracks.length === 0) {
                matchList = matchList.concat(undefined);
              }

              let trackResult = searchTracks.find(searchTrack => {
                try {
                  return (
                    fzSetName.get(searchTrack.name)[0][0] > 0.2 &&
                    fzSetArtist.get(searchTrack.artist)[0][0] > 0.2
                  );
                } catch (err) {
                  report +=
                    "\n" +
                    ": Failure for track:" +
                    track.name +
                    " of: " +
                    track.artist;

                  return undefined;
                }
              });
              console.log(report);
              matchList = matchList.concat(trackResult);
            });
          }),
        Promise.resolve()
      )
      .then(() => matchList.filter(element => element !== undefined));
  }
};

export default PlaylistConverter;
