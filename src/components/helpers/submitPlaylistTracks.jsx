import axios from 'axios'
import getPlaylistTracks from './getPlaylistTracks'
export default function submitPlaylistTracks(userAuth, currUser, currPlaylist) {
  let id = currUser.id
  let newTracks = []

  for (let i = 0; i < currPlaylist.tracks.length; i++) {
    newTracks.push(currPlaylist.shuffleTracks[i].track.uri)
  }
  /*
    userState = {
      access_token = ...
      token_type: Bearer
      expires_in: ...
    }
  */
  let data = {
    uris: newTracks,
    position: 0,
  }
  let headers = {
    Authorization: `${userAuth.token_type} ${userAuth.access_token}`,
    'content-type': 'application/json',
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `https://api.spotify.com/v1/playlists/${currPlaylist.data.id}/tracks`,
      data: data,
      headers: headers,
    })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
        throw new Error(err)
      })
  })
}
