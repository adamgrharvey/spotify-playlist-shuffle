export default function shuffleTracks(tracks, setCurrPlaylist) {

  let outTracks = [...tracks];

  setCurrPlaylist((prev) => ({
    ...prev,
    shuffleTracks: outTracks.sort(() => Math.random() - 0.5)
  }));
  
  return;
}