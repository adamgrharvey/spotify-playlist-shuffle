import axios from "axios";

export default function GetCurrUser(userAuth, setCurrUser) {


  /*

    userState = {
      access_token = ...
      token_type: Bearer
      expires_in: ...
    }

  */

  return new Promise((resolve, reject) => {
    axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `${userAuth.token_type} ${userAuth.access_token}`
      },
    })
      .then((res) => {
        console.log(res.data);
        setCurrUser(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err)
        reject(err);
      })
  })

}