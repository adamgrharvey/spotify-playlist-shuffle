import axios from "axios";

export default function setPlaylistTracks(userAuth, currUser, currPlaylist) {

  let id = currUser.id;
  let tracks = [];

  for (let i = 0; i < currPlaylist.tracks.length; i++) {
    tracks.push({ 'uri': currPlaylist.tracks[i].track.uri })
  }
  /*

    userState = {
      access_token = ...
      token_type: Bearer
      expires_in: ...
    }

  */



  return new Promise((resolve, reject) => {
    axios.delete(`https://api.spotify.com/v1/playlists/${currPlaylist.data.id}/tracks`, {
      headers: {
        Authorization: `${userAuth.token_type} ${userAuth.access_token}`,
        'content-type': 'application/json',
      },
      data: {
        tracks,
        "snapshot_id": currPlaylist.data.snapshot_id
      }
    })
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      })
  })

}