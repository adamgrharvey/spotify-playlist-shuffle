import axios from "axios";

export default async function shufflePlaylistInPlace(userAuth, currPlaylist, setCurrPlaylist) {

  let original = [...currPlaylist.tracks]
  let shuffleTarget = [...currPlaylist.shuffleTracks]

  let headers = {
    Authorization: `${userAuth.token_type} ${userAuth.access_token}`,
    'content-type': 'application/json'
  };

  let index = 0;


  for (let i = 0; i < original.length; i++) {
    let target = shuffleTarget[i].track.id;
    for (let j = 0; j < original.length; j++) {
      if (original[j].track.id === target) {
        await moveItem(headers, currPlaylist, index, j);
        original.splice(j, 1);
        original.splice(index, 0, shuffleTarget[i]);

        index++;
      }
    }
  }

  setCurrPlaylist((prev) => ({
    ...prev,
    tracks: [...prev.shuffleTracks],
  }));
}

const moveItem = function (headers, currPlaylist, index, target) {
  let data = {
    "range_length": 1,
    "insert_before": index,
    "range_start": target
  };

  return new Promise((resolve, reject) => {
    axios({ method: 'put', url: `https://api.spotify.com/v1/playlists/${currPlaylist.data.id}/tracks`, data: data, headers: headers })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      })
  })

}