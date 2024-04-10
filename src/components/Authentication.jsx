import axios from 'axios'

export default function Authentication(setExpiresIn, setTokenRefresh) {
  let clientID = process.env.REACT_APP_SPOTIFY_CLIENT_ID ?? 'ERROR'
  let clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET ?? 'ERROR'

  const queryString = require('query-string')

  axios
    .post(
      'https://accounts.spotify.com/api/token',
      queryString.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: clientID,
          password: clientSecret,
        },
        data: {
          scope: 'playlist-modify-private playlist-modify-public',
        },
      }
    )
    .then((res) => {
      setExpiresIn(res.data.expires_in)
      setTokenRefresh(true)
    })
    .catch((err) => {
      throw new Error(err)
    })

  return
}
