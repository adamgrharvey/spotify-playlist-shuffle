import axios from "axios";

export default function getPlaylistData(userAuth, setCurrPlaylist, playlistId, clearPrev) {

  if (clearPrev) {
    setCurrPlaylist({
      data: {},
      tracks: [],
      shuffleTracks: [],
      next: null,
      end: false
    });
  }

  return new Promise((resolve, reject) => {
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `${userAuth.token_type} ${userAuth.access_token}`
      },
    })
      .then((res) => {
        console.log(res.data);
        setCurrPlaylist((prev) => ({
          ...prev,
          data: res.data,
          tracks: [...prev.tracks, ...res.data.tracks.items],
          shuffleTracks: [...prev.shuffleTracks, ...res.data.tracks.items],
          next: res.data.tracks.next
        }));
        console.log('get playlist done');
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      })
  })

}