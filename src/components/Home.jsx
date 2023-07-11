import { useState, createContext, useContext, useEffect } from "react";
import Authentication from "./Authentication";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import GetCurrUserPlaylists from "./GetCurrUserPlaylists";
import getPlaylistData from "./helpers/getPlaylistData";
import getPlaylistTracks from "./helpers/getPlaylistTracks";
import GetCurrUser from "./helpers/getCurrUser";
import shuffleTracks from "./helpers/shuffleTracks";
import resetTracks from "./helpers/resetTracks";
import deletePlaylistTracks from "./helpers/deletePlaylistTracks";

export default function Home(props) {

  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(0);
  const [tokenRefresh, setTokenRefresh] = useState(true);
  const [userAuth, setUserAuth] = useState({});
  const [currUser, setCurrUser] = useState({});
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [currPlaylist, setCurrPlaylist] = useState({
    data: {},
    tracks: [],
    shuffleTracks: [],
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
    "playlist-modify-private",
    "playlist-modify-public"
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
    if (userAuth.access_token) {
      GetCurrUser(userAuth, setCurrUser);
    }
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
        <h1>Spotify Playlist Scrambler</h1>
        {userAuth.access_token ? <button onClick={() => {
          GetCurrUserPlaylists(userAuth, setUserPlaylists, "", currUser)
        }}>Get playlists</button> :
          <button onClick={handleLogin}>Login to Spotify</button>}
        <div>
          {!currPlaylist.data.id && userPlaylists.items &&
            <div>
              {userPlaylists.previous != null && <button onClick={() => GetCurrUserPlaylists(userAuth, setUserPlaylists, '?' + userPlaylists.previous.split('?')[1])}>Previous</button>}
              {userPlaylists.next != null && <button className="" onClick={() => GetCurrUserPlaylists(userAuth, setUserPlaylists, '?' + userPlaylists.next.split('?')[1])}>Next</button>}
            </div>}
        </div>
        {!currPlaylist.data.id ? <div className="list">
          {!currPlaylist.data.id && userPlaylists.items && userPlaylists.items.map((playlist, i) =>

            <div className="playlistDiv" key={i}>
              {playlist.images[0] &&
                <img width={42} height={42} src={playlist.images[0].url} alt="image"></img>}
              <div className="playlistText" >{playlist.name}</div>
              <button className="playlistSelect" onClick={() => { getPlaylistData(userAuth, setCurrPlaylist, playlist.id) }}>Select</button>
            </div>)}
        </div> : <div>
          <button onClick={() => {
            setCurrPlaylist({
              data: {},
              tracks: [],
              shuffleTracks: [],
              next: null,
              end: false

            });
          }}>Back</button>
          <div>
          <button onClick={() => resetTracks(currPlaylist.shuffleTracks, setCurrPlaylist)}>reset</button>
            <button onClick={() => shuffleTracks(currPlaylist.shuffleTracks, setCurrPlaylist)}>shuffle</button>
            <button onClick={() => {
              deletePlaylistTracks(userAuth, currUser, currPlaylist)
              setCurrPlaylist({
                data: {},
                tracks: [],
                shuffleTracks: [],
                next: null,
                end: false
              })
              }}>save</button>
            <div>{currPlaylist.data.name}</div>
            {(currPlaylist.next === null) && currPlaylist.shuffleTracks.map((track, i) =>
              <div key={`track${i}`}>
                {track.track.album.images && <img width={42} height={42} src={track.track.album.images[0].url} alt="image"></img>}
                {`${track.track.name} by ${track.track.artists[0].name}`}
              </div>)}
          </div>
        </div>}

      </div>
    </>
  )
}
