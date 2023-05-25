import { useState, createContext, useContext, useEffect } from "react";
import Authentication from "./Authentication";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import GetCurrUserPlaylists from "./GetCurrUserPlaylists";
import getPlaylistData from "./helpers/getPlaylistData";
import getPlaylistTracks from "./helpers/getPlaylistTracks";

export default function Home(props) {

  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(0);
  const [tokenRefresh, setTokenRefresh] = useState(true);
  const [userAuth, setUserAuth] = useState({});
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [currPlaylist, setCurrPlaylist] = useState({
    data: {},
    tracks: [],
    next: null,
    end: false
    
  });

  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // insert your client id here from spotify
  const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
  const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/";
  const SPACE_DELIMITER = "%20";
  const SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
  ];
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

  useEffect(() => {
    if (tokenRefresh) {
      if (expiresIn === 0) {
        Authentication(setAccessToken, setExpiresIn, setTokenRefresh);
      } else {
        setTokenRefresh(false);
        setTimeout(() => {
          Authentication(setAccessToken, setExpiresIn, setTokenRefresh);
        }, expiresIn * 1000)
      }
    }
  })

  useEffect(() => {
    console.log('userAuth:', userAuth);
  }, [userAuth])

  useEffect(() => {
    if (currPlaylist.next !== null) {
      getPlaylistTracks(userAuth, setCurrPlaylist, currPlaylist.data.id, currPlaylist.next)
    }

  }, [currPlaylist])

  useEffect(() => {
    if (window.location.hash) {
      let userHash = window.location.hash.substring(1).split("&");
      setUserAuth({
        'access_token': userHash[0].split('=')[1],
        'token_type': userHash[1].split('=')[1],
        'expires_in': userHash[2].split('=')[1],
      });
      navigate("/");

    }
  });

  const handleLogin = () => {
    window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  return (
    <>
      <div className="App">
        <h1>hi</h1>
        {userAuth.access_token ? <button onClick={() => {
          GetCurrUserPlaylists(userAuth, setUserPlaylists, "")
        }}>get playlists</button> :
          <button onClick={handleLogin}>login to spotify</button>}
        <div>
          {!currPlaylist.data.id && userPlaylists.items &&
            <div>
              {userPlaylists.previous != null && <button onClick={() => GetCurrUserPlaylists(userAuth, setUserPlaylists, '?' + userPlaylists.previous.split('?')[1])}>previous</button>}
              {userPlaylists.next != null && <button onClick={() => GetCurrUserPlaylists(userAuth, setUserPlaylists, '?' + userPlaylists.next.split('?')[1])}>next</button>}
            </div>}
        </div>
        {!currPlaylist.data.id ? <div>
          {!currPlaylist.data.id && userPlaylists.items && userPlaylists.items.map((playlist, i) =>
            <div key={i}>
              {playlist.images[0] &&
                <img width={42} height={42} src={playlist.images[0].url} alt="image"></img>}
              {playlist.name}
              <button onClick={() => { getPlaylistData(userAuth, setCurrPlaylist, playlist.id) }}>select</button>
            </div>)}
        </div> : <div>
          <button onClick={() => {
            setCurrPlaylist(null);
          }}>back</button>
          {currPlaylist.name}
          {(currPlaylist.next === null && currPlaylist.end) && currPlaylist.tracks.map((track, i) =>
            <div key={`track${i}`}>
              {track.track.album.images && <img width={42} height={42} src={track.track.album.images[0].url} alt="image"></img>}
              {`${track.track.name} by ${track.track.artists[0].name}`}
            </div>)}
        </div>}

      </div>
    </>
  )
}
