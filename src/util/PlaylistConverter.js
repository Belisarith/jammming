import Fuzzyset from "fuzzyset";
import sleep from "sleep-promise";

const fuzzyThreshold = 0.5;

const PlaylistConverter = {
  convertPlaylist(playlistTracks, DestinationService) {
    let nestSize = playlistTracks.length + 1; // Do not perform searches in parallel.
    let nestedPlaylistTracks = [];
    nestedPlaylistTracks = playlistTracks.reduce(function(rows, key, index) {
      return (
        (index % nestSize === 0
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
          chain
            .then(sleep(30))
            .then(() => {
              i++;
              let report =
                i + ": Reporting for: \n" + track.artist + "\n" + track.name;
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
                  return undefined;
                }

                let filterResults = searchTracks.filter(searchTrack => {
                  return (
                    (fzSetName.get(searchTrack.name)
                      ? fzSetName.get(searchTrack.name)[0][0] > fuzzyThreshold
                      : false) &&
                    (fzSetArtist.get(searchTrack.artist)
                      ? fzSetArtist.get(searchTrack.artist)[0][0] >
                        fuzzyThreshold
                      : false)
                  );
                });

                let trackResult = filterResults.reduce((p, v) => {
                  let prevSum =
                    fzSetName.get(p.name)[0][0] +
                    fzSetArtist.get(p.artist)[0][0];
                  let thisSum =
                    fzSetName.get(v.name)[0][0] +
                    fzSetArtist.get(v.artist)[0][0];

                  return prevSum > thisSum ? p : v;
                }, filterResults[0]);

                if (trackResult) {
                  report +=
                    "\nSelected:\n" +
                    trackResult.artist +
                    "\n" +
                    trackResult.name;
                }

                console.log(report);
                matchList = matchList.concat(trackResult);
              });
            })
            .catch(err => console.log(err)),
        Promise.resolve()
      )
      .then(() => matchList.filter(element => element !== undefined));
  }
};

export default PlaylistConverter;
