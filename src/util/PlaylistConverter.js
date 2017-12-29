import Fuzzyset from "fuzzyset";

const PlaylistConverter = {
  convertPlaylist(playlistTracks, DestinationService) {
    let matchList = [];
    let i = 0;
    return playlistTracks
      .reduce(
        (chain, track) =>
          chain.then(() => {
            i++;
            return DestinationService.refinedSearch(
              track.name,
              track.artist
            ).then(searchTracks => {
              let fzSetName = Fuzzyset();
              let fzSetArtist = Fuzzyset();
              fzSetName.add(track.name);
              fzSetArtist.add(track.artist);
              if (!searchTracks || searchTracks.length === 0) {
                matchList = matchList.concat(undefined);
                console.log(
                  i +
                    ": Failure for track:" +
                    track.name +
                    " of: " +
                    track.artist
                );
                return undefined;
        ***REMOVED***

              let trackResult = searchTracks.find(searchTrack => {
                try {
                  return (
                    fzSetName.get(searchTrack.name)[0][0] > 0.7 &&
                    fzSetArtist.get(searchTrack.artist)[0][0] > 0.7
                  );
          ***REMOVED*** catch (err) {
                  console.log(
                    i +
                      ": Failure for track:" +
                      track.name +
                      " of: " +
                      track.artist
                  );
                  return undefined;
          ***REMOVED***
        ***REMOVED***);
              console.log(
                i + ": Success for track:" + track.name + " of: " + track.artist
              );
              matchList = matchList.concat(trackResult);
      ***REMOVED***);
    ***REMOVED***),
        Promise.resolve()
      )
      .then(() => matchList.filter(element => element !== undefined));
***REMOVED***
***REMOVED***

export default PlaylistConverter;
