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
import Track from "./Track";

export default function Home(props) {


  const [AriaCol, setAriaCol] = useState(5);

  const updateMedia = () => {
    if (window.innerWidth < 840) {
      setAriaCol(3);
      return;
    }
    else if (window.innerWidth >= 840 && window.innerWidth < 1080) {
      setAriaCol(4);
      return;
    }
    else {
      setAriaCol(5);
      return;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

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
              <button className="playlistSelect" onClick={() => { getPlaylistData(userAuth, setCurrPlaylist, playlist.id, false) }}>Select</button>
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
            <button onClick={() => shufflePlaylistInPlace(userAuth, currPlaylist, setCurrPlaylist)}>save</button>

            <div>{currPlaylist.data.name}</div>

            
            <div className="contentSpacing">
              <div role="grid" aria-rowcount={`${currPlaylist.tracks.length + 1}`} aria-colcount={`${AriaCol}`} aria-label={`${currPlaylist.data.name}`} className="PlaylistGrid WidthToggle" tabIndex="0">
                <div className="HeaderStyle" style={{ top: "64px" }} role="presentation">
                  <div className="PlaylistHeader GridSizing" role="row" aria-rowindex="1">
                    <div className="PlaylistIndexSpacing" role="columnheader" aria-colindex="1" aria-sort="none" tabIndex="-1">#</div>
                    <div className="PlaylistTitle" role="columnheader" aria-colindex="2" aria-sort="none" tabIndex="-1">
                      <div className="FlexCenter">
                        <span className="standalone-ellipsis-one-line">Title</span>
                      </div>
                    </div>
                    <div className="GridWidthScaling" role="columnheader" aria-colindex="3" aria-sort="none" tabIndex="-1">
                      <div className="FlexCenter">
                        <span className="standalone-ellipsis-one-line">Album</span>
                      </div>
                    </div>
                    <div className="GridWidthScaling" role="columnheader" aria-colindex="4" aria-sort="none" tabIndex="-1">
                      <div className="FlexCenter"><span className="standalone-ellipsis-one-line">Date added</span>
                      </div>
                    </div>
                    <div className="FlexCenter" role="columnheader" aria-colindex="5" aria-sort="none" tabIndex="-1">
                      <div aria-label="Duration" className="FlexCenter DurationSpacing" aria-expanded="false">
                        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" className="durationClock">
                          <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                          <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="" role="presentation">
                  <div role="presentation" />
                  <div role="presentation" style={{ transform: "translateY(0px)" }}>
                    {(currPlaylist.next === null) && currPlaylist.shuffleTracks.map((track, i) =>
                      <Track index={i} key={i + 1} track={track} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}

      </div>
    </>
  )
}
