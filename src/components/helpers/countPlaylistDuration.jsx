export default function countPlaylistDuration(currPlaylist) {
  let totalDurInms = 0

  for (let i = 0; i < currPlaylist.tracks.length; i++) {
    totalDurInms += currPlaylist.tracks[i].track.duration_ms
  }

  return msToTime(totalDurInms)
}

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  if (hours === 1) {
    return `${hours} hr ${minutes} min`
  }
  if (hours >= 1 && hours < 3) {
    return `${hours} hr ${minutes} min`
  }

  if (hours >= 3) {
    return `about ${hours} hr`
  }

  if (hours < 1) {
    return `${minutes} min ${seconds} sec`
  }

  return hours + ':' + minutes + ':' + seconds + '.' + milliseconds
}
