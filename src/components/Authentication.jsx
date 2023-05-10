import { useState, createContext, useContext } from "react";
import axios from "axios";

export default function Authentication(accessToken, setAccessToken) {

  let clientID = process.env.REACT_APP_SPOTIFY_CLIENT_ID ?? 'ERROR';
  let clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET ?? 'ERROR';


  const queryString = require('query-string');

  if (accessToken == null) {
    axios.post('https://accounts.spotify.com/api/token', queryString.stringify({ 'grant_type': 'client_credentials' }), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth:
      {
        username: clientID,
        password: clientSecret
      },
    })
      .then((res) => {
        console.log(res);
          setAccessToken(res.data.access_token);
      })
      .catch((err) => {
        console.log(err)
      })

    return;
  }
}

