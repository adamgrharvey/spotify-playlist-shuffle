import axios from "axios";

export default function getPlaylistData(userAuth, setCurrPlaylist, playlistId) {

  return new Promise((resolve, reject) => {
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `${userAuth.token_type} ${userAuth.access_token}`
      },
    })
      .then((res) => {
        console.log(res.data);
        setCurrPlaylist(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      })
  })

}