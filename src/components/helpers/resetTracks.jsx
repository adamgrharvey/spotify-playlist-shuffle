export default function shuffleTracks(tracks, setCurrPlaylist) {

  let outTracks = [...tracks];

  setCurrPlaylist((prev) => ({
    ...prev,
    shuffleTracks: prev.tracks
  }));
  
  return;
}