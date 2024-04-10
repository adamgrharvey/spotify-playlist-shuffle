export default function shuffleTracks(setCurrPlaylist) {
  setCurrPlaylist((prev) => ({
    ...prev,
    shuffleTracks: prev.tracks,
  }))

  return
}
