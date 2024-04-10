export default function removeNonUserPlaylists(userID, userPlaylists, setUserPlaylists) {
  let outPlaylists = []

  for (let i = 0; i < userPlaylists.items.length; i++) {
    if (userID === userPlaylists.items[i].owner.id) {
      outPlaylists.push(userPlaylists.items[i])
    }
  }
  setUserPlaylists((prev) => ({
    ...prev,
    items: outPlaylists,
    next: null,
    end: false,
  }))
}
