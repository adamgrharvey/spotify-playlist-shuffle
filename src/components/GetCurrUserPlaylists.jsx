import axios from 'axios'

export default function GetCurrUserPlaylists(userAuth, setUserPlaylists, apiLink) {
  setUserPlaylists({
    items: [],
    next: null,
    end: false,
  })

  let api = `https://api.spotify.com/v1/me/playlists`

  if (apiLink !== null) {
    api = apiLink
  }

  return new Promise((resolve, reject) => {
    axios
      .get(api, {
        headers: {
          Authorization: `${userAuth.token_type} ${userAuth.access_token}`,
        },
      })
      .then((res) => {
        let data = res.data
        setUserPlaylists((prev) => ({
          ...prev,
          items: [...prev.items, ...res.data.items],
          next: res.data.next,
          end: true,
        }))

        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
