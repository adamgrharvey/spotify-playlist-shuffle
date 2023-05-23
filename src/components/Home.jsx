import { useState, createContext, useContext, useEffect } from "react";
import Authentication from "./Authentication";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

export default function Home(props) {

  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(0);
  const [tokenRefresh, setTokenRefresh] = useState(true);
  const [userAuth, setUserAuth] = useState({});

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
    console.log('userAuth:',  userAuth);
  }, [userAuth])

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
        <button onClick={handleLogin}>login to spotify</button>
      </div>
    </>
  )
}
