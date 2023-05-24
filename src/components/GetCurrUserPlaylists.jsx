import axios from "axios";

export default function GetCurrUserPlaylists(userAuth, setUserPlaylists, page) {
  console.log(page);

  /*

    userState = {
      access_token = ...
      token_type: Bearer
      expires_in: ...
    }

  */

  return new Promise((resolve, reject) => {
    axios.get(`https://api.spotify.com/v1/me/playlists${page}`, {
      headers: {
        Authorization: `${userAuth.token_type} ${userAuth.access_token}`
      },
    })
      .then((res) => {
        console.log(res);
        setUserPlaylists(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      })
  })

}