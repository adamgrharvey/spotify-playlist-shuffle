import axios from "axios";

export default function getPlaylistTracks(userAuth, setCurrPlaylist, playlistId, apiLink) {

  let api = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  if (apiLink !== null) {
    api = apiLink;
  }

  return new Promise((resolve, reject) => {
      axios.get(api, {
        headers: {
          Authorization: `${userAuth.token_type} ${userAuth.access_token}`
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log(api);
          setCurrPlaylist((prev) => ({
            ...prev,
            tracks: [...prev.tracks, ...res.data.items],
            shuffleTracks: [...prev.shuffleTracks, ...res.data.items],
            next: res.data.next,
            end: true
          }));
          resolve(res.data);
        })
        .catch((err) => {
          console.log(err)
          reject(err);
        })
    }
  )

}