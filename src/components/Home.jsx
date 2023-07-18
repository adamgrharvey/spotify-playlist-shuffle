import { useState, useEffect } from "react";
import Authentication from "./Authentication";
import { useNavigate } from "react-router-dom";
import GetCurrUserPlaylists from "./GetCurrUserPlaylists";
import getPlaylistData from "./helpers/getPlaylistData";
import getPlaylistTracks from "./helpers/getPlaylistTracks";
import GetCurrUser from "./helpers/getCurrUser";
import shuffleTracks from "./helpers/shuffleTracks";
import resetTracks from "./helpers/resetTracks";
import shufflePlaylistInPlace from "./helpers/shufflePlaylistInPlace";
import removeNonUserPlaylists from "./helpers/removeNonUserPlaylists";
import useImageColor from 'use-image-color'
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import { Image } from "use-image-color";
import Playlist from "./Playlist";

export function ColorPalette(url) {

  if (url === null) {
    url = "https://i.scdn.co/image/ab67616d0000b2735c133c0318f05040ef9d16b5"
  }

  const { colors } = useImageColor(url, {
    cors: true,
    colors: 2,
    format: 'rgb', // or 'rgb'
    windowSize: 50
  })
  return colors;
}



export default function Home(props) {
  const navigate = useNavigate();
  const [colorTarget, setColorTarget] = useState("https://i.scdn.co/image/ab67616d0000b2735c133c0318f05040ef9d16b5");
  const colorPalette = ColorPalette(colorTarget);
  const [RGB, setRGB] = useState([0, 0, 0]);
  const [accessToken, setAccessToken] = useState(null);
  const [requestedPlaylists, setRequestedPlaylists] = useState(false);
  const [expiresIn, setExpiresIn] = useState(0);
  const [tokenRefresh, setTokenRefresh] = useState(true);
  const [userAuth, setUserAuth] = useState({});
  const [currUser, setCurrUser] = useState({});
  const [saveButtonTxt, setSaveButtonTxt] = useState("Save");
  const [saving, setSaving] = useState(false);

  const [userPlaylists, setUserPlaylists] = useState({
    items: [],
    next: null,
    end: false
  });
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
    if (userAuth.access_token && !requestedPlaylists && !currPlaylist.data.id) {
      setRequestedPlaylists(true);
      GetCurrUserPlaylists(userAuth, setUserPlaylists, null);
    }
  }, [userAuth])

  useEffect(() => {
    if (currPlaylist.next !== null) {
      getPlaylistTracks(userAuth, setCurrPlaylist, currPlaylist.data.id, currPlaylist.next)
    }

  }, [currPlaylist])

  useEffect(() => {
    // console.log(colorPalette[0]);

  }, [colorPalette])



  useEffect(() => {
    if (userPlaylists.next !== null) {
      GetCurrUserPlaylists(userAuth, setUserPlaylists, userPlaylists.next)
    }

    if (userPlaylists.end) {
      removeNonUserPlaylists(currUser.id, userPlaylists, setUserPlaylists);
    }


  }, [userPlaylists])

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
        {colorPalette !== undefined ?
          <div className="backgroundColorChanger" style={{ "background-color": `rgb(${colorPalette[0][0]}, ${colorPalette[0][1]}, ${colorPalette[0][2]})` }}>
          </div>
          :
          <div className="backgroundColorChanger" style={{ "background-color": `rgb(0, 0, 0)` }}>
          </div>}

        <div className="appTitle">Spotify Playlist Scrambler</div>
        {!userAuth.access_token ? <button className="loginButton" onClick={handleLogin}>Login to Spotify</button> : <></>}
        {!currPlaylist.data.id && userAuth.access_token ? <button className="loadButton" onClick={() => {
          GetCurrUserPlaylists(userAuth, setUserPlaylists, null)
        }}>Refresh Playlists</button> : <></>}

        {!currPlaylist.data.id && userAuth.access_token && <div className="descText">Select a Playlist and start scrambling!</div>}

        {!currPlaylist.data.id ? <div className="list">
          {!currPlaylist.data.id && !userPlaylists.end && userPlaylists.next == null && userPlaylists.items.map((playlist, i) =>

            <div className="playlistDiv"
              onMouseOver={() => { setColorTarget(playlist.images[0].url); }}
              onClick={() => { getPlaylistData(userAuth, setCurrPlaylist, playlist.id, false) }}
              key={i}>
              <div className="playlistImage">
                {playlist.images[0] &&
                  <img height={64} src={playlist.images[0].url} alt="image"></img>}
              </div>
              <div className="playlistText" >
                <span>{playlist.name}</span>
              </div>
            </div>)}
        </div> : <div>
          <button className="backButton" onClick={() => {
            setCurrPlaylist({
              data: {},
              tracks: [],
              shuffleTracks: [],
              next: null,
              end: false
            });
          }}>Back to Playlists</button>
          <div>
            {JSON.stringify(currPlaylist.tracks) == JSON.stringify(currPlaylist.shuffleTracks) ? <button disabled={true} onClick={() => resetTracks(currPlaylist.shuffleTracks, setCurrPlaylist)}>Undo</button> : <button disabled={false} onClick={() => resetTracks(currPlaylist.shuffleTracks, setCurrPlaylist)}>Undo</button>}
            <button onClick={() => shuffleTracks(currPlaylist.shuffleTracks, setCurrPlaylist)}>Shuffle</button>
            {JSON.stringify(currPlaylist.tracks) == JSON.stringify(currPlaylist.shuffleTracks) ? <button disabled={true}>{saveButtonTxt}</button> : <LoadingButton loading={saving} loadingIndicator={<CircularProgress sx={{ "position": "relative", "bottom": "15px" }} thickness={4} color="success" size={30} />} className="saveButton" disabled={false}
              onClick={async () => {
                setSaveButtonTxt('')
                setSaving(true);
                await shufflePlaylistInPlace(userAuth, currPlaylist, setCurrPlaylist);
                setSaving(false);
                setSaveButtonTxt('Save');

              }}>{saveButtonTxt}</LoadingButton>}

            <Playlist currPlaylist={currPlaylist} />
          </div>
        </div>}
      </div>
    </>
  )
}