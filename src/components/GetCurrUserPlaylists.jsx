import axios from "axios";

export default function GetCurrUserPlaylists(userAuth, setUserPlaylists, page, currUser) {

  let id = currUser.id;
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
        let data = res.data;
        for (let i = 0; i < data.items.length; i++) {
          console.log(data.items[i].name);
          if (id !== data.items[i].owner.id) {
            data.items.splice(i, 1);
            i = -1;
          }
        }
        data.total = data.items.length;
        if (data.total < 21) {
          data.next = null;
        }
        setUserPlaylists(data);
        resolve(data);
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      })
  })

}